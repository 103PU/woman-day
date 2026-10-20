/**
 * FLOW CONTROLLER & STATE MACHINE
 * - Full Reset on "Xem lại" (re-locks gift box, resets code, resets envelope & scroll)
 * - Passcode supports '2010' and '1809'
 * - Clean UI with SVG icons, no emoji
 */

class FlowManager {
  constructor(audioManager, particleFX) {
    this.audioManager = audioManager;
    this.particleFX = particleFX;

    this.currentScreen = 1;
    this.screens = {
      1: document.getElementById('screen1'),
      2: document.getElementById('screen2'),
      3: document.getElementById('screen3'),
      4: document.getElementById('screen4'),
      5: document.getElementById('screen5')
    };

    this.passcodes = window.APP_CONFIG.PASSCODES || ['2010', '1809'];
    this.inputCode = '';

    // Screen 3 Gift Box state
    this.isHolding = false;
    this.unlocked = false;
    this.holdStartTime = 0;
    this.holdDuration = 1500;
    this.holdRaf = null;

    // Screen 4 Typewriter state
    this.typewriterTimer = null;
    this.typewriterIndex = 0;
    this.isTyping = false;

    this.init();
  }

  init() {
    this.goToScreen(1);
    this.bindScreen1();
    this.bindScreen2();
    this.bindScreen3();
    this.bindScreen4();
    this.bindScreen5();
  }

  goToScreen(num) {
    Object.keys(this.screens).forEach(key => {
      const scr = this.screens[key];
      if (scr) scr.classList.remove('active');
    });

    const target = this.screens[num];
    if (target) {
      target.classList.add('active');
      this.currentScreen = num;
      if (num === 5) target.scrollTop = 0;
    }
  }

