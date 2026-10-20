/**
 * ROMANTIC AUDIO SYSTEM & PROCEDURAL WEB AUDIO SYNTHESIZER
 * - Loads romantic piano/music-box MP3 (60-80 BPM, gentle, warm)
 * - Automatic procedural Web Audio fallback if MP3 fails to load
 * - Gentle "ting" chime sound effect for passcode & gift unlock
 * - Tab visibility pause/resume and session mute persistence
 */

class AudioManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.isMutedByUser = false;
    this.src = window.APP_CONFIG ? window.APP_CONFIG.BGM_SRC : 'assets/audio/romantic_piano.mp3';
    this.toggleBtn = document.getElementById('musicToggleBtn');
    this.audioCtx = null;
    this.synthRunning = false;
    this.synthTimer = null;
    this.masterGain = null;

    this.init();
  }

  init() {
    this.audio = new Audio();
    this.audio.src = this.src;
    this.audio.loop = true;
    this.audio.preload = 'auto';

    // If MP3 fails, switch seamlessly to Web Audio Procedural Synth
    this.audio.addEventListener('error', () => {
      console.warn('[Audio] Không thể tải file MP3, chuyển sang Procedural Web Audio Synth');
      if (this.isPlaying && !this.isMutedByUser) {
        this.startProceduralSynth();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.isPlaying) {
          if (this.audio) this.audio.pause();
          this.pauseProceduralSynth();
        }
      } else {
        if (this.isPlaying && !this.isMutedByUser) {
          if (this.audio && this.audio.src) {
            this.audio.play().catch(() => this.startProceduralSynth());
          } else {
            this.resumeProceduralSynth();
          }
        }
      }
    });

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  unlockAndPlay() {
    this.ensureAudioContext();
    if (this.isMutedByUser) return;

    this.isPlaying = true;
    this.updateUI(true);

    if (this.audio) {
      this.audio.volume = 0;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.fadeVolume(0.42, 1400);
          })
          .catch(err => {
            console.warn('[Audio] File play rejected, falling back to Web Audio Synth:', err);
            this.startProceduralSynth();
          });
      }
    } else {
      this.startProceduralSynth();
    }
  }

  toggle() {
    this.ensureAudioContext();
    if (this.isPlaying) {
      this.isMutedByUser = true;
      this.isPlaying = false;
      if (this.audio) this.audio.pause();
      this.pauseProceduralSynth();
      this.updateUI(false);
    } else {
      this.isMutedByUser = false;
      this.isPlaying = true;
      if (this.audio && !this.synthRunning) {
        this.audio.play()
          .then(() => {
            this.updateUI(true);
            this.fadeVolume(0.42, 800);
          })
          .catch(() => {
            this.startProceduralSynth();
            this.updateUI(true);
          });
      } else {
        this.resumeProceduralSynth();
        this.updateUI(true);
      }
    }
  }

  fadeVolume(targetVol, durationMs) {
    if (!this.audio) return;
    const startVol = this.audio.volume;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      this.audio.volume = startVol + (targetVol - startVol) * progress;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // --- PROCEDURAL SYNTHESIZER (MUSIC-BOX & WARM PAD) ---
  startProceduralSynth() {
    this.ensureAudioContext();
    if (!this.audioCtx || this.synthRunning) return;
    this.synthRunning = true;

    // Chords: Cmaj7 (C E G B), Am7 (A C E G), Fmaj7 (F A C E), G6 (G B D E)
    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 329.63]
    ];

    let chordIdx = 0;
    let stepIdx = 0;

    const playStep = () => {
      if (!this.synthRunning || !this.audioCtx) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[stepIdx % currentChord.length];

      this.playMusicBoxNote(freq * 1.5, 0.16);

      // Play pad note on chord start
      if (stepIdx === 0) {
        this.playPadChord(currentChord, 3.2);
      }

      stepIdx++;
      if (stepIdx >= 8) {
        stepIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }

      this.synthTimer = setTimeout(playStep, 450); // ~66 BPM
    };

    playStep();
  }

  playMusicBoxNote(freq, vel = 0.2) {
    if (!this.audioCtx || this.isMutedByUser) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Exponential bell decay envelope
    gain.gain.setValueAtTime(vel, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  playPadChord(chord, duration = 3.2) {
    if (!this.audioCtx || this.isMutedByUser) return;
    const now = this.audioCtx.currentTime;

    chord.forEach(freq => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  pauseProceduralSynth() {
    this.synthRunning = false;
    if (this.synthTimer) clearTimeout(this.synthTimer);
  }

  resumeProceduralSynth() {
    if (this.isPlaying && !this.isMutedByUser) {
      this.startProceduralSynth();
    }
  }

  // --- SWEET CHIME SFX (TING!) ---
  playChime(type = 'unlock') {
    if (this.isMutedByUser) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    const pitch = (type === 'unlock') ? 1046.50 : 1318.51; // High C6 or E6
    osc.frequency.setValueAtTime(pitch, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  updateUI(playing) {
    if (!this.toggleBtn) return;
    if (playing) {
      this.toggleBtn.classList.add('playing');
      this.toggleBtn.setAttribute('aria-label', 'Tắt nhạc');
    } else {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.setAttribute('aria-label', 'Bật nhạc');
    }
  }
}

window.AudioManager = AudioManager;
