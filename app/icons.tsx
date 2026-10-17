// Line icons for the service groups. Stroke uses the shared #hg gradient (see ShapeDefs in hero.tsx).
const paths: Record<string, React.ReactNode> = {
  // Phone in front of a browser window.
  apps: (
    <>
      <rect x="3" y="6" width="28" height="20" rx="3" />
      <path d="M3 11h28" />
      <circle cx="7" cy="8.5" r=".6" fill="currentColor" />
      <rect x="25" y="14" width="12" height="20" rx="2.5" />
      <path d="M29.5 30.5h3" />
    </>
  ),
  // Magnifier over a rising chart.
  seo: (
    <>
      <circle cx="17" cy="17" r="11" />
      <path d="M25 25l10 10" />
      <path d="M11 21l4-4 3 3 5-6" />
    </>
  ),
  // Pen nib drawing a curve.
  design: (
    <>
      <path d="M20 4l8 14-8 16-8-16z" />
      <path d="M20 18v6" />
      <circle cx="20" cy="18" r="2" />
      <path d="M4 36c6-6 10 2 16-4" />
    </>
  ),
  // Chat bubble with a heart.
  social: (
    <>
      <path d="M6 8h28a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H16l-8 6v-6H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      <path d="M20 23s-6-3.5-6-7.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5z" />
    </>
  ),
  // Chip with a sparkle.
  ai: (
    <>
      <rect x="9" y="9" width="22" height="22" rx="4" />
      <path d="M15 4v5M25 4v5M15 31v5M25 31v5M4 15h5M4 25h5M31 15h5M31 25h5" />
      <path d="M20 13c.8 4 2.6 5.8 6.5 7-3.9 1.2-5.7 3-6.5 7-.8-4-2.6-5.8-6.5-7 3.9-1.2 5.7-3 6.5-7z" />
    </>
  ),
};

export function ServiceIcon({ id }: { id: string }) {
  return (
    <svg className="svc-icon" viewBox="0 0 40 40" fill="none" stroke="url(#hg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}
