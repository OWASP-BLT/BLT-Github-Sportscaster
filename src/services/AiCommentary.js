class AICommentary {
    static MAX_ERROR_DISPLAY_LENGTH = 30;

    constructor() {
        this.enabled = false;
        this.apiUrl = localStorage.getItem('ai_api_url') || import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
        this.apiKey = localStorage.getItem('ai_api_key') || import.meta.env.VITE_AI_API_KEY || '';
        this.model = localStorage.getItem('ai_model') || import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';
        this.isGenerating = false;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    updateConfig(apiUrl, apiKey, model) {
        if (apiUrl) {
            this.apiUrl = apiUrl.trim();
            localStorage.setItem('ai_api_url', this.apiUrl);
        }
        if (apiKey) {
            this.apiKey = apiKey.trim();
            localStorage.setItem('ai_api_key', this.apiKey);
        }
        if (model) {
            this.model = model.trim();
            localStorage.setItem('ai_model', this.model);
        }
    }

    async testConnection(config) {
        const { apiUrl, apiKey, model } = config;

        if (!apiUrl || !apiKey) {
            return { success: false, message: 'API URL and Key are required' };
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Say "OK" to confirm connection.' }],
                    max_tokens: 5
                }),
                signal: AbortSignal.timeout(15000)
            });

            if (response.ok) {
                return { success: true, message: 'Connected ✓' };
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    getPrompt(event, leaderboard) {
        const topRepos = leaderboard.slice(0, 5).map((r, i) =>
            `${i + 1}. ${r.name} (${Math.round(r.activityScore)} points, ${r.totalEvents} events)`
        ).join('\n');

        return `You are an enthusiastic sports announcer providing live play-by-play commentary for GitHub activity. 
Keep your response to 1-2 exciting sentences, using sports metaphors and energy.

Latest Event:
- Repository: ${event.repoName}
- Event Type: ${event.eventType}
- Actor: ${event.actor}
- Time: Just now

Current Leaderboard:
${topRepos}

Generate exciting sports-style commentary for this GitHub event. Be energetic, use sports metaphors, and make it fun!`;
    }

    async generateCommentary(event, leaderboard) {
        if (!this.enabled || this.isGenerating || !this.apiUrl || !this.apiKey) {
            return this.generateFallbackCommentary(event);
        }

        this.isGenerating = true;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: 'You are an enthusiastic sports announcer for GitHub activity.' },
                        { role: 'user', content: this.getPrompt(event, leaderboard) }
                    ],
                    max_tokens: 100,
                    temperature: 0.8
                }),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            return data.choices?.[0]?.message?.content || this.generateFallbackCommentary(event);
        } catch (error) {
            console.warn('AI Commentary error:', error);
            return this.generateFallbackCommentary(event);
        } finally {
            this.isGenerating = false;
        }
    }

    generateFallbackCommentary(event) {
        const templates = {
            PushEvent: [
                `🚀 And ${event.actor} pushes the code forward for ${event.repoName}! The crowd goes wild!`,
                `💪 What a play! ${event.actor} drives it home with a push to ${event.repoName}!`,
                `⚡ ${event.repoName} is on fire! ${event.actor} just landed another push!`
            ],
            PullRequestEvent: [
                `🔀 Breaking news! ${event.actor} opens up the field with a PR for ${event.repoName}!`,
                `🎯 ${event.actor} goes for the merge! ${event.repoName} in the spotlight!`,
                `🤝 Teamwork makes the dream work! ${event.actor} submits a PR to ${event.repoName}!`
            ],
            WatchEvent: [
                `⭐ The fans are loving it! ${event.repoName} gains another star from ${event.actor}!`,
                `🌟 Star power! ${event.actor} shows love for ${event.repoName}!`,
                `✨ ${event.repoName} is trending! ${event.actor} drops a star!`
            ],
            ForkEvent: [
                `🍴 ${event.actor} forks ${event.repoName}! A new challenger approaches!`,
                `🔱 Split play! ${event.actor} branches off from ${event.repoName}!`,
                `📋 ${event.repoName} gets copied! ${event.actor} enters the game!`
            ],
            IssuesEvent: [
                `🐛 Bug spotted! ${event.actor} raises an issue on ${event.repoName}!`,
                `📋 ${event.actor} files a ticket for ${event.repoName}! The debug begins!`,
                `🔍 ${event.repoName} gets a new issue from ${event.actor}!`
            ],
            ReleaseEvent: [
                `🎉 TOUCHDOWN! ${event.repoName} just dropped a new release!`,
                `🚀 It's official! ${event.repoName} ships a new version! What a moment!`,
                `🏆 Release day for ${event.repoName}! The crowd is on their feet!`
            ],
            CreateEvent: [
                `✨ Something new is born! ${event.actor} creates in ${event.repoName}!`,
                `🎨 Fresh start! ${event.actor} kicks things off in ${event.repoName}!`,
                `🌱 Growth alert! ${event.repoName} sees new creation from ${event.actor}!`
            ]
        };

        const eventTemplates = templates[event.eventType] || [
            `🎬 Action in ${event.repoName}! ${event.actor} makes a move!`,
            `📢 ${event.repoName} stays active! ${event.actor} in the game!`,
            `⚡ Activity detected! ${event.actor} works on ${event.repoName}!`
        ];

        return eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    }
}

export default new AICommentary();
