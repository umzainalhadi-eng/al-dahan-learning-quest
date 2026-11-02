// Audio Engine using Web Audio API (100% offline, zero external dependencies)
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(frequency, type = 'sine', duration = 0.15, gainVal = 0.15) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio playback error', e);
        }
    }

    // Sound effect: Button Click / Pop
    click() {
        this.playTone(600, 'sine', 0.08, 0.08);
    }

    // Sound effect: Coin collect
    coin() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.playTone(987.77, 'sine', 0.1, 0.12); // B5
        setTimeout(() => this.playTone(1318.51, 'sine', 0.25, 0.15), 80); // E6
    }

    // Sound effect: Correct Answer / Success
    success() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.15), idx * 90);
        });
    }

    // Sound effect: Wrong Answer / Error
    wrong() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        this.playTone(220, 'sawtooth', 0.25, 0.12);
        setTimeout(() => this.playTone(174.61, 'sawtooth', 0.35, 0.12), 150);
    }

    // Sound effect: Level Up / Big Fanfare
    levelUp() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.18), idx * 110);
        });
    }

    // Sound effect: Wheel ticking sound
    wheelTick() {
        this.playTone(850, 'square', 0.03, 0.05);
    }

    // Sound effect: Applause / Cheering synthesized simulation
    applause() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        // Generate simulated bursts
        for (let i = 0; i < 24; i++) {
            const delay = Math.random() * 800;
            const freq = 400 + Math.random() * 800;
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.06, 0.05);
            }, delay);
        }
        // Fanfare burst
        setTimeout(() => this.success(), 300);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

window.soundEngine = new SoundEffects();
