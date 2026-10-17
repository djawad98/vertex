'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Background particles. Each has a depth; scroll moves near ones faster (parallax).
function particles() {
  const c = document.getElementById('particles') as HTMLCanvasElement | null;
  const ctx = c?.getContext('2d');
  if (!c || !ctx) return () => {};
  const light = matchMedia('(prefers-color-scheme: light)');
  const palette = () => light.matches ? ['7,110,220', '8,115,131', '17,140,160', '7,128,245'] : ['7,128,245', '17,159,185', '47,225,192', '72,254,230'];
  let colors = palette();
  let w = 0, h = 0, raf = 0;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const n = innerWidth < 700 ? 34 : 70;
  const ps = Array.from({ length: n }, () => ({
    x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8,
    vx: (Math.random() - 0.5) * 0.00012, vy: (Math.random() - 0.5) * 0.00012,
    c: (Math.random() * 4) | 0,
  }));
  const size = () => {
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    const s = scrollY;
    const pts = ps.map((p) => {
      p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
      const y = (((p.y * h - s * p.z * 0.35) % h) + h) % h;
      return [p.x * w, y, p] as const;
    });
    for (let i = 0; i < pts.length; i++) {
      const [x, y, p] = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(x - pts[j][0], y - pts[j][1]);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${colors[p.c]},${(1 - d / 130) * 0.16 * p.z})`;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${colors[p.c]},${0.25 + p.z * 0.55})`;
      ctx.beginPath(); ctx.arc(x, y, 0.6 + p.z * 1.6, 0, 6.283); ctx.fill();
    }
    if (!reduced()) raf = requestAnimationFrame(frame);
  };
  const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) frame(); };
  const scheme = () => { colors = palette(); };
  light.addEventListener('change', scheme);
  size(); frame();
  c.classList.add('on');
  addEventListener('resize', size);
  document.addEventListener('visibilitychange', vis);
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); document.removeEventListener('visibilitychange', vis); light.removeEventListener('change', scheme); };
}

// Simple reveals: CSS transitions toggled by IntersectionObserver.
function reveals() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv:not(.in)').forEach((el) => io.observe(el));
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('solid', scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  return () => { io.disconnect(); removeEventListener('scroll', onScroll); };
}

type G = typeof import('gsap').gsap;

