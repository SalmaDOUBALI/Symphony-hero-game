export default class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
        this.isPlayingMusic = false;
    }

    resume() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    // Synthétiseur simple pour effet sonore
    playTone(freq, type = 'sine', duration = 0.5, time = 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + time + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(this.ctx.currentTime + time);
        osc.stop(this.ctx.currentTime + time + duration);
    }

    playJump() { this.playTone(300, 'triangle', 0.1); }
    playDash() { this.playTone(600, 'sawtooth', 0.2); }
    playHit() { this.playTone(100, 'square', 0.5); }
    
    // Son de piano pour les ennemis (harmonie)
    playEnemyNote() {
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // Do majeur
        const note = scale[Math.floor(Math.random() * scale.length)];
        this.playTone(note, 'sine', 0.8); // Sine wave sonne doux comme un piano électrique
    }

    startMusic() {
        if (this.isPlayingMusic) return;
        this.isPlayingMusic = true;
        this.musicLoop();
    }

    musicLoop() {
        // Boucle de basse simple
        if (!this.isPlayingMusic) return;
        const time = this.ctx.currentTime;
        // Basse
        this.playTone(130.81, 'triangle', 0.5, 0);
        setTimeout(() => this.playTone(196.00, 'triangle', 0.5), 250);
        setTimeout(() => this.playTone(164.81, 'triangle', 0.5), 500);
        setTimeout(() => this.musicLoop(), 1000);
    }
    
    stopMusic() {
        this.isPlayingMusic = false;
    }
}