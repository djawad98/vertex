'use client';
// Pinned sentence that scrolls sideways, in the style of gsap.com's "Animate anything" section.
// Plain words, highlight chips and small shapes animate as they cross the screen.
import { useLayoutEffect, useRef } from 'react';
import { shapes } from './hero';

type Bit = { t: string; chip?: 'a' | 'b' | 'c'; tilt?: number; drop?: boolean } | { s: keyof typeof shapes };

const line: Bit[] = [
  { t: 'Whether' }, { t: 'you' }, { t: 'need' }, { t: 'a' }, { t: 'brand,', chip: 'a', tilt: -4 }, { s: 'wheel' },
  { t: 'a' }, { t: 'store', chip: 'b', tilt: 3 }, { s: 'bolt' }, { t: 'or' }, { t: 'an' }, { t: 'app,', chip: 'c', tilt: -3 },
  { s: 'spark' }, { t: 'Vertex' }, { t: 'has' }, { t: 'your' }, { t: 'back.', drop: true }, { s: 'worm' },
];

// GSAP pinning wraps .story in a pin-spacer. Owning the setup here (layout effect, React-owned outer div)
// means the pin is reverted before React removes the section on navigation, so the DOM stays consistent.
function useStory(ref: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert(): void } | undefined;
    let dead = false;
    const wake = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    // Built on first interaction, like the other scroll effects, to keep load fast.
    const start = async () => {
      wake.forEach((e) => removeEventListener(e, start));
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (dead || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const story = ref.current.querySelector<HTMLElement>('.story')!;
      const track = story.querySelector<HTMLElement>('.story-track')!;
      ctx = gsap.context(() => {
        story.classList.add('live');
        const dist = () => track.scrollWidth - innerWidth;
        const move = gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: story, pin: true, start: 'top top', end: () => '+=' + dist() * 0.6, scrub: 0.8, invalidateOnRefresh: true, refreshPriority: 1 },
        });
        const along = (el: Element, from: gsap.TweenVars, to: gsap.TweenVars, targets: gsap.TweenTarget = el) =>
          gsap.fromTo(targets, from, { ...to, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 95%', end: 'left 55%', scrub: true } });
        track.querySelectorAll('.st-word:not(.chip):not(.drop)').forEach((w) => along(w, { opacity: 0.15, yPercent: 30 }, { opacity: 1, yPercent: 0 }));
        track.querySelectorAll('.chip').forEach((c) => along(c, { rotateX: -95, opacity: 0, transformOrigin: '50% 100%' }, { rotateX: 0, opacity: 1 }));
        track.querySelectorAll('.st-shape').forEach((sh) => along(sh, { scale: 0, rotate: -200 }, { scale: 1, rotate: 0 }));
        track.querySelectorAll('.drop').forEach((d) => along(d, { yPercent: () => gsap.utils.random(-160, -60), rotate: () => gsap.utils.random(-40, 40), opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.05 }, d.querySelectorAll('.ch')));
      }, ref.current);
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    wake.forEach((e) => addEventListener(e, start, { passive: true }));
    if (scrollY > 0) start();
    return () => {
      dead = true;
      wake.forEach((e) => removeEventListener(e, start));
      ctx?.revert();
      ref.current?.querySelector('.story')?.classList.remove('live');
    };
  }, [ref]);
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref);
  return (
    <div ref={ref}>
    <section className="story" aria-label="What Vertex does">
      <p className="sr-only">
        Whether you need a brand, a store or an app, Vertex has your back.
      </p>
      <div className="story-pin">
        <div className="story-track" aria-hidden="true">
          {line.map((b, i) =>
            's' in b ? (
              <span key={i} className={`st-shape f-${b.s}`}>{shapes[b.s]}</span>
            ) : (
              <span key={i} className={`st-word${b.chip ? ` chip chip-${b.chip}` : ''}${b.drop ? ' drop' : ''}`} style={b.tilt ? ({ '--tilt': `${b.tilt}deg` } as React.CSSProperties) : undefined}>
                {b.drop ? [...b.t].map((ch, j) => <span key={j} className="ch">{ch}</span>) : b.t}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
    </div>
  );
}