// Hero in the style of gsap.com: letters rise out of clipped slots in random order,
// shapes pop in where some letters belong, then hand the slot back to the letter.
function hero(gsap: G) {
  const root = document.querySelector<HTMLElement>('.hero');
  if (!root) return;
  const r = gsap.utils.random;
  const chars = gsap.utils.toArray<HTMLElement>('.hero-title .c:not(.swap) .l');
  const tl = gsap.timeline({ delay: 0.15, onComplete: () => root.classList.add('done') });
  // Letters sit below their clip slots, so making them visible up front shows nothing yet.
  gsap.set('.hero-title .l', { visibility: 'visible' });

  tl.fromTo(chars, { yPercent: 115, rotate: () => r(-25, 25) }, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: { each: 0.045, from: 'random' } }, 0);

  root.querySelectorAll<HTMLElement>('.c.swap').forEach((s, i) => {
    const flair = s.querySelector('.flair');
    const l = s.querySelector('.l');
    const at = 0.25 + i * 0.22;
    tl.fromTo(flair, { scale: 0, rotate: -120, autoAlpha: 1 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' }, at)
      .to(flair, { scale: 0, rotate: 90, yPercent: -40, duration: 0.45, ease: 'power3.in' }, at + 1.4)
      .fromTo(l, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, at + 1.65);
  });

  root.querySelectorAll<HTMLElement>('.flair.keep').forEach((f, i) => {
    tl.fromTo(f, { scale: 0, rotate: -180, autoAlpha: 1 }, { scale: 1, rotate: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' }, 0.5 + i * 0.5);
    gsap.to(f, { y: '+=12', rotate: '+=8', duration: 2.4 + i, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 });
  });

  tl.fromTo('.hero-sub .actions', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.1);

  // Letters drift apart at different speeds as the hero scrolls away.
  gsap.to('.hero-title .c', {
    y: () => r(-140, -20), rotate: () => r(-12, 12), ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
  });

  // Kept shapes lean toward the pointer.
  const keep = gsap.utils.toArray<HTMLElement>('.flair.keep');
  const movers = keep.map((f) => [gsap.quickTo(f, 'x', { duration: 0.8, ease: 'power3' }), gsap.quickTo(f, 'rotationY', { duration: 0.8, ease: 'power3' })]);
  const move = (e: PointerEvent) => {
    const dx = e.clientX / innerWidth - 0.5;
    movers.forEach(([x, ry], i) => { x(dx * (24 + i * 12)); ry(dx * 30); });
  };
  root.addEventListener('pointermove', move);
  return () => root.removeEventListener('pointermove', move);
}

// Advanced motion with GSAP, loaded after first paint so it never blocks rendering.
async function advanced(isLive: () => boolean) {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  if (!isLive()) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const stopHero = hero(gsap);

    return stopHero;
  });

  // Device mockups: scroll the screenshots only while the mockup is on screen, slower than the page,
  // holding the top of the site first. Wide screens pin the mockup (CSS sticky) for the whole article.
  const shots = (wide: boolean) => document.querySelectorAll<HTMLElement>('[data-devices]').forEach((d) => {
    const st = wide
      ? { trigger: d, start: 'top 35%', endTrigger: d.closest('article'), end: 'bottom 85%' }
      : { trigger: d, start: 'top 40%', end: 'bottom top' };
    const tl = gsap.timeline({ scrollTrigger: { ...st, scrub: 1, invalidateOnRefresh: true } });
    d.querySelectorAll<HTMLElement>('.viewport').forEach((v) => {
      const img = v.querySelector('img')!;
      // ponytail: shows ~1.5–2 screens of each screenshot; raise the factor to reveal more.
      tl.fromTo(img, { y: 0 }, { y: () => -Math.min(img.offsetHeight - v.offsetHeight, v.offsetHeight * (wide ? 1.1 : 1.2)), ease: 'none', duration: 0.7 }, 0.2);
    });
    tl.to({}, { duration: 0.05 });
  });
  mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => shots(true));
  mm.add('(max-width: 960px) and (prefers-reduced-motion: no-preference)', () => shots(false));

  // Story: pin the section and slide the sentence sideways; chips flip up, shapes spin in, letters drop.
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const story = document.querySelector<HTMLElement>('.story');
    const track = story?.querySelector<HTMLElement>('.story-track');
    if (!story || !track) return;
    story.classList.add('live');
    const dist = () => track.scrollWidth - innerWidth;
    const move = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: story, pin: true, start: 'top top', end: () => '+=' + dist() * 0.7, scrub: 0.8, invalidateOnRefresh: true },
    });
    const along = (el: Element, from: gsap.TweenVars, to: gsap.TweenVars, targets: gsap.TweenTarget = el) =>
      gsap.fromTo(targets, from, { ...to, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 95%', end: 'left 55%', scrub: true } });
    track.querySelectorAll('.st-word:not(.chip):not(.drop)').forEach((w) => along(w, { opacity: 0.15, yPercent: 30 }, { opacity: 1, yPercent: 0 }));
    track.querySelectorAll<HTMLElement>('.chip').forEach((c) => along(c, { rotateX: -95, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, opacity: 1 }));
    track.querySelectorAll('.st-shape').forEach((s) => along(s, { scale: 0, rotate: -200 }, { scale: 1, rotate: 0 }));
    track.querySelectorAll('.drop').forEach((d) => along(d, { yPercent: () => gsap.utils.random(-160, -60), rotate: () => gsap.utils.random(-40, 40), opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.05 }, d.querySelectorAll('.ch')));
    return () => story.classList.remove('live');
  });

  // Print work slides sideways with scroll on wide screens; on phones it stays a swipeable row.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const t = document.getElementById('prints');
    if (!t) return;
    gsap.fromTo(t, { x: () => innerWidth * 0.15 }, {
      x: () => -(t.scrollWidth - innerWidth * 0.85), ease: 'none',
      scrollTrigger: { trigger: '.prints', start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true },
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  addEventListener('load', refresh, { once: true });
  return () => { removeEventListener('load', refresh); mm.revert(); };
}

export default function Effects() {
  const path = usePathname();

  useEffect(() => {
    let stop = () => {};
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 200));
    idle(() => { stop = particles(); });
    return () => stop();
  }, []);

  // Per page: set up, and fully revert on navigation (also keeps React dev double-run safe).
  useEffect(() => {
    let live = true;
    let stopGsap = () => {};
    const stopReveals = reveals();
    // Safety net: if GSAP never loads, show the hero anyway.
    const fallback = setTimeout(() => document.querySelector('.hero')?.classList.add('done'), 3000);
    advanced(() => live).then((s) => { if (live) stopGsap = s; else s(); });
    return () => { live = false; clearTimeout(fallback); stopReveals(); stopGsap(); };
  }, [path]);

  return null;
}
