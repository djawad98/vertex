'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Background particles. Each has a depth; scroll moves near ones faster (parallax).
// They drift, wander on a slow wave, and ease away from the pointer.
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
    vx: (Math.random() - 0.5) * 0.0007, vy: (Math.random() - 0.5) * 0.0007,
    ph: Math.random() * 6.283, amp: 10 + Math.random() * 26,
    ox: 0, oy: 0,
    c: (Math.random() * 4) | 0,
  }));
  let mx = -1e4, my = -1e4;
  const pointer = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
  const size = () => {
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const frame = (t = 0) => {
    ctx.clearRect(0, 0, w, h);
    const s = scrollY, k = t / 1000;
    const pts = ps.map((p) => {
      p.x = (p.x + p.vx * p.z + 1) % 1; p.y = (p.y + p.vy * p.z + 1) % 1;
      let x = p.x * w + Math.sin(k * 0.6 + p.ph) * p.amp * p.z;
      let y = (((p.y * h - s * p.z * 0.6) % h) + h) % h + Math.cos(k * 0.45 + p.ph) * p.amp * p.z;
      // Push away from the pointer, then ease back.
      const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
      const f = d < 150 ? (1 - d / 150) * 40 : 0;
      p.ox += ((d ? (dx / d) * f : 0) - p.ox) * 0.08;
      p.oy += ((d ? (dy / d) * f : 0) - p.oy) * 0.08;
      x += p.ox; y += p.oy;
      return [x, y, p] as const;
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
  const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) frame(performance.now()); };
  const scheme = () => { colors = palette(); };
  light.addEventListener('change', scheme);
  size(); frame();
  c.classList.add('on');
  addEventListener('resize', size);
  addEventListener('pointermove', pointer, { passive: true });
  document.addEventListener('visibilitychange', vis);
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', pointer); document.removeEventListener('visibilitychange', vis); light.removeEventListener('change', scheme); };
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

  mm.add('(prefers-reduced-motion: no-preference)', () => hero(gsap));

  // Everything below is scroll-driven and below the fold, so build it on the first scroll or touch
  // instead of at load (keeps the main thread free while the page becomes interactive).
  const wake = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
  const later = () => {
    wake.forEach((e) => removeEventListener(e, later));
    if (isLive()) scrollEffects(gsap, mm);
    ScrollTrigger.sort(); // order by page position so pin spacing is applied to triggers below it
    ScrollTrigger.refresh();
  };
  wake.forEach((e) => addEventListener(e, later, { passive: true }));
  if (scrollY > 0) later();

  const refresh = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
  addEventListener('load', refresh, { once: true });
  return () => { wake.forEach((e) => removeEventListener(e, later)); removeEventListener('load', refresh); mm.revert(); };
}

function scrollEffects(gsap: G, mm: gsap.MatchMedia) {

  // Device mockups: scroll the screenshots while the mockup is fully on screen, holding the top of the
  // site first. Wide screens keep the mockup pinned (CSS sticky) for the whole article.
  const shots = (wide: boolean) => document.querySelectorAll<HTMLElement>('[data-devices]').forEach((d) => {
    // Desktop: from when the mockup settles until it has mostly left the screen after its sticky phase.
    const st = wide
      ? { trigger: d, start: 'top 30%', endTrigger: d.closest('article'), end: 'bottom 20%' }
      : { trigger: d, start: 'top 25%', end: 'bottom top' };
    const tl = gsap.timeline({ scrollTrigger: { ...st, scrub: 0.8, invalidateOnRefresh: true } });
    d.querySelectorAll<HTMLElement>('.viewport').forEach((v) => {
      const img = v.querySelector('img')!;
      // ponytail: reveals up to ~2.5 screens of each screenshot; raise the factor to show more of the site.
      tl.fromTo(img, { y: 0 }, { y: () => -Math.min(img.offsetHeight - v.offsetHeight, v.offsetHeight * 2.5), ease: 'none', duration: 0.8 }, 0.1);
    });
    tl.to({}, { duration: 0.1 });
  });
  mm.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => shots(true));
  mm.add('(max-width: 960px) and (prefers-reduced-motion: no-preference)', () => shots(false));

  // Print work slides sideways with scroll on wide screens; on phones it stays a swipeable row.
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const t = document.getElementById('prints');
    if (!t) return;
    gsap.fromTo(t, { x: () => innerWidth * 0.15 }, {
      x: () => -(t.scrollWidth - innerWidth * 0.85), ease: 'none',
      scrollTrigger: { trigger: '.prints', start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true },
    });
  });

}

export default function Effects() {
  const path = usePathname();

  useEffect(() => {
    let stop = () => {};
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 600 }) : setTimeout(cb, 200));
    idle(() => { stop = particles(); });
    return () => stop();
  }, []);

  // Menu links open a page at the top; back/forward returns to where you were on that page.
  // Positions are saved per path because GSAP's refresh undoes the browser's own restore.
  const popped = useRef(false);
  const saved = useRef(new Map<string, number>());
  useEffect(() => {
    const onPop = () => { popped.current = true; };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useLayoutEffect(() => {
    let t = 0;
    if (popped.current) {
      popped.current = false;
      const y = saved.current.get(path) ?? 0;
      // Wait for the page's scroll effects to add their spacing, then jump back.
      t = window.setTimeout(() => window.scrollTo({ top: y, behavior: 'instant' }), 350);
    } else if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    return () => { clearTimeout(t); saved.current.set(path, scrollY); };
  }, [path]);

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
