class TextToSpeech {
    static SPEAK_DELAY_MS = 50;
    static MAX_VOICE_RETRIES = 50;
    static VOICE_RETRY_DELAY_MS = 100;

    constructor() {
        this.enabled = false;
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.voice = null;
        this.rate = 1.1;
        this.pitch = 1.0;
        this.voicesLoaded = false;
        this.isUnlocked = false;
        this.pendingText = null;
        this.isIOS = this.detectIOS();
        this.initVoice();
    }

    detectIOS() {
        if (typeof window === 'undefined') return false;
        const userAgent = window.navigator.userAgent || window.navigator.vendor || '';
        return /iPad|iPhone|iPod/.test(userAgent) ||
            (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    }

    initVoice() {
        if (!this.synth) return;

        const loadVoices = () => {
            const voices = this.synth.getVoices();
            if (voices.length > 0) {
                this.voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                    voices.find(v => v.lang.startsWith('en')) ||
                    voices[0];
                this.voicesLoaded = true;

                if (this.pendingText && this.enabled && this.isUnlocked) {
                    const text = this.pendingText;
                    this.pendingText = null;
                    this.speakInternal(text);
                }
            }
        };

        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }

        if (!this.voicesLoaded && this.isIOS) {
            this.pollForVoices(loadVoices);
        }
    }

    pollForVoices(loadVoices, retries = 0) {
        if (this.voicesLoaded || retries >= TextToSpeech.MAX_VOICE_RETRIES) return;
        setTimeout(() => {
            loadVoices();
            if (!this.voicesLoaded) {
                this.pollForVoices(loadVoices, retries + 1);
            }
        }, TextToSpeech.VOICE_RETRY_DELAY_MS);
    }

    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled && this.synth) {
            if (!this.isUnlocked) {
                this.unlockSynthesis();
            }
        } else if (!this.enabled && this.synth) {
            this.synth.cancel();
            this.pendingText = null;
        }
        return this.enabled;
    }

    unlockSynthesis() {
        if (!this.synth || this.isUnlocked) return;
        try {
            this.synth.cancel();
            const silentUtterance = new SpeechSynthesisUtterance('');
            silentUtterance.volume = 0;
            silentUtterance.rate = 1;
            silentUtterance.onend = () => { this.isUnlocked = true; };
            silentUtterance.onerror = () => { this.isUnlocked = true; };
            this.synth.speak(silentUtterance);
            this.isUnlocked = true;
        } catch (e) {
            console.warn('Failed to unlock speech synthesis:', e);
            this.isUnlocked = true;
        }
    }

    resumeSynthesis() {
        if (this.synth && this.synth.paused) {
            this.synth.resume();
        }
    }

    speakInternal(text) {
        if (!this.synth || !text) return;
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;

        setTimeout(() => {
            if (this.synth) {
                this.resumeSynthesis();
                this.synth.speak(utterance);
            }
        }, TextToSpeech.SPEAK_DELAY_MS);
    }

    speak(text) {
        if (!this.enabled || !this.synth || !text) return;
        if (!this.voicesLoaded && this.isIOS) {
            this.pendingText = text;
            return;
        }
        this.speakInternal(text);
    }
}

export default new TextToSpeech();
