import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js';

const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;
let experienceReady = false;

document.querySelectorAll('.memory-card img').forEach((img) => {
  img.addEventListener('error', () => img.remove());
});

const ask = document.querySelector('#ask');
const site = document.querySelector('#site');
const yesButton = document.querySelector('#yes-button');
const noButton = document.querySelector('#no-button');
const attempt = document.querySelector('#ask-attempt');
const askBears = document.querySelector('#ask-bears');
const noReplies = ['Nice try, my love ♡', 'That button is a little shy', 'Are you absolutely sure?', 'The bear says try again!', 'Okay… maybe press yes?'];
let noCount = 0;

function dodgeNo(event) {
  if (event) event.preventDefault();
  noCount += 1;
  const area = document.querySelector('#ask-actions').getBoundingClientRect();
  const maxX = Math.min(innerWidth * .28, 190);
  const maxY = Math.min(innerHeight * .1, 70);
  const x = (Math.random() - .5) * maxX * 2;
  const y = (Math.random() - .5) * maxY * 2;
  gsap.to(noButton, { x, y, rotate: (Math.random() - .5) * 14, duration: .32, ease: 'back.out(1.8)' });
  attempt.textContent = noReplies[Math.min(noCount - 1, noReplies.length - 1)];
  gsap.fromTo(attempt, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3 });
  gsap.to(yesButton, { scale: Math.min(1 + noCount * .07, 1.38), duration: .3 });
  if (noCount === 2) askBears.src = 'assets/bears-hug.svg';
  if (noCount >= 5) {
    noButton.textContent = 'Okay, yes ♡';
    noButton.removeEventListener('pointerenter', dodgeNo);
    noButton.removeEventListener('click', dodgeNo);
    noButton.addEventListener('click', openSite, { once: true });
    gsap.to(noButton, { x: 0, y: 0, rotate: 0, background: '#f2a5b8' });
  }
}

