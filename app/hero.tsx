// Hero headline split into per-letter slots for the gsap.com-style intro (see effects.tsx).
// Some letters start as a shape that later hands its slot back ("swap");
// "keep" shapes stay as floating accents.
const grad = (
  <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stopColor="#0780f5" />
    <stop offset=".55" stopColor="#119fb9" />
    <stop offset="1" stopColor="#2fe1c0" />
  </linearGradient>
);

const shapes = {
  // Target.
  target: (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="url(#hg)" strokeWidth="12" /><circle cx="50" cy="50" r="20" fill="none" stroke="#48fee6" strokeWidth="10" /><circle cx="50" cy="50" r="6" fill="#48fee6" /></svg>
  ),
  // Bolt.
  bolt: (
    <svg viewBox="0 0 70 110"><path d="M44 0 4 62h26l-8 48 44-66H40z" fill="#2fe1c0" /></svg>
  ),
  // Sparkle.
  spark: (
    <svg viewBox="0 0 100 100"><path d="M50 0c4 30 16 42 50 50-34 8-46 20-50 50-4-30-16-42-50-50C34 42 46 30 50 0z" fill="url(#hg)" /></svg>
  ),
  // Pinwheel made of the logo's blues.
  wheel: (
    <svg viewBox="0 0 100 100"><path d="M50 50V0a50 50 0 0 1 50 50z" fill="#0780f5" /><path d="M50 50h50v50A50 50 0 0 1 50 50z" fill="#2fe1c0" /><path d="M50 50v50H0a50 50 0 0 1 50-50z" fill="#119fb9" /><path d="M50 50H0V0a50 50 0 0 1 50 50z" fill="#48fee6" /></svg>
  ),
  // Squiggle.
  worm: (
    <svg viewBox="0 0 160 70"><path d="M10 50c15-40 30-40 35 0s25 40 35 0 25-40 35 0 25 30 35-10" fill="none" stroke="url(#hg)" strokeWidth="16" strokeLinecap="round" /></svg>
  ),
};
type Shape = keyof typeof shapes;

function Word({ text, swap = {}, keep = {} }: { text: string; swap?: Record<number, Shape>; keep?: Record<number, Shape> }) {
  return (
    <span className="w">
      {[...text].map((ch, i) => (
        <span key={i} className={`c${swap[i] ? ' swap' : ''}`}>
          <span className="clip"><span className="l">{ch}</span></span>
          {swap[i] && <span className={`flair f-${swap[i]}`}>{shapes[swap[i]]}</span>}
          {keep[i] && <span className={`flair keep f-${keep[i]}`}>{shapes[keep[i]]}</span>}
        </span>
      ))}
    </span>
  );
}

export function HeroTitle() {
  return (
    <>
      <h1 className="sr-only">From idea to the top: websites, apps, branding and digital marketing in Mashhad</h1>
      <div className="hero-title" aria-hidden="true">
        <svg width="0" height="0" style={{ position: 'absolute' }}><defs>{grad}</defs></svg>
        <span className="row">
          <Word text="From" keep={{ 0: 'spark' }} />
          <Word text="idea" swap={{ 2: 'target' }} keep={{ 3: 'wheel' }} />
        </span>
        <span className="row row-2">
          <Word text="to" swap={{ 1: 'bolt' }} />
          <Word text="the" />
          <Word text="top." swap={{ 1: 'spark' }} keep={{ 3: 'worm' }} />
        </span>
      </div>
    </>
  );
}
