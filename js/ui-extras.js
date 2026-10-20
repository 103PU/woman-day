/**
 * UI EXTRAS (PHASE 3 ENHANCED)
 * - Concise, emotional copy
 * - 3 Wishes handler with thematic particles
 * - "Chút ngọt ngào 🦋" butterfly spawner & toast
 * - 4 Princess Vouchers 3D flip with shine
 * - Crown Easter Egg (3 rapid taps)
 * - "Gửi tim cho anh" heart fireworks
 */

class UIExtras {
  constructor(particleFX) {
    this.particleFX = particleFX;
    this.toastEl = document.getElementById('toastBox');
    this.toastTimer = null;
    this.lastQuoteIndex = -1;

    this.initWishes();
    this.initSweetButton();
    this.initVouchers();
    this.initEasterEgg();
    this.initSendHeartButton();
  }

  showToast(message, duration = 2800) {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, duration);
  }

  // 1. Wishes chips
  initWishes() {
    const chips = document.querySelectorAll('.wish-chip');
    chips.forEach(chip => {
      const id = chip.dataset.wish;
      const configWish = window.APP_CONFIG.WISHES.find(w => w.id === id);
      const iconSpan = chip.querySelector('.wish-icon');
      if (iconSpan && configWish && window.SVG_ICONS && window.SVG_ICONS[configWish.iconType]) {
        iconSpan.innerHTML = window.SVG_ICONS[configWish.iconType];
      }

      chip.addEventListener('click', () => {
        if (configWish) {
          const rect = chip.getBoundingClientRect();
          if (this.particleFX) {
            this.particleFX.burstConfetti(rect.left + rect.width / 2, rect.top, 20);
          }
          this.showToast(configWish.toast);
        }
      });
    });
  }

  // 2. Sweet butterfly spawner button
  initSweetButton() {
    const sweetBtn = document.getElementById('sweetBtn');
    if (!sweetBtn) return;

    sweetBtn.addEventListener('click', () => {
      if (this.particleFX) {
        this.particleFX.spawnButterflies(16);
      }
      const quotes = window.APP_CONFIG.SWEET_QUOTES;
      let newIdx;
      do {
        newIdx = Math.floor(Math.random() * quotes.length);
      } while (newIdx === this.lastQuoteIndex && quotes.length > 1);

      this.lastQuoteIndex = newIdx;
      this.showToast(quotes[newIdx]);
    });
  }

  // 3. Vouchers 3D Flip (SVG Icons per table 2.1)
  initVouchers() {
    const container = document.getElementById('vouchersGrid');
    if (!container || !window.APP_CONFIG.VOUCHERS) return;

    container.innerHTML = '';
    window.APP_CONFIG.VOUCHERS.forEach((v) => {
      const card = document.createElement('div');
      card.className = 'voucher-card';
      const iconSvg = (window.SVG_ICONS && window.SVG_ICONS[v.iconType]) || '';
      card.innerHTML = `
        <div class="voucher-inner">
          <div class="voucher-face voucher-front">
            <div class="voucher-icon">${iconSvg}</div>
            <div class="voucher-name">${v.title}</div>
          </div>
          <div class="voucher-face voucher-back">
            <div class="voucher-back-text">${v.backDesc}</div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });

      container.appendChild(card);
    });
  }

  // 4. Crown Easter Egg (3 rapid taps within 1.5s)
  initEasterEgg() {
    const crown = document.getElementById('crownIcon');
    const secretModal = document.getElementById('secretModal');
    const closeSecretBtn = document.getElementById('closeSecretBtn');
    const secretTextEl = document.getElementById('secretText');

    if (!crown || !secretModal) return;
    let taps = 0;
    let timer = null;

    crown.addEventListener('click', () => {
      taps++;
      if (taps === 1) {
        timer = setTimeout(() => { taps = 0; }, 1500);
      } else if (taps >= 3) {
        clearTimeout(timer);
        taps = 0;
        if (secretTextEl) {
          secretTextEl.textContent = window.APP_CONFIG.SECRET_MESSAGE;
        }
        secretModal.classList.add('open');
        if (this.particleFX) {
          const rect = crown.getBoundingClientRect();
          this.particleFX.burstConfetti(rect.left + rect.width / 2, rect.top, 35);
        }
      }
    });

    if (closeSecretBtn) {
      closeSecretBtn.addEventListener('click', () => {
        secretModal.classList.remove('open');
      });
    }
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal) secretModal.classList.remove('open');
    });
  }

  // 5. Send heart button (Concise emotional toast <= 10 words)
  initSendHeartButton() {
    const sendBtn = document.getElementById('sendHeartBtn');
    if (!sendBtn) return;

    sendBtn.addEventListener('click', () => {
      const rect = sendBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      if (this.particleFX) {
        this.particleFX.burstHeartFireworks(x, y, 40);
        this.particleFX.burstConfetti(x, y, 25);
      }
      this.showToast("Anh nhận được tim rồi, yêu em!", 3000);
    });
  }
}

window.UIExtras = UIExtras;
