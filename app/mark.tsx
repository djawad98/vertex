// The Vertex "V" traced from the logo. Paths are stroked so GSAP can draw them.
export function Mark({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="20 10 560 540" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="60" y1="520" x2="520" y2="70">
          <stop offset="0" stopColor="#0780f5" />
          <stop offset=".55" stopColor="#119fb9" />
          <stop offset="1" stopColor="#2fe1c0" />
        </linearGradient>
        <radialGradient id={`${id}r`}>
          <stop offset="0" stopColor="#48fee6" />
          <stop offset=".35" stopColor="#48fee6" stopOpacity=".45" />
          <stop offset="1" stopColor="#48fee6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" stroke={`url(#${id}g)`} strokeWidth="36" strokeLinejoin="miter">
        <path className="m-a" d="M245 300 L148 124 L52 124 L265 512" strokeLinecap="round" />
        <path className="m-b" d="M265 512 L507 78" />
        <path className="m-c" d="M232 196 L333 176 L265 368 L486 92" />
      </g>
      <circle className="m-glow" cx="535" cy="42" r="46" fill={`url(#${id}r)`} />
      <circle className="m-ring" cx="535" cy="42" r="16" fill="none" stroke="#48fee6" strokeWidth="2" />
      <circle className="m-dot" cx="535" cy="42" r="15" fill="#48fee6" />
    </svg>
  );
}
