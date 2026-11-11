/**
 * Reparo Fino — showroom 3D.
 * Modelo Ferrari de demonstração disponibilizado pelos exemplos do Three.js.
 * Não representa veículo ou trabalho da Reparo Fino.
 * Carregamento progressivo e fallback fotográfico sem geometria de blocos.
 */
const root = document.getElementById('showroom-canvas');
const status = document.getElementById('showroom-status');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (root) {
  root.classList.add('showroom-photo-fallback');
  if (status) status.textContent = 'Visualização automotiva ilustrativa';
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      let renderer;
      try {
        const [THREE, { GLTFLoader }, { DRACOLoader }] = await Promise.all([
          import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js'),
          import('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js'),
          import('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/DRACOLoader.js')
        ]);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
        camera.position.set(5.7, 2.9, 8.8);
        camera.lookAt(0, .5, 0);
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.45;
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        loader.setDRACOLoader(draco);
        const carModel = await loader.loadAsync('https://threejs.org/examples/models/gltf/ferrari.glb');
        const car = carModel.scene;
        const bounds = new THREE.Box3().setFromObject(car);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        if (!size.x || !size.y || !size.z) throw new Error('Modelo sem geometria');
        car.position.sub(center);
        const scale = 5.7 / Math.max(size.x, size.z);
        car.scale.setScalar(scale);
        car.position.y += size.y * scale * .5 + .06;
        const turntable = new THREE.Group();
        turntable.add(car);
        scene.add(turntable);
        const ambient = new THREE.HemisphereLight(0xe7f1ff, 0x3b0a11, 2.5);
        scene.add(ambient);
        const key = new THREE.DirectionalLight(0xffffff, 5);
        key.position.set(-4, 8, 6);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xff304a, 6);
        rim.position.set(4, 5, -5);
        scene.add(rim);
        const fill = new THREE.DirectionalLight(0xaecbff, 2.2);
        fill.position.set(5, 2, 5);
        scene.add(fill);
        const floor = new THREE.Mesh(
          new THREE.CircleGeometry(4.5, 64),
          new THREE.MeshBasicMaterial({ color: 0x7c1223, transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -.12;
        scene.add(floor);
        root.appendChild(renderer.domElement);
        const resize = () => {
          const w = root.clientWidth, h = root.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.position.set(w < 640 ? 7.5 : 5.7, w < 640 ? 3.5 : 2.9, w < 640 ? 11 : 8.8);
          camera.lookAt(0, .5, 0);
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(root);
        resize();
        let target = .4, current = .4, dragging = false, previousX = 0;
        if (!isTouch) {
          root.addEventListener('pointermove', event => {
            const rect = root.getBoundingClientRect();
            target = ((event.clientX - rect.left) / rect.width - .5) * 1.4;
          });
          root.addEventListener('pointerleave', () => { target = .4; });
        } else {
          root.addEventListener('pointerdown', event => { dragging = true; previousX = event.clientX; });
          root.addEventListener('pointerup', () => { dragging = false; });
          root.addEventListener('pointercancel', () => { dragging = false; });
          root.addEventListener('pointermove', event => {
            if (!dragging) return;
            target += (event.clientX - previousX) * .009;
            previousX = event.clientX;
          });
        }
        const draw = () => {
          if (!root.isConnected) { ro.disconnect(); renderer.dispose(); return; }
          if (!document.hidden) {
            current += (target - current) * .045;
            turntable.rotation.y = current;
            renderer.render(scene, camera);
          }
          requestAnimationFrame(draw);
        };
        root.classList.add('loaded');
        root.classList.remove('showroom-photo-fallback');
        if (status) status.textContent = isTouch ? 'Arraste para explorar o carro 3D ilustrativo' : 'Mova o mouse para explorar o carro 3D ilustrativo';
        draw();
      } catch (error) {
        console.warn('Showroom 3D indisponível, mantendo visual fotográfico:', error);
        if (renderer) renderer.dispose();
        root.classList.add('showroom-photo-fallback');
        if (status) status.textContent = 'Visualização fotográfica ilustrativa';
      }
    }, { rootMargin: '250px' });
    observer.observe(root);
  }
}
