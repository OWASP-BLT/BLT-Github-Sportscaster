import { useState, useEffect, useCallback, useRef } from 'react';

// Manager classes integrated into hook logic
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
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
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playEvent(type) {
        switch (type) {
            case 'PushEvent': this.playNote(392, 0.1, 'square', 0.2); break;
            case 'PullRequestEvent': this.playNote(523, 0.2, 'sine', 0.3); break;
            case 'WatchEvent': this.playNote(1047, 0.15, 'sine', 0.2); break;
            default: this.playNote(600, 0.1, 'sine', 0.15);
        }
    }
}

export const useGitHubSportscaster = () => {
    const [events, setEvents] = useState([]);
    const [repositories, setRepositories] = useState(new Map());
    const [leaderboard, setLeaderboard] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0 });
    const [announcement, setAnnouncement] = useState(null);
    const [aiCommentary, setAICommentary] = useState('');
    const [countdown, setCountdown] = useState(10);
    const [rateLimit, setRateLimit] = useState({ remaining: '-', limit: '-', reset: '-' });

    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);
    const [isAIEnabled, setIsAIEnabled] = useState(false);

    const [config, setConfig] = useState({
        scope: 'global',
        refreshInterval: 10,
        aiApiUrl: '',
        aiApiKey: '',
        aiModel: 'gpt-4o-mini'
    });

    const soundRef = useRef(new SoundEffects());
    const seenIds = useRef(new Set());
    const etagRef = useRef(null);
    const lastModifiedRef = useRef(null);

    const EVENT_WEIGHTS = {
        PushEvent: 3, PullRequestEvent: 5, IssuesEvent: 2,
        ReleaseEvent: 10, ForkEvent: 4, WatchEvent: 1,
        CreateEvent: 2, DeleteEvent: 1
    };

    const fetchActivity = useCallback(async () => {
        const headers = {};
        if (etagRef.current) headers['If-None-Match'] = etagRef.current;
        if (lastModifiedRef.current) headers['If-Modified-Since'] = lastModifiedRef.current;

        try {
            const url = config.scope === 'global'
                ? 'https://api.github.com/events?per_page=100'
                : `https://api.github.com/orgs/${config.scope}/events?per_page=100`;

            const response = await fetch(url, { headers });

            // Update rate limits
            const remaining = response.headers.get('X-RateLimit-Remaining');
            const limit = response.headers.get('X-RateLimit-Limit');
            if (remaining) setRateLimit(prev => ({ ...prev, remaining, limit }));

            if (response.status === 304) return;
            if (!response.ok) throw new Error('API Error');

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
            setAnnouncement(processed[0]);
            if (isSoundEnabled) soundRef.current.playEvent(processed[0].eventType);
        }

        // Update Leaderboard Logic
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

                // Score calculation
                const weight = EVENT_WEIGHTS[e.eventType] || 1;
                repo.activityScore += weight;
                nextRepos.set(e.repoName, repo);
            });

            const sorted = Array.from(nextRepos.values())
                .sort((a, b) => b.activityScore - a.activityScore)
                .slice(0, 10);

            setLeaderboard(sorted);
            return nextRepos;
        });
    };

    const updateConfig = (newConfig) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
        // Reset state on major config change
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

    return {
        events, leaderboard, stats, announcement, aiCommentary, config, updateConfig,
        toggleSound: () => { soundRef.current.initAudio(); setIsSoundEnabled(!isSoundEnabled); },
        toggleTTS: () => setIsTTSEnabled(!isTTSEnabled),
        toggleAI: () => setIsAIEnabled(!isAIEnabled),
        isSoundEnabled, isTTSEnabled, isAIEnabled, rateLimit, countdown
    };
};
