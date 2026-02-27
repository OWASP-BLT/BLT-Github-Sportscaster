import { useState, useEffect, useRef, useCallback } from 'react';
import SoundEffects from '../services/SoundEffects';
import TextToSpeech from '../services/TextToSpeech';
import AICommentary from '../services/AiCommentary';

const EVENT_WEIGHTS = {
    PushEvent: 3,
    PullRequestEvent: 5,
    IssuesEvent: 2,
    ReleaseEvent: 10,
    ForkEvent: 4,
    WatchEvent: 1,
    CreateEvent: 2,
    DeleteEvent: 1,
    IssueCommentEvent: 1,
    CommitCommentEvent: 1
};

const PRESET_CHANNELS = {
    trending: { type: 'global', value: '', topics: ['javascript', 'python', 'rust'] },
    web: { type: 'org', value: 'facebook', topics: [] },
    ai: { type: 'org', value: 'openai', topics: [] },
    devops: { type: 'org', value: 'kubernetes', topics: [] }
};

export const useSportscaster = () => {
    const [events, setEvents] = useState([]);
    const [repositories, setRepositories] = useState(new Map());
    const [announcement, setAnnouncement] = useState(null);
    const [aiCommentary, setAiCommentary] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [config, setConfig] = useState({
        scopeType: localStorage.getItem('scope_type') || 'global',
        scopeValue: localStorage.getItem('scope_value') || '',
        eventType: localStorage.getItem('event_type_filter') || 'all',
        ghToken: localStorage.getItem('gh_token') || import.meta.env.VITE_GITHUB_TOKEN || '',
        aiApiUrl: AICommentary.apiUrl,
        aiApiKey: AICommentary.apiKey,
        aiModel: AICommentary.model,
        soundEnabled: true,
        ttsEnabled: false,
        aiEnabled: false
    });

    const [rateLimit, setRateLimit] = useState({ remaining: null, limit: null, resetTime: null });
    const [speed, setSpeed] = useState(parseInt(import.meta.env.VITE_REFRESH_INTERVAL) || 10);
    const [countdown, setCountdown] = useState(speed);
    const [autoProtect, setAutoProtect] = useState(true);
    const [isThrottled, setIsThrottled] = useState(false);

    const seenEventIds = useRef(new Set());
    const etagRef = useRef(null);
    const lastModifiedRef = useRef(null);
    const previousRanks = useRef(new Map());

    const calculateActivityScore = (repo) => {
        const now = new Date();
        let score = 0;

        Object.entries(repo.eventCounts).forEach(([type, count]) => {
            const weight = EVENT_WEIGHTS[type] || 1;
            score += count * weight;
        });

        const hoursSinceLastActivity = (now - new Date(repo.lastActivity)) / (1000 * 60 * 60);
        if (hoursSinceLastActivity < 1) score *= 1.5;
        else if (hoursSinceLastActivity < 24) score *= 1.2;

        score += repo.contributors.size * 2;
        return Math.round(score);
    };

    const fetchEvents = useCallback(async () => {
        let url = 'https://api.github.com/events';
        if (config.scopeType === 'org') url = `https://api.github.com/orgs/${config.scopeValue}/events`;
        if (config.scopeType === 'repo') url = `https://api.github.com/repos/${config.scopeValue}/events`;
        if (config.scopeType === 'user') url = `https://api.github.com/users/${config.scopeValue}/events`;

        try {
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
            };

            // Use Bearer for fine-grained tokens, fall back to token for classic PATs
            if (config.ghToken) {
                const token = config.ghToken.trim();
                if (token.startsWith('github_pat_')) {
                    headers['Authorization'] = `Bearer ${token}`;
                } else {
                    headers['Authorization'] = `token ${token}`;
                }
            }

            if (etagRef.current) headers['If-None-Match'] = etagRef.current;
            if (lastModifiedRef.current) headers['If-Modified-Since'] = lastModifiedRef.current;

            const response = await fetch(url + '?per_page=100', { headers });

            const remaining = response.headers.get('x-ratelimit-remaining');
            const limit = response.headers.get('x-ratelimit-limit');
            const reset = response.headers.get('x-ratelimit-reset');

            if (remaining !== null) {
                setRateLimit({
                    remaining: parseInt(remaining),
                    limit: parseInt(limit),
                    reset: parseInt(reset),
                    resetTime: new Date(parseInt(reset) * 1000).toLocaleTimeString()
                });

                if (autoProtect && parseInt(remaining) < 10) {
                    setIsThrottled(true);
                } else {
                    setIsThrottled(false);
                }
            }

            if (response.status === 401) {
                setError('GitHub API 401: Unauthorized. Your token may be invalid or expired. Check settings.');
                return;
            }

            if (response.status === 403 || response.status === 429) {
                setError('GitHub API Rate Limit Hit. Provide or check your token in settings.');
                return;
            }

            if (response.status === 304) {
                setError(null);
                return;
            }

            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

            etagRef.current = response.headers.get('etag');
            lastModifiedRef.current = response.headers.get('last-modified');

            const data = await response.json();
            processEvents(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [config.scopeType, config.scopeValue, config.ghToken, autoProtect]);

    const processEvents = (newEvents) => {
        const freshEvents = newEvents.filter(e => {
            if (seenEventIds.current.has(e.id)) return false;
            if (config.eventType !== 'all' && e.type !== config.eventType) return false;
            return true;
        });

        if (freshEvents.length === 0) return;

        freshEvents.forEach(e => seenEventIds.current.add(e.id));

        const processed = freshEvents.map(e => ({
            id: e.id,
            eventType: e.type,
            actor: e.actor ? e.actor.login : 'unknown',
            repoName: e.repo.name,
            repoUrl: `https://github.com/${e.repo.name}`,
            createdAt: e.created_at,
            score: EVENT_WEIGHTS[e.type] || 1,
            isNew: true
        }));

        setEvents(prev => {
            const all = [...processed, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return all.slice(0, 100);
        });

        setRepositories(prev => {
            const next = new Map(prev);
            processed.forEach(e => {
                const repo = next.get(e.repoName) || {
                    name: e.repoName,
                    totalEvents: 0,
                    eventCounts: {},
                    contributors: new Set(),
                    activityScore: 0,
                    lastActivity: e.createdAt
                };
                repo.totalEvents += 1;
                repo.eventCounts[e.eventType] = (repo.eventCounts[e.eventType] || 0) + 1;
                repo.contributors.add(e.actor);
                repo.lastActivity = e.createdAt;
                repo.activityScore = calculateActivityScore(repo);
                next.set(e.repoName, repo);
            });
            return next;
        });

        if (processed.length > 0) {
            const latest = processed[0];
            setAnnouncement(latest);
            if (config.soundEnabled) SoundEffects.playEventSound(latest.eventType);

            triggerAICommentary(latest);
        }
    };

    const triggerAICommentary = async (event) => {
        let commentary = AICommentary.generateFallbackCommentary(event);

        if (config.aiEnabled) {
            setIsGeneratingAI(true);
            const aiText = await AICommentary.generateCommentary(event, [...repositories.values()]);
            commentary = aiText;
            setIsGeneratingAI(false);
        }

        setAiCommentary(commentary);

        if (config.ttsEnabled) {
            setIsTalking(true);
            TextToSpeech.speak(commentary);
            setTimeout(() => setIsTalking(false), 5000);
        }
    };

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    fetchEvents();
                    return speed;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchEvents, speed]);

    const toggleSound = () => {
        const newState = SoundEffects.toggle();
        setConfig(prev => ({ ...prev, soundEnabled: newState }));
    };

    const toggleTTS = () => {
        const newState = TextToSpeech.toggle();
        setConfig(prev => ({ ...prev, ttsEnabled: newState }));
    };

    const toggleAI = () => {
        const newState = AICommentary.toggle();
        setConfig(prev => ({ ...prev, aiEnabled: newState }));
    };

    const applyConfig = (newConfig) => {
        localStorage.setItem('scope_type', newConfig.scopeType);
        localStorage.setItem('scope_value', newConfig.scopeValue);
        localStorage.setItem('event_type_filter', newConfig.eventType);
        if (newConfig.ghToken !== undefined) {
            localStorage.setItem('gh_token', newConfig.ghToken.trim());
        }

        setConfig(prev => ({ ...prev, ...newConfig }));
        seenEventIds.current.clear();
        setEvents([]);
        setRepositories(new Map());
        etagRef.current = null;
        lastModifiedRef.current = null;
        setLoading(true);
        setCountdown(speed);
    };

    const selectPreset = (presetId) => {
        const preset = PRESET_CHANNELS[presetId];
        if (preset) {
            applyConfig({
                scopeType: preset.type,
                scopeValue: preset.value,
                eventType: 'all'
            });
        }
    };

    const getTrending = (repoName, currentRank) => {
        const prev = previousRanks.current.get(repoName);
        previousRanks.current.set(repoName, currentRank);
        if (prev === undefined) return { type: 'new', icon: '🆕', text: 'New' };
        if (currentRank < prev) return { type: 'up', icon: '📈', text: `+${prev - currentRank}` };
        if (currentRank > prev) return { type: 'down', icon: '📉', text: `-${currentRank - prev}` };
        return null;
    };

    return {
        events,
        repositories,
        announcement,
        aiCommentary,
        isGeneratingAI,
        isTalking,
        loading,
        error,
        config,
        rateLimit,
        countdown,
        speed,
        autoProtect,
        isThrottled,
        setSpeed,
        setAutoProtect,
        toggleSound,
        toggleTTS,
        toggleAI,
        applyConfig,
        selectPreset,
        getTrending,
        testAiConnection: (c) => AICommentary.testConnection(c)
    };
};
