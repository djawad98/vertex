// Pinned sentence that scrolls sideways, in the style of gsap.com's "Animate anything" section.
// Plain words, highlight chips and small shapes; effects.tsx animates each piece as it crosses the screen.
import { shapes } from './hero';

type Bit = { t: string; chip?: 'a' | 'b' | 'c'; tilt?: number; drop?: boolean } | { s: keyof typeof shapes };

const line: Bit[] = [
  { t: 'Whether' }, { t: 'you' }, { t: 'need' }, { t: 'a' }, { t: 'brand', chip: 'a', tilt: -4 }, { s: 'wheel' },
  { t: 'people' }, { t: 'remember,' }, { t: 'a' }, { t: 'store', chip: 'b', tilt: 3 }, { t: 'that' }, { t: 'sells', drop: true },
  { s: 'bolt' }, { t: 'while' }, { t: 'you' }, { t: 'sleep,' }, { t: 'an' }, { t: 'app', chip: 'c', tilt: -3 }, { t: 'your' },
  { t: 'team' }, { t: 'loves,' }, { s: 'target' }, { t: 'or' }, { t: 'a' }, { t: 'first-page', chip: 'a', tilt: 2 },
  { t: 'Google', chip: 'b', tilt: -2 }, { t: 'ranking,' }, { s: 'spark' }, { t: 'Vertex' }, { t: 'has' }, { t: 'your' }, { t: 'back.', drop: true }, { s: 'worm' },
];

export function Story() {
  return (
    <section className="story" aria-label="What Vertex does">
      <p className="sr-only">
        Whether you need a brand people remember, a store that sells while you sleep, an app your team loves, or a first-page Google ranking, Vertex has your back.
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
  );
}