  // 1. Screen 1: Intro
  bindScreen1() {
    const startBtn = document.getElementById('startJourneyBtn');
    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
      if (this.audioManager) {
        this.audioManager.unlockAndPlay();
      }
      if (this.particleFX) {
        const rect = startBtn.getBoundingClientRect();
        this.particleFX.burstConfetti(rect.left + rect.width / 2, rect.top, 25);
      }
      setTimeout(() => this.goToScreen(2), 350);
    });
  }

  // 2. Screen 2: Passcode Keypad
  bindScreen2() {
    const dots = document.querySelectorAll('.passcode-dots .dot');
    const dotsContainer = document.querySelector('.passcode-dots');
    const numBtns = document.querySelectorAll('.numpad .num-btn');
    const rescueBtn = document.getElementById('rescueCodeBtn');

    this.updateDots = () => {
      dots.forEach((dot, idx) => {
        if (idx < this.inputCode.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    };

    const checkCode = () => {
      if (this.passcodes.includes(this.inputCode)) {
        if (this.audioManager) this.audioManager.playChime('unlock');
        if (this.particleFX) {
          this.particleFX.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 35);
        }
        setTimeout(() => this.goToScreen(3), 500);
      } else {
        if (dotsContainer) dotsContainer.classList.add('shake');
        if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
        setTimeout(() => {
          if (dotsContainer) dotsContainer.classList.remove('shake');
          this.inputCode = '';
          this.updateDots();
        }, 500);
      }
    };

    numBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val === 'del') {
          this.inputCode = this.inputCode.slice(0, -1);
          this.updateDots();
        } else if (val !== undefined && this.inputCode.length < 4) {
          this.inputCode += val;
          this.updateDots();
          if (this.inputCode.length === 4) {
            setTimeout(checkCode, 150);
          }
        }
      });
    });

    if (rescueBtn) {
      rescueBtn.addEventListener('click', () => {
        this.inputCode = '';
        this.updateDots();
        const primaryCode = this.passcodes[0] || '2010';
        const codeChars = primaryCode.split('');
        codeChars.forEach((ch, i) => {
          setTimeout(() => {
            this.inputCode += ch;
            this.updateDots();
            if (this.inputCode.length === 4) {
              setTimeout(checkCode, 200);
            }
          }, (i + 1) * 180);
        });
      });
    }
  }

  // 3. Screen 3: Press-and-Hold Gift Box
  bindScreen3() {
    const holdBtn = document.getElementById('holdGiftBtn');
    const progressBar = document.getElementById('holdProgressBar');
    const holdText = document.getElementById('holdBtnText');
    const giftSvg = document.getElementById('giftBoxSvg');

    if (!holdBtn) return;

    const startHold = () => {
      if (this.unlocked) return;
      this.isHolding = true;
      this.holdStartTime = performance.now();
      if (giftSvg) giftSvg.classList.add('shaking');
      if (holdText) holdText.textContent = 'Đang mở...';

      const updateProgress = (now) => {
        if (!this.isHolding) return;
        const elapsed = now - this.holdStartTime;
        const progress = Math.min(elapsed / this.holdDuration, 1);
        if (progressBar) progressBar.style.width = `${(progress * 100).toFixed(1)}%`;

        if (progress >= 1) {
          this.unlocked = true;
          this.isHolding = false;
          if (giftSvg) {
            giftSvg.classList.remove('shaking');
            giftSvg.style.transform = 'scale(1.22) translateY(-10px)';
          }
          if (holdText) holdText.textContent = 'Đã mở quà';
          if (this.audioManager) this.audioManager.playChime('gift');
          if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

          const rect = holdBtn.getBoundingClientRect();
          if (this.particleFX) {
            this.particleFX.burstConfetti(rect.left + rect.width / 2, rect.top, 55);
            this.particleFX.burstHeartFireworks(rect.left + rect.width / 2, rect.top - 80, 30);
          }

          setTimeout(() => this.goToScreen(4), 850);
          return;
        }

        this.holdRaf = requestAnimationFrame(updateProgress);
      };

      this.holdRaf = requestAnimationFrame(updateProgress);
    };

    const stopHold = () => {
      if (this.unlocked || !this.isHolding) return;
      this.isHolding = false;
      if (this.holdRaf) cancelAnimationFrame(this.holdRaf);
      if (giftSvg) giftSvg.classList.remove('shaking');
      if (holdText) holdText.textContent = 'Giữ mở quà';

      if (progressBar) {
        progressBar.style.transition = 'width 0.25s ease-out';
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.transition = 'width 0.08s linear';
        }, 260);
      }
    };

    holdBtn.addEventListener('pointerdown', startHold);
    window.addEventListener('pointerup', stopHold);
    window.addEventListener('pointercancel', stopHold);

    window.addEventListener('keydown', (e) => {
      if (this.currentScreen === 3 && (e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
        startHold();
      }
    });
    window.addEventListener('keyup', (e) => {
      if (this.currentScreen === 3 && (e.code === 'Space' || e.code === 'Enter')) {
        stopHold();
      }
    });
  }

  // 4. Screen 4: Envelope & Letter Modal & Typewriter
  bindScreen4() {
    const envelope = document.getElementById('letterEnvelope');
    const modal = document.getElementById('letterModal');
    const skipBtn = document.getElementById('skipTypewriterBtn');
    const continueBtn = document.getElementById('letterContinueBtn');

    const neonTitleText = window.APP_CONFIG.FIXED_CONTENT.NEON_TITLE;
    const letterFullText = window.APP_CONFIG.FIXED_CONTENT.LETTER_TEXT;

    if (envelope) {
      envelope.addEventListener('click', () => {
        envelope.classList.add('opened');
        if (this.particleFX) {
          const rect = envelope.getBoundingClientRect();
          this.particleFX.burstConfetti(rect.left + rect.width / 2, rect.top, 35);
        }
        setTimeout(() => {
          if (modal) modal.classList.add('open');
          this.startTypewriter(neonTitleText, letterFullText);
        }, 300);
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.finishTypewriter(neonTitleText, letterFullText);
      });
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('open');
        this.goToScreen(5);
        if (this.particleFX) {
          this.particleFX.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.3, 40);
        }
      });
    }
  }

  startTypewriter(title, fullText) {
    const neonTitleEl = document.getElementById('letterNeonTitle');
    const letterBodyEl = document.getElementById('letterBodyText');
    const continueBtn = document.getElementById('letterContinueBtn');
    const skipBtn = document.getElementById('skipTypewriterBtn');

    if (neonTitleEl) neonTitleEl.textContent = title;
    if (letterBodyEl) letterBodyEl.innerHTML = '<span class="typewriter-cursor"></span>';
    if (continueBtn) continueBtn.style.display = 'none';
    if (skipBtn) skipBtn.style.display = 'inline-flex';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finishTypewriter(title, fullText);
      return;
    }

    this.isTyping = true;
    this.typewriterIndex = 0;

    const step = () => {
      if (!this.isTyping) return;
      if (this.typewriterIndex < fullText.length) {
        this.typewriterIndex++;
        const currentSlice = fullText.slice(0, this.typewriterIndex);
        if (letterBodyEl) {
          letterBodyEl.innerHTML = `${currentSlice}<span class="typewriter-cursor"></span>`;
        }

        const lastChar = fullText[this.typewriterIndex - 1];
        let delay = 35;
        if (lastChar === ',' || lastChar === ';') delay = 90;
        if (lastChar === '.' || lastChar === '!' || lastChar === '?') delay = 140;

        this.typewriterTimer = setTimeout(step, delay);
      } else {
        this.finishTypewriter(title, fullText);
      }
    };

    this.typewriterTimer = setTimeout(step, 400);
  }

  finishTypewriter(title, fullText) {
    this.isTyping = false;
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);

    const neonTitleEl = document.getElementById('letterNeonTitle');
    const letterBodyEl = document.getElementById('letterBodyText');
    const continueBtn = document.getElementById('letterContinueBtn');
    const skipBtn = document.getElementById('skipTypewriterBtn');

    if (neonTitleEl) neonTitleEl.textContent = title;
    if (letterBodyEl) letterBodyEl.textContent = fullText;
    if (skipBtn) skipBtn.style.display = 'none';
    if (continueBtn) {
      continueBtn.style.display = 'inline-flex';
      continueBtn.classList.add('neon-pulse');
    }
  }

  // 5. Screen 5: Replay button (FULL STATE RESET)
  bindScreen5() {
    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.resetAllStates();
        this.goToScreen(1);
      });
    }
  }

  resetAllStates() {
    // 1. Reset Screen 2 (Passcode)
    this.inputCode = '';
    if (this.updateDots) this.updateDots();

    // 2. Reset Screen 3 (Gift Box & Hold Button)
    this.unlocked = false;
    this.isHolding = false;
    if (this.holdRaf) cancelAnimationFrame(this.holdRaf);

    const giftSvg = document.getElementById('giftBoxSvg');
    if (giftSvg) {
      giftSvg.classList.remove('shaking');
      giftSvg.style.transform = '';
    }

    const progressBar = document.getElementById('holdProgressBar');
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }

    const holdText = document.getElementById('holdBtnText');
    if (holdText) {
      holdText.textContent = 'Giữ mở quà';
    }

    // 3. Reset Screen 4 (Envelope & Letter)
    const envelope = document.getElementById('letterEnvelope');
    if (envelope) envelope.classList.remove('opened');

    const modal = document.getElementById('letterModal');
    if (modal) modal.classList.remove('open');

    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
    this.isTyping = false;

    // 4. Reset Screen 5 scroll
    const scr5 = document.getElementById('screen5');
    if (scr5) scr5.scrollTop = 0;
  }
}

window.FlowManager = FlowManager;
