/**
 * PARTICLE & VISUAL FX SYSTEM
 * - Canvas Aurora & Bokeh background renderer
 * - Interactive Particle canvas: falling petals, floating hearts, flapping butterflies,
 *   confetti explosions, heart fireworks, touch bloom, and cursor sparkles.
 * - Optimized with object pooling & hardware-adaptive density.
 */

class BackgroundAurora {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.orbs = [];
    this.stars = [];
    this.time = 0;
    this.running = true;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initOrbs();
    this.initStars();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);

    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) requestAnimationFrame(this.loop);
    });
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || window.innerWidth;
    this.height = this.canvas.height = rect.height || window.innerHeight;
  }

  initOrbs() {
    this.orbs = [
      { x: 0.2, y: 0.25, r: 160, color: 'rgba(255, 105, 180, 0.22)', speed: 0.0006 },
      { x: 0.75, y: 0.45, r: 200, color: 'rgba(155, 89, 182, 0.24)', speed: 0.0008 },
      { x: 0.45, y: 0.75, r: 180, color: 'rgba(233, 30, 99, 0.20)', speed: 0.0007 },
      { x: 0.8, y: 0.15, r: 140, color: 'rgba(142, 68, 173, 0.20)', speed: 0.0005 }
    ];
  }

  initStars() {
    const isMobile = window.innerWidth < 600;
    const starCount = isMobile ? 35 : 65;
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.015
      });
    }
  }

  loop(timestamp) {
    if (!this.running) return;
    this.time = timestamp || 0;
    this.render();
    requestAnimationFrame(this.loop);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw glowing soft Aurora orbs
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < this.orbs.length; i++) {
      const orb = this.orbs[i];
      const ox = (orb.x + Math.sin(this.time * orb.speed + i) * 0.1) * this.width;
      const oy = (orb.y + Math.cos(this.time * orb.speed + i) * 0.1) * this.height;

      const grad = ctx.createRadialGradient(ox, oy, 10, ox, oy, orb.r);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw micro twinkling stars
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const a = (Math.sin(this.time * s.twinkleSpeed) + 1) * 0.5 * s.alpha;
      ctx.fillStyle = `rgba(255, 230, 245, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x * this.width, s.y * this.height, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class ParticleFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.particles = [];
    this.butterflies = [];
    this.running = true;

    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = window.innerWidth < 600 || cores < 4;
    this.maxAmbient = isMobile ? 22 : 45;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initAmbient();
    this.bindTouchBloom();
    this.bindCursorTrail();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);

    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) requestAnimationFrame(this.loop);
    });
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || window.innerWidth;
    this.height = this.canvas.height = rect.height || window.innerHeight;
  }

  initAmbient() {
    for (let i = 0; i < this.maxAmbient; i++) {
      this.particles.push(this.createAmbientParticle(true));
    }
  }

  createAmbientParticle(randomY = false) {
    const isPetal = Math.random() > 0.35;
    return {
      type: isPetal ? 'petal' : 'heart',
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: isPetal ? Math.random() * 8 + 6 : Math.random() * 7 + 5,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 1.5 - 0.75,
      alpha: Math.random() * 0.5 + 0.4,
      color: isPetal ? 'rgba(255, 175, 195,' : 'rgba(255, 120, 160,'
    };
  }

  // Butterfly fluttering animation
  spawnButterflies(count = 14) {
    const colors = ['#8fd3ff', '#c4a1ff', '#ff8fb8', '#ffe3a8'];
    for (let i = 0; i < count; i++) {
      const startLeft = Math.random() > 0.5;
      this.butterflies.push({
        x: startLeft ? -30 : this.width + 30,
        y: this.height * (0.35 + Math.random() * 0.5),
        targetY: this.height * (0.1 + Math.random() * 0.5),
        vx: (startLeft ? 1 : -1) * (Math.random() * 2 + 1.8),
        vy: -(Math.random() * 1.5 + 0.6),
        scale: Math.random() * 0.35 + 0.55,
        flapAngle: 0,
        flapSpeed: Math.random() * 0.25 + 0.22,
        color: colors[i % colors.length],
        alpha: 1,
        life: 0,
        maxLife: 260
      });
    }
  }

  // Confetti explosion
  burstConfetti(originX, originY, count = 45) {
    const colors = ['#ff7da7', '#ffd166', '#06d6a0', '#118ab2', '#c4a1ff', '#ff9f1c'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        type: 'confetti',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 7 + 4,
        color: colors[i % colors.length],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 12 - 6,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012
      });
    }
  }

  // Heart fireworks burst
  burstHeartFireworks(originX, originY, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      this.particles.push({
        type: 'burstHeart',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 6,
        alpha: 1,
        color: 'rgba(255, 80, 140,',
        decay: Math.random() * 0.018 + 0.014
      });
    }
  }

  // Touch bloom: spawn mini flowers & hearts where user taps
  bindTouchBloom() {
    let lastTap = 0;
    const handleBloom = (x, y) => {
      const now = performance.now();
      if (now - lastTap < 150) return; // rate limit
      lastTap = now;
      for (let i = 0; i < 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 2.5 + 1;
        this.particles.push({
          type: 'sparkle',
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 0.5,
          size: Math.random() * 5 + 3,
          color: '#ffe3a8',
          alpha: 1,
          decay: 0.035
        });
      }
    };

    window.addEventListener('pointerdown', (e) => {
      // Avoid firing on interactive buttons
      if (e.target.closest('button, .btn-primary, .num-btn, .wish-chip, .voucher-card, .polaroid-card')) return;
      const rect = this.canvas.getBoundingClientRect();
      handleBloom(e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  // Subtle cursor/touch trail sparkles
  bindCursorTrail() {
    let throttle = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - throttle < 60) return;
      throttle = now;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= this.width && y >= 0 && y <= this.height) {
        this.particles.push({
          type: 'trail',
          x: x,
          y: y,
          size: Math.random() * 3 + 2,
          alpha: 0.8,
          color: '#ffc2d4',
          decay: 0.04
        });
      }
    });
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  }

  update() {
    // 1. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'petal' || p.type === 'heart') {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.4;
        p.rotation += p.rotSpeed;
        if (p.y > this.height + 20) {
          // Recycle ambient
          this.particles[i] = this.createAmbientParticle(false);
        }
      } else if (p.type === 'confetti') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      } else if (p.type === 'burstHeart' || p.type === 'sparkle' || p.type === 'trail') {
        if (p.vx !== undefined) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06;
        }
        p.alpha -= p.decay;
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }
    }

    // 2. Update butterflies
    for (let i = this.butterflies.length - 1; i >= 0; i--) {
      const b = this.butterflies[i];
      b.x += b.vx;
      b.y += b.vy + Math.sin(b.life * 0.08) * 1.2;
      b.flapAngle += b.flapSpeed;
      b.life++;
      if (b.life > b.maxLife - 30) {
        b.alpha = Math.max((b.maxLife - b.life) / 30, 0);
      }
      if (b.life >= b.maxLife || b.x < -60 || b.x > this.width + 60) {
        this.butterflies.splice(i, 1);
      }
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.type === 'petal') {
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'heart' || p.type === 'burstHeart') {
        ctx.rotate((p.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        this.drawHeartShape(ctx, p.size);
      } else if (p.type === 'confetti') {
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.6);
      } else if (p.type === 'sparkle' || p.type === 'trail') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Render fluttering butterflies
    for (let i = 0; i < this.butterflies.length; i++) {
      const b = this.butterflies[i];
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);
      ctx.globalAlpha = b.alpha;
      this.drawButterflyShape(ctx, b.color, Math.sin(b.flapAngle));
      ctx.restore();
    }
  }

  drawHeartShape(ctx, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.5, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.5, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  drawButterflyShape(ctx, color, wingFlap) {
    const wingSpread = 16 * Math.abs(wingFlap);
    ctx.fillStyle = color;
    // Left wings
    ctx.beginPath();
    ctx.ellipse(-wingSpread * 0.5, -6, wingSpread * 0.6, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(-wingSpread * 0.4, 6, wingSpread * 0.45, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Right wings
    ctx.beginPath();
    ctx.ellipse(wingSpread * 0.5, -6, wingSpread * 0.6, 9, 0.3, 0, Math.PI * 2);
    ctx.ellipse(wingSpread * 0.4, 6, wingSpread * 0.45, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#2c1338';
    ctx.beginPath();
    ctx.ellipse(0, 0, 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.BackgroundAurora = BackgroundAurora;
window.ParticleFX = ParticleFX;
