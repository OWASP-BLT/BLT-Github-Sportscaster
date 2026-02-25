import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Sound Effects ───────────────────────────────────────────────────────────
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.backgroundHum = null;
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.startBackgroundHum();
        }
    }

    startBackgroundHum() {
        if (!this.enabled || !this.audioContext) return;

        // Low electrical hum
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);

        lfo.frequency.setValueAtTime(0.5, this.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);

        gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        this.backgroundHum = { oscillator, gainNode };
    }

    playNote(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playRadioBleep(type = 'on') {
        if (!this.enabled || !this.audioContext) return;
        if (type === 'on') {
            this.playNote(880, 0.05, 'sine', 0.1);
            setTimeout(() => this.playNote(1760, 0.05, 'sine', 0.1), 50);
        } else {
            this.playNote(1760, 0.05, 'sine', 0.1);
            setTimeout(() => this.playNote(880, 0.05, 'sine', 0.1), 50);
        }
    }

    playEventBleep() {
        this.playNote(1200, 0.1, 'square', 0.05);
        setTimeout(() => this.playNote(1500, 0.1, 'square', 0.05), 50);
    }

    playEvent(type) {
        this.playEventBleep();
    }
}

// ─── TTS Manager ─────────────────────────────────────────────────────────────
class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
    }

    speak(text, { onStart, onEnd, onBoundary, rate = 0.9, pitch = 1 } = {}) {
        if (!this.synth) return;
        this.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate; // Slightly slower for more natural feel
        utterance.pitch = pitch;
        utterance.volume = 1;

        // Pick the most natural voice (prefer Google or premium voices)
        const voices = this.synth.getVoices();

        // Priority: Natural English voices
        const naturalVoice = voices.find(v => v.name.includes('Natural')) ||
            voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.name.includes('Microsoft Aria')) ||
            voices.find(v => v.lang === 'en-US' && !v.name.includes('Robot'));

        if (naturalVoice) {
            utterance.voice = naturalVoice;
        }

        utterance.onstart = () => onStart?.();
        utterance.onend = () => onEnd?.();
        utterance.onerror = () => onEnd?.();
        utterance.onboundary = (event) => {
            if (event.name === 'word') onBoundary?.(event);
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    cancel() {
        if (this.synth) this.synth.cancel();
        this.currentUtterance = null;
    }
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useGitHubSportscaster = () => {
    const [events, setEvents] = useState([]);
    const [repositories, setRepositories] = useState(new Map());
    const [leaderboard, setLeaderboard] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, activeRepos: 0, avgScore: 0 });
    const [announcement, setAnnouncement] = useState(null);
    const [aiCommentary, setAICommentary] = useState('');
    const [countdown, setCountdown] = useState(10);
    const [rateLimit, setRateLimit] = useState({ remaining: '-', limit: '-', reset: '-' });
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [mouthOpenLevel, setMouthOpenLevel] = useState(0);

    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isTTSEnabled, setIsTTSEnabled] = useState(true);
    const [isAIEnabled, setIsAIEnabled] = useState(false);

    const [config, setConfig] = useState({
        scope: 'global',
        refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 15,
        aiApiUrl: import.meta.env.VITE_AI_API_URL || '',
        aiApiKey: import.meta.env.VITE_AI_API_KEY || '',
        aiModel: import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini'
    });

    const soundRef = useRef(new SoundEffects());
    const ttsRef = useRef(new TTSManager());
    const seenIds = useRef(new Set());
    const etagRef = useRef(null);
    const lastModifiedRef = useRef(null);
    const mouthTimerRef = useRef(null);
    const isTTSEnabledRef = useRef(isTTSEnabled);
    const isSoundEnabledRef = useRef(isSoundEnabled);

    useEffect(() => { isTTSEnabledRef.current = isTTSEnabled; }, [isTTSEnabled]);
    useEffect(() => { isSoundEnabledRef.current = isSoundEnabled; }, [isSoundEnabled]);

    useEffect(() => {
        let interval;
        if (isSpeaking) {
            interval = setInterval(() => {
                // Occasional jitter in case onboundary is slow or silent
                setMouthOpenLevel(prev => (Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : prev));
            }, 80);
        } else {
            setMouthOpenLevel(0);
        }
        return () => clearInterval(interval);
    }, [isSpeaking]);

    const EVENT_WEIGHTS = {
        PushEvent: 3, PullRequestEvent: 5, IssuesEvent: 2,
        ReleaseEvent: 10, ForkEvent: 4, WatchEvent: 1,
        CreateEvent: 2, DeleteEvent: 1
    };

    const buildSpeechText = (event) => {
        const typeMap = {
            PushEvent: 'just pushed code to',
            PullRequestEvent: 'has opened a pull request on',
            IssuesEvent: 'reported an issue on',
            WatchEvent: 'is now watching',
            ForkEvent: 'forked',
            ReleaseEvent: 'shipped a new release for',
            CreateEvent: 'created',
            DeleteEvent: 'removed data from',
        };
        const action = typeMap[event.eventType] || 'is active on';
        const repo = event.repoName.split('/')[1] || event.repoName;
        return `${event.actor} ${action} ${repo}.`;
    };

    const handleWordBoundary = useCallback(() => {
        clearTimeout(mouthTimerRef.current);
        const level = Math.floor(Math.random() * 4) + 2;
        setMouthOpenLevel(level);
        mouthTimerRef.current = setTimeout(() => setMouthOpenLevel(0), 150);
    }, []);

    const speakAnnouncement = useCallback((event) => {
        if (!isTTSEnabledRef.current) return;
        const text = buildSpeechText(event);

        soundRef.current.playRadioBleep('on');

        ttsRef.current.speak(text, {
            onStart: () => setIsSpeaking(true),
            onEnd: () => {
                setIsSpeaking(false);
                setMouthOpenLevel(0);
                soundRef.current.playRadioBleep('off');
            },
            onBoundary: handleWordBoundary,
            rate: 0.95,
        });
    }, [handleWordBoundary]);

    const fetchActivity = useCallback(async () => {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) headers['Authorization'] = `token ${token}`;

        if (etagRef.current) headers['If-None-Match'] = etagRef.current;
        if (lastModifiedRef.current) headers['If-Modified-Since'] = lastModifiedRef.current;

        try {
            const url = config.scope === 'global'
                ? 'https://api.github.com/events?per_page=100'
                : `https://api.github.com/orgs/${config.scope}/events?per_page=100`;

            const response = await fetch(url, { headers });

            const remaining = response.headers.get('X-RateLimit-Remaining');
            const limit = response.headers.get('X-RateLimit-Limit');
            if (remaining) setRateLimit(prev => ({ ...prev, remaining, limit }));

            if (response.status === 304) return;
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || 'Unknown Error'}`);
            }

            etagRef.current = response.headers.get('ETag');
            lastModifiedRef.current = response.headers.get('Last-Modified');

            const data = await response.json();
            processEvents(data);
        } catch (e) {
            console.error(e);
        }
    }, [config]);

    const processEvents = (newRawEvents) => {
        const filtered = newRawEvents.filter(e => !seenIds.current.has(e.id));
        if (filtered.length === 0) return;

        filtered.forEach(e => seenIds.current.add(e.id));

        const processed = filtered.map(e => ({
            id: e.id,
            repoName: e.repo.name,
            eventType: e.type,
            actor: e.actor.login,
            createdAt: e.created_at
        }));

        setEvents(prev => [...processed, ...prev].slice(0, 50));
        setStats(prev => ({ ...prev, totalEvents: prev.totalEvents + processed.length }));

        if (processed.length > 0) {
            const latest = processed[0];
            setAnnouncement(latest);
            if (isSoundEnabledRef.current) soundRef.current.playEvent(latest.eventType);
            speakAnnouncement(latest);
        }

        setRepositories(prevRepos => {
            const nextRepos = new Map(prevRepos);
            processed.forEach(e => {
                const repo = nextRepos.get(e.repoName) || {
                    name: e.repoName, totalEvents: 0, activityScore: 0,
                    lastActivity: new Date(0), contributors: new Set()
                };
                repo.totalEvents++;
                repo.contributors.add(e.actor);
                repo.lastActivity = new Date(e.createdAt);

                const weight = EVENT_WEIGHTS[e.eventType] || 1;
                repo.activityScore += weight;
                nextRepos.set(e.repoName, repo);
            });

            const sorted = Array.from(nextRepos.values())
                .sort((a, b) => b.activityScore - a.activityScore)
                .slice(0, 10);

            setLeaderboard(sorted);
            const avgScore = sorted.length > 0 ? sorted.reduce((sum, r) => sum + r.activityScore, 0) / sorted.length : 0;
            setStats(prev => ({ ...prev, activeRepos: nextRepos.size, avgScore }));

            return nextRepos;
        });
    };

    const updateConfig = (newConfig) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
        setEvents([]);
        seenIds.current.clear();
        etagRef.current = null;
    };

    useEffect(() => {
        fetchActivity();
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchActivity();
                    return config.refreshInterval;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [config.refreshInterval, fetchActivity]);

    useEffect(() => () => ttsRef.current.cancel(), []);

    return {
        events, leaderboard, stats, announcement, aiCommentary, config, updateConfig,
        toggleSound: () => {
            soundRef.current.initAudio();
            setIsSoundEnabled(s => !s);
        },
        toggleTTS: () => {
            setIsTTSEnabled(t => {
                if (t) ttsRef.current.cancel();
                return !t;
            });
        },
        toggleAI: () => setIsAIEnabled(a => !a),
        isSoundEnabled, isTTSEnabled, isAIEnabled,
        isSpeaking, mouthOpenLevel,
        rateLimit, countdown
    };
};
