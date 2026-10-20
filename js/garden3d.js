/**
 * PROCEDURAL 3D GARDEN (THREE.JS) & SVG FALLBACK
 * - Tulip, Hydrangea (cẩm tú cầu), Rose (hoa hồng)
 * - Wind sway with sine wave phase offsets
 * - Mouse / Gyroscope interactive tilt
 * - Auto-fallback to vector SVG garden if FPS < 35 or ?garden=svg
 */

class GardenManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById('garden3dCanvas');
    this.svgFallback = document.getElementById('gardenSvgFallback');
    this.fallbackTriggered = false;

    // Check forced SVG parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('garden') === 'svg') {
      this.useFallback('Tham số ?garden=svg được kích hoạt');
      return;
    }

    // Check WebGL availability
    if (!this.checkWebGL()) {
      this.useFallback('Trình duyệt không hỗ trợ WebGL');
      return;
    }

    if (window.THREE && this.canvas) {
      this.init3D();
    } else {
      this.useFallback('Three.js chưa sẵn sàng');
    }
  }

  checkWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  useFallback(reason) {
    if (this.fallbackTriggered) return;
    this.fallbackTriggered = true;
    console.log(`[Garden] Chuyển sang Fallback SVG (${reason})`);
    if (this.container) {
      this.container.classList.add('use-svg');
    }
    this.cleanUp3D();
  }

  init3D() {
    const THREE = window.THREE;
    const width = this.container.clientWidth || 360;
    const height = this.container.clientHeight || 240;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 5.2);
    this.camera.lookAt(0, 0.4, 0);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Lighting (Rim light to highlight flower edges)
    const ambientLight = new THREE.AmbientLight(0xffd8e8, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff99bb, 2.2);
    dirLight.position.set(2, 6, 3);
    this.scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x8fd3ff, 2.5, 8);
    rimLight.position.set(-2, 3, -1);
    this.scene.add(rimLight);

    // 4. Build Procedural Flower Beds
    this.flowers = [];
    this.buildFlowerBed();

    // 5. Interactive Tilt
    this.mouseX = 0;
    this.targetMouseX = 0;
    window.addEventListener('pointermove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouseX = normX * 0.4;
    });

    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null) {
          this.targetMouseX = (e.gamma / 45) * 0.4;
        }
      });
    }

    // 6. Intersection Observer: pause rendering when outside viewport
    this.isVisible = true;
    this.observer = new IntersectionObserver((entries) => {
      this.isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    this.observer.observe(this.container);

    // 7. FPS Benchmark during first 60 frames
    this.fpsCount = 0;
    this.fpsStartTime = performance.now();
    this.benchmarking = true;

    // Resize handler
    window.addEventListener('resize', () => this.onResize());

    // Render loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildFlowerBed() {
    const THREE = window.THREE;
    this.gardenGroup = new THREE.Group();
    this.scene.add(this.gardenGroup);

    // Common stem material
    const stemMat = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });

    // A. Back Row: Hydrangea (Cẩm tú cầu) - 3 clustered bushes
    const hydrangeaColors = [0x8fd3ff, 0xc4a1ff, 0xffa0c4];
    const hydrX = [-1.4, 0, 1.4];
    hydrX.forEach((hx, i) => {
      const hydrGroup = new THREE.Group();
      hydrGroup.position.set(hx, 0.2, -0.6);

      // Instanced florets for hydrangea
      const floretGeo = new THREE.SphereGeometry(0.07, 6, 6);
      const floretMat = new THREE.MeshLambertMaterial({
        color: hydrangeaColors[i % hydrangeaColors.length]
      });
      const count = 35;
      const instMesh = new THREE.InstancedMesh(floretGeo, floretMat, count);

      const dummy = new THREE.Object3D();
      for (let j = 0; j < count; j++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.32 + Math.random() * 0.08;
        dummy.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) + 0.3,
          r * Math.sin(phi) * Math.sin(theta)
        );
        dummy.scale.setScalar(Math.random() * 0.4 + 0.8);
        dummy.updateMatrix();
        instMesh.setMatrixAt(j, dummy.matrix);
      }
      instMesh.instanceMatrix.needsUpdate = true;
      hydrGroup.add(instMesh);

      // Hydrangea stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.8, 6), stemMat);
      stem.position.y = -0.1;
      hydrGroup.add(stem);

      this.gardenGroup.add(hydrGroup);
      this.flowers.push({
        group: hydrGroup,
        baseX: hx,
        speed: 1.2 + i * 0.2,
        phase: i * 1.5,
        swayAmp: 0.04
      });
    });

    // B. Middle Row: Roses (Hoa hồng) - 4 roses
    const roseColors = [0xff4081, 0xff6584, 0xf06292, 0xe91e63];
    const roseX = [-1.8, -0.7, 0.7, 1.8];
    roseX.forEach((rx, i) => {
      const roseGroup = new THREE.Group();
      roseGroup.position.set(rx, -0.1, 0.1);

      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.9, 6), stemMat);
      stem.position.y = 0.25;
      roseGroup.add(stem);

      // Rose head spiral petals
      const roseHead = new THREE.Group();
      roseHead.position.y = 0.7;
      const petalGeo = new THREE.SphereGeometry(0.12, 6, 6);
      petalGeo.scale(1, 1.5, 0.4);
      const roseMat = new THREE.MeshLambertMaterial({ color: roseColors[i % roseColors.length] });

      for (let p = 0; p < 12; p++) {
        const petal = new THREE.Mesh(petalGeo, roseMat);
        const pAngle = p * 2.39996; // Golden ratio angle
        const pRadius = 0.04 + (p * 0.015);
        petal.position.set(Math.cos(pAngle) * pRadius, p * 0.012, Math.sin(pAngle) * pRadius);
        petal.rotation.set(0.3, pAngle, 0.2);
        roseHead.add(petal);
      }
      roseGroup.add(roseHead);

      this.gardenGroup.add(roseGroup);
      this.flowers.push({
        group: roseGroup,
        baseX: rx,
        speed: 1.5 + i * 0.25,
        phase: i * 0.9 + 2,
        swayAmp: 0.06
      });
    });

    // C. Front Row: Tulips (Hoa tulip) - 5 tulips (cup-shaped)
    const tulipColors = [0xff7da7, 0xffd166, 0xc4a1ff, 0xff85a1, 0xffe3a8];
    const tulipX = [-2.1, -1.1, 0, 1.1, 2.1];
    tulipX.forEach((tx, i) => {
      const tulipGroup = new THREE.Group();
      tulipGroup.position.set(tx, -0.4, 0.8);

      // Curved stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.75, 6), stemMat);
      stem.position.y = 0.2;
      tulipGroup.add(stem);

      // Tulip cup bloom
      const tulipHead = new THREE.Group();
      tulipHead.position.y = 0.58;
      const tPetalGeo = new THREE.ConeGeometry(0.13, 0.28, 5, 1, true);
      const tulipMat = new THREE.MeshLambertMaterial({
        color: tulipColors[i % tulipColors.length],
        side: THREE.DoubleSide
      });

      for (let c = 0; c < 4; c++) {
        const cp = new THREE.Mesh(tPetalGeo, tulipMat);
        const cAngle = (c / 4) * Math.PI * 2;
        cp.position.set(Math.cos(cAngle) * 0.04, 0, Math.sin(cAngle) * 0.04);
        cp.rotation.set(0.1, cAngle, 0.1);
        tulipHead.add(cp);
      }
      tulipGroup.add(tulipHead);

      this.gardenGroup.add(tulipGroup);
      this.flowers.push({
        group: tulipGroup,
        baseX: tx,
        speed: 1.8 + i * 0.2,
        phase: i * 0.7 + 4,
        swayAmp: 0.08
      });
    });
  }

  animate() {
    if (this.fallbackTriggered) return;
    requestAnimationFrame(this.animate);

    if (!this.isVisible || document.hidden) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // FPS Benchmark
    if (this.benchmarking) {
      this.fpsCount++;
      if (this.fpsCount >= 60) {
        const totalDuration = (performance.now() - this.fpsStartTime) / 1000;
        const avgFps = this.fpsCount / totalDuration;
        this.benchmarking = false;
        if (avgFps < 32) {
          this.useFallback(`Hiệu năng thấp (${avgFps.toFixed(1)} FPS)`);
          return;
        }
      }
    }

    // Smooth tilt towards mouse/device orientation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    if (this.gardenGroup) {
      this.gardenGroup.rotation.y = this.mouseX * 0.5;
    }

    // Sway flowers with wind
    for (let i = 0; i < this.flowers.length; i++) {
      const f = this.flowers[i];
      const sway = Math.sin(elapsedTime * f.speed + f.phase) * f.swayAmp;
      f.group.rotation.z = sway;
      f.group.rotation.x = Math.cos(elapsedTime * (f.speed * 0.8) + f.phase) * (f.swayAmp * 0.5);
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  cleanUp3D() {
    if (this.observer) this.observer.disconnect();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

window.GardenManager = GardenManager;