function openSite() {
  site.classList.add('is-open');
  site.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('locked');
  const finishOpen = () => {
    if (ask.isConnected) ask.remove();
    site.style.opacity = '1';
    if (!experienceReady && hasGsap) {
      experienceReady = true;
      initExperience();
    }
  };
  if (!hasGsap) {
    finishOpen();
    return;
  }
  const tl = gsap.timeline({ onComplete: finishOpen });
  tl.to('.ask__card', { scale: .94, opacity: 0, duration: .5, ease: 'power2.in' })
    .to(ask, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, .25)
    .to(site, { opacity: 1, duration: .65 }, .55)
    .from('.hero__copy > *', { y: 35, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out' }, .7)
    .from('.hero__bears', { y: 100, rotate: 8, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, .85);
  setTimeout(finishOpen, 2200);
  burst(innerWidth / 2, innerHeight / 2, 34);
}

yesButton.addEventListener('click', openSite, { once: true });
noButton.addEventListener('pointerenter', dodgeNo);
noButton.addEventListener('click', dodgeNo);

function initExperience() {
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const nav = document.querySelector('.nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });
  if (reduceMotion) return;

  gsap.to('.hero__copy', { yPercent: 24, opacity: .1, ease: 'none', scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__bears', { yPercent: -22, rotate: -4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.intro__grid > *', { y: 80, opacity: 0, stagger: .16, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.intro__grid', start: 'top 82%' } });
  document.querySelectorAll('.memory-card').forEach((card, index) => {
    gsap.from(card, { y: 110, opacity: 0, rotate: index % 2 ? 3 : -3, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%' } });
    gsap.to(card.querySelector('.memory-card__image'), { yPercent: index % 2 ? 5 : -5, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.days__number', { textContent: 0, duration: 2, snap: { textContent: 1 }, ease: 'power2.out', scrollTrigger: { trigger: '.days__number', start: 'top 82%' } });
  gsap.from('.reasons article', { y: 70, opacity: 0, stagger: .12, duration: .9, scrollTrigger: { trigger: '.reasons', start: 'top 84%' } });
  gsap.from('.garden__field > img', { scale: .3, rotate: -8, opacity: 0, duration: 1.4, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.garden', start: 'top 62%' } });
  gsap.from('.letter__paper', { y: 130, rotate: 4, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.letter', start: 'top 72%' } });
}

function burst(x, y, amount = 22) {
  for (let i = 0; i < amount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'love-particle';
    particle.textContent = i % 3 ? '♡' : '✦';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);
    const angle = Math.PI * 2 * i / amount;
    const distance = 65 + Math.random() * 190;
    gsap.to(particle, { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotation: Math.random() * 280, scale: .25, opacity: 0, duration: .9 + Math.random() * .8, ease: 'power2.out', onComplete: () => particle.remove() });
  }
}

document.querySelector('#seal').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
  gsap.fromTo(event.currentTarget, { scale: 1.2 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.3)' });
});

const gardenField = document.querySelector('#garden-field');
const bloomCount = document.querySelector('#bloom-count');
let blooms = 7;
function plantTulip(clientX, clientY) {
  const rect = gardenField.getBoundingClientRect();
  const image = document.createElement('img');
  image.src = 'assets/tulip-stem.svg';
  image.alt = '';
  image.className = 'planted-tulip';
  const x = clientX ? clientX - rect.left : rect.width * (.25 + Math.random() * .5);
  const y = clientY ? clientY - rect.top : rect.height * (.3 + Math.random() * .45);
  image.style.left = `${Math.max(20, Math.min(rect.width - 80, x - 35))}px`;
  image.style.top = `${Math.max(35, Math.min(rect.height - 150, y - 65))}px`;
  image.style.transform = `rotate(${(Math.random() - .5) * 18}deg)`;
  gardenField.appendChild(image);
  blooms += 1;
  bloomCount.textContent = blooms;
  gsap.from(image, { scaleY: 0, transformOrigin: 'bottom', duration: .75, ease: 'back.out(1.8)' });
}
gardenField.addEventListener('click', (event) => plantTulip(event.clientX, event.clientY));
document.querySelector('#plant-button').addEventListener('click', () => plantTulip());

// A subtle Three.js petal field gives the page depth without competing with the SVG art.
if (!reduceMotion) {
  const canvas = document.querySelector('#petals');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
  camera.position.z = 2;
  const petals = [];
  const shape = new THREE.Shape();
  shape.moveTo(0, .12); shape.bezierCurveTo(-.12, .05, -.1, -.1, 0, -.14); shape.bezierCurveTo(.1, -.1, .12, .05, 0, .12);
  const geometry = new THREE.ShapeGeometry(shape);
  for (let i = 0; i < 26; i += 1) {
    const material = new THREE.MeshBasicMaterial({ color: i % 3 ? 0xf2a5b8 : 0xf6c8aa, transparent: true, opacity: .42, side: THREE.DoubleSide });
    const petal = new THREE.Mesh(geometry, material);
    petal.position.set(Math.random() * 2 - 1, Math.random() * 2 - 1, 0);
    petal.scale.setScalar(.18 + Math.random() * .35);
    petal.userData = { speed: .0007 + Math.random() * .0012, sway: Math.random() * 6.28 };
    scene.add(petal); petals.push(petal);
  }
  function resize() { renderer.setSize(innerWidth, innerHeight, false); }
  resize(); addEventListener('resize', resize);
  (function animate(time) {
    petals.forEach((petal) => {
      petal.position.y -= petal.userData.speed;
      petal.position.x += Math.sin(time * .0005 + petal.userData.sway) * .00025;
      petal.rotation.z += .0015;
      if (petal.position.y < -1.15) { petal.position.y = 1.15; petal.position.x = Math.random() * 2 - 1; }
    });
    renderer.render(scene, camera); requestAnimationFrame(animate);
  })(0);
}
