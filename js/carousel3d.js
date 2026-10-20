/**
 * 3D COVERFLOW SLIDER & AUTO-LOOP GALLERY
 * - Displays 1 large prominent photo in the center
 * - Side peek cards rotate in 3D perspective without overloading
 * - Automatic gentle loop animation (pauses on touch/hover)
 * - Touch & pointer drag swipe, snap, and full Lightbox
 */

class CosmicCarousel {
  constructor(photos, containerId) {
    this.photos = photos || [];
    this.stage = document.getElementById(containerId);
    this.ring = document.getElementById('carouselRing');
    this.prevBtn = document.getElementById('prevPhotoBtn');
    this.nextBtn = document.getElementById('nextPhotoBtn');
    this.zoomBtn = document.getElementById('zoomPhotoBtn');
    this.statusText = document.getElementById('cosmicStatusText');

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentDragX = 0;
    this.autoPlayTimer = null;
    this.isPaused = false;

    this.lightbox = new PhotoLightbox(this.photos);

    if (this.photos.length > 0 && this.ring) {
      this.init();
    }
  }

  init() {
    this.buildCards();
    this.bindEvents();
    this.updateCoverflow(true);
    this.startAutoPlay();
  }

  buildCards() {
    this.ring.innerHTML = '';
    this.cards = [];

    this.photos.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'coverflow-card';
      card.dataset.index = i;

      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="photo-frame">
          <img src="${photo.thumb}" alt="Kỷ niệm ${photo.id}" loading="lazy" decoding="async">
        </div>
        <div class="polaroid-caption">Kỷ niệm ${photo.id} ♡</div>
      `;

      card.addEventListener('click', (e) => {
        if (Math.abs(this.currentDragX) > 10) return;
        if (i === this.currentIndex) {
          this.lightbox.open(i);
        } else {
          this.goToIndex(i);
        }
      });

      this.ring.appendChild(card);
      this.cards.push(card);
    });
  }

  bindEvents() {
    if (!this.stage) return;

    // Pointer events for horizontal swipe
    this.stage.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.startX = e.clientX;
      this.currentDragX = 0;
      this.pauseAutoPlay();
      this.stage.setPointerCapture(e.pointerId);
    });

    this.stage.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      this.currentDragX = e.clientX - this.startX;
    });

    const endDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.currentDragX < -40) {
        this.next();
      } else if (this.currentDragX > 40) {
        this.prev();
      }
      this.currentDragX = 0;
      this.resumeAutoPlayLater();
    };

    this.stage.addEventListener('pointerup', endDrag);
    this.stage.addEventListener('pointercancel', endDrag);

    // Hover pauses auto-play
    this.stage.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.stage.addEventListener('mouseleave', () => this.resumeAutoPlayLater());

    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resumeAutoPlayLater();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resumeAutoPlayLater();
      });
    }
    if (this.zoomBtn) {
      this.zoomBtn.addEventListener('click', () => {
        this.lightbox.open(this.currentIndex);
      });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      const scr5 = document.getElementById('screen5');
      if (scr5 && scr5.classList.contains('active')) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
    });

    window.addEventListener('resize', () => this.updateCoverflow());
  }

  goToIndex(index) {
    const total = this.photos.length;
    this.currentIndex = ((index % total) + total) % total;
    this.updateCoverflow();
  }

  next() {
    this.goToIndex(this.currentIndex + 1);
  }

  prev() {
    this.goToIndex(this.currentIndex - 1);
  }

  updateCoverflow() {
    const total = this.photos.length;
    const stageWidth = this.stage ? this.stage.clientWidth : 360;
    // Spacing between center and peek cards
    const spacing = Math.min(stageWidth * 0.42, 160);

    this.cards.forEach((card, i) => {
      let offset = i - this.currentIndex;
      // Wrap offset around circle for loop continuity
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      card.classList.remove('active', 'peek-left', 'peek-right', 'hidden-card');

      if (offset === 0) {
        // Active Center Card (Big, prominent, facing front)
        card.classList.add('active');
        card.style.transform = `translateX(0px) translateZ(60px) scale(1) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.zIndex = '10';
        card.style.filter = 'drop-shadow(0 15px 35px rgba(255, 125, 167, 0.35))';
      } else if (offset === -1) {
        // Left Peek Card
        card.classList.add('peek-left');
        card.style.transform = `translateX(-${spacing}px) translateZ(-20px) scale(0.85) rotateY(28deg)`;
        card.style.opacity = '0.7';
        card.style.zIndex = '5';
        card.style.filter = 'brightness(0.82)';
      } else if (offset === 1) {
        // Right Peek Card
        card.classList.add('peek-right');
        card.style.transform = `translateX(${spacing}px) translateZ(-20px) scale(0.85) rotateY(-28deg)`;
        card.style.opacity = '0.7';
        card.style.zIndex = '5';
        card.style.filter = 'brightness(0.82)';
      } else {
        // Hidden outer cards
        card.classList.add('hidden-card');
        const dir = offset > 0 ? 1 : -1;
        card.style.transform = `translateX(${dir * (spacing + 80)}px) translateZ(-80px) scale(0.65)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
      }
    });

    if (this.statusText) {
      this.statusText.textContent = `${this.currentIndex + 1} / ${total}`;
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused && !document.hidden) {
        this.next();
      }
    }, 3600); // Glides to next photo every 3.6s
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
  }

  pauseAutoPlay() {
    this.isPaused = true;
  }

  resumeAutoPlayLater() {
    this.isPaused = false;
  }
}

class PhotoLightbox {
  constructor(photos) {
    this.photos = photos || [];
    this.modal = document.getElementById('lightboxModal');
    this.imgEl = document.getElementById('lightboxImg');
    this.captionEl = document.getElementById('lightboxCaption');
    this.closeBtn = document.getElementById('lightboxCloseBtn');
    this.currentIndex = 0;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.modal) return;
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    let startX = 0;
    let startY = 0;
    this.modal.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.modal.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
          this.close();
        } else if (dx > 50) {
          this.prev();
        } else if (dx < -50) {
          this.next();
        }
      }
    }, { passive: true });
  }

  open(index) {
    if (!this.photos || this.photos.length === 0) return;
    this.currentIndex = (index + this.photos.length) % this.photos.length;
    this.render();
    this.modal.classList.add('open');
  }

  close() {
    this.modal.classList.remove('open');
  }

  prev() {
    this.open(this.currentIndex - 1);
  }

  next() {
    this.open(this.currentIndex + 1);
  }

  render() {
    const item = this.photos[this.currentIndex];
    if (!item) return;
    this.imgEl.src = item.thumb;
    const fullImg = new Image();
    fullImg.src = item.full;
    fullImg.onload = () => {
      if (this.currentIndex === item.id - 1) {
        this.imgEl.src = item.full;
      }
    };
    this.captionEl.textContent = `Kỷ niệm ${item.id} ♡ (${this.currentIndex + 1}/${this.photos.length})`;
  }
}

window.CosmicCarousel = CosmicCarousel;
