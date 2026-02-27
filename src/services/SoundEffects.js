class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.isUnlocked = false;
        this.isIOS = this.detectIOS();
        this.initAudioContext();
    }

    detectIOS() {
        if (typeof window === 'undefined') return false;
        const userAgent = window.navigator.userAgent || window.navigator.vendor || '';
        return /iPad|iPhone|iPod/.test(userAgent) ||
            (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    }

    initAudioContext() {
        if (typeof window === 'undefined') return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    async resumeContext() {
        if (!this.audioContext) return;

        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (e) {
                console.warn('Failed to resume AudioContext:', e);
            }
        }

        if (!this.isUnlocked) {
            this.playWarmUpBuffer();
            this.isUnlocked = true;
        }
    }

    playWarmUpBuffer() {
        if (!this.audioContext) return;
        try {
            const buffer = this.audioContext.createBuffer(1, 1, 22050);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        } catch (e) {
            console.warn('Failed to play warm-up buffer:', e);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
            this.resumeContext();
        }
        return this.enabled;
    }

    playNote(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.audioContext) return;

        this.resumeContext();

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

    playEventSound(eventType) {
        if (!this.enabled) return;

        const sounds = {
            PushEvent: () => {
                this.playNote(392, 0.1, 'square', 0.2);
                setTimeout(() => this.playNote(523, 0.1, 'square', 0.2), 50);
                setTimeout(() => this.playNote(659, 0.15, 'square', 0.2), 100);
            },
            PullRequestEvent: () => {
                this.playNote(523, 0.2, 'sine', 0.3);
                setTimeout(() => this.playNote(659, 0.3, 'sine', 0.3), 150);
            },
            IssuesEvent: () => {
                this.playNote(880, 0.1, 'triangle', 0.25);
                setTimeout(() => this.playNote(880, 0.1, 'triangle', 0.25), 150);
            },
            WatchEvent: () => {
                this.playNote(1047, 0.15, 'sine', 0.2);
            },
            ForkEvent: () => {
                this.playNote(440, 0.15, 'sawtooth', 0.15);
                setTimeout(() => {
                    this.playNote(554, 0.2, 'sawtooth', 0.12);
                    this.playNote(330, 0.2, 'sawtooth', 0.12);
                }, 100);
            },
            CreateEvent: () => {
                this.playNote(523, 0.08, 'sine', 0.2);
                setTimeout(() => this.playNote(659, 0.08, 'sine', 0.2), 60);
                setTimeout(() => this.playNote(784, 0.08, 'sine', 0.2), 120);
                setTimeout(() => this.playNote(1047, 0.15, 'sine', 0.25), 180);
            },
            DeleteEvent: () => {
                this.playNote(587, 0.1, 'triangle', 0.2);
                setTimeout(() => this.playNote(440, 0.1, 'triangle', 0.2), 80);
                setTimeout(() => this.playNote(330, 0.15, 'triangle', 0.2), 160);
            },
            ReleaseEvent: () => {
                this.playNote(523, 0.1, 'square', 0.2);
                setTimeout(() => this.playNote(659, 0.1, 'square', 0.2), 100);
                setTimeout(() => this.playNote(784, 0.1, 'square', 0.2), 200);
                setTimeout(() => this.playNote(1047, 0.3, 'square', 0.25), 300);
            }
        };

        if (sounds[eventType]) {
            sounds[eventType]();
        } else if (['IssueCommentEvent', 'CommitCommentEvent', 'PullRequestReviewCommentEvent'].includes(eventType)) {
            this.playNote(698, 0.08, 'sine', 0.2);
            setTimeout(() => this.playNote(880, 0.12, 'sine', 0.2), 60);
        } else {
            this.playNote(600, 0.1, 'sine', 0.15);
        }
    }
}

export default new SoundEffects();
