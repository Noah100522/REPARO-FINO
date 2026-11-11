const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('#nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}))}const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealNodes=document.querySelectorAll('.section-heading,.service,.about-grid>*,.experience-copy,.gallery-item,.contact-inner,.reveal');
if(!reducedMotion&&'IntersectionObserver' in window){revealNodes.forEach(el=>el.classList.add('reveal'));const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 50px 0px'});revealNodes.forEach(el=>observer.observe(el))}else{revealNodes.forEach(el=>el.classList.add('visible'))}
const progress=document.querySelector('.scroll-progress');const orbit=document.querySelector('.hero-orbit');let ticking=false;function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;const ratio=max>0?scrollY/max:0;if(progress)progress.style.transform='scaleX('+Math.min(1,Math.max(0,ratio))+')';if(orbit&&!reducedMotion)orbit.style.setProperty('--parallax',Math.min(scrollY*.16,150)+'px');ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
const tilt=document.querySelector('.tilt-card');if(tilt&&!reducedMotion&&matchMedia('(hover:hover) and (pointer:fine)').matches){tilt.addEventListener('pointermove',e=>{const r=tilt.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;tilt.style.setProperty('--rx',((.5-y)*14)+'deg');tilt.style.setProperty('--ry',((x-.5)*18)+'deg');tilt.style.setProperty('--mx',(x*100)+'%');tilt.style.setProperty('--my',(y*100)+'%')});tilt.addEventListener('pointerleave',()=>{tilt.style.setProperty('--rx','5deg');tilt.style.setProperty('--ry','-8deg');tilt.style.setProperty('--mx','50%');tilt.style.setProperty('--my','50%')})}

// Links externos e navegação continuam funcionando sem WebGL.

document.querySelectorAll('.reel-card').forEach(card=>{
  const video=card.querySelector('video');
  const button=card.querySelector('.reel-control');
  if(!video||!button)return;
  const sync=()=>{const playing=!video.paused;card.classList.toggle('is-playing',playing);button.textContent=playing?'Ⅱ':'▶';button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Pausar vídeo':'Reproduzir vídeo')};
  button.addEventListener('click',async()=>{if(video.paused){try{await video.play()}catch(e){console.warn('Vídeo não pôde ser reproduzido',e)}}else video.pause();sync()});
  video.addEventListener('play',sync);video.addEventListener('pause',sync);
});
const heroVideo=document.querySelector('.hero-video');
if(heroVideo){heroVideo.addEventListener('error',()=>heroVideo.style.display='none');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)heroVideo.pause()}
