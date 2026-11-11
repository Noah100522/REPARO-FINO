// Showroom 3D progressivo: Three.js carregado sob demanda e fallback CSS preservado.
const root=document.getElementById('showroom-canvas');
const status=document.getElementById('showroom-status');
if(root && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver(async entries=>{
    if(!entries.some(e=>e.isIntersecting))return;
    io.disconnect();
    try{
      const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js');
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(38,1,.1,100);
      camera.position.set(7,4.1,9.5);camera.lookAt(0,.55,0);
      const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.6;
      root.appendChild(renderer.domElement);
      const car=new THREE.Group();scene.add(car);
      const bodyMat=new THREE.MeshPhysicalMaterial({color:0x9b091c,metalness:.88,roughness:.19,clearcoat:1,clearcoatRoughness:.06});
      const glass=new THREE.MeshPhysicalMaterial({color:0x111c29,metalness:.5,roughness:.12,transparent:true,opacity:.92});
      const black=new THREE.MeshStandardMaterial({color:0x080a0e,metalness:.28,roughness:.55});
      const silver=new THREE.MeshStandardMaterial({color:0x9b9fa9,metalness:.9,roughness:.22});
      const redGlow=new THREE.MeshBasicMaterial({color:0xff1e39});
      function box(w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);car.add(m);return m}
      box(4.65,.65,2.15,0,.7,0,bodyMat);
      box(3.0,.58,1.82,-.18,1.25,0,glass);
      box(2.25,.12,1.8,-.28,1.58,0,bodyMat);
      box(.9,.1,2.1,1.85,1.08,0,bodyMat);
      box(.24,.25,1.8,2.34,.65,0,black);
      box(.14,.2,1.7,-2.34,.65,0,black);
      for(const x of [-1.48,1.48])for(const z of [-1.12,1.12]){
        const tire=new THREE.Mesh(new THREE.CylinderGeometry(.49,.49,.24,32),black);
        tire.rotation.x=Math.PI/2;tire.position.set(x,.45,z);car.add(tire);
        const rim=new THREE.Mesh(new THREE.CylinderGeometry(.27,.27,.255,24),silver);
        rim.rotation.x=Math.PI/2;rim.position.copy(tire.position);car.add(rim);
      }
      for(const z of [-.72,.72]){
        box(.07,.13,.48,2.38,.83,z,new THREE.MeshBasicMaterial({color:0xdff5ff}));
        box(.06,.14,.43,-2.38,.81,z,redGlow);
      }
      const floor=new THREE.Mesh(new THREE.CircleGeometry(5.2,64),new THREE.MeshBasicMaterial({color:0x6c0a1c,transparent:true,opacity:.18,side:THREE.DoubleSide}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.08;scene.add(floor);
      scene.add(new THREE.HemisphereLight(0xd9e9ff,0x2d070e,2.2));
      function light(color,intensity,x,y,z){const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l)}
      light(0xffffff,3,-4,8,6);light(0xff2146,5,3,5,-5);
      let target=.45,angle=.45,active=true;
      const resize=()=>{const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
      const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);resize();
      const onPointer=e=>{const r=root.getBoundingClientRect();target=((e.clientX-r.left)/r.width-.5)*1.9};
      root.addEventListener('pointermove',onPointer);
      root.addEventListener('pointerleave',()=>target=.45);
      const tick=()=>{if(!active)return;angle+=(target-angle)*.035;car.rotation.y=angle;renderer.render(scene,camera);requestAnimationFrame(tick)};
      tick();
      document.addEventListener('visibilitychange',()=>{if(!document.hidden&&active)renderer.render(scene,camera)});
      if(status)status.textContent='Modelo 3D ilustrativo interativo — mova o cursor para girar';
      root.classList.add('loaded');
    }catch(error){if(status)status.textContent='Visualização ilustrativa disponível; modelo 3D indisponível nesta conexão.';root.classList.add('fallback')}
  },{rootMargin:'250px'});io.observe(root);
}
