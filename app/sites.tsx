import { site, sites } from './content';

// Home "Selected work". Each card opens the site's static copy at /portfolio/<id>/.
// Screenshots: public/work/sites/<id>.jpg (home-page captures).
export function SiteGrid() {
  return (
    <ul className="site-grid">
      {sites.map((s) => {
        const path = `/portfolio/${s.id}/`;
        const label = `vertex-idea.ir${path}`;
        return (
          <li key={s.id} className="site-card rv">
            <a href={`${site.base}${path}`} target="_blank" rel="noopener" aria-labelledby={`site-${s.id}`}>
              <div className="site-shot">
                <div className="bar"><i /><i /><i /><span>{label}</span></div>
                <img src={`${site.base}/work/sites/${s.id}.jpg`} sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 30vw" alt={`${s.name} home page`} width={1396} height={868} loading="lazy" decoding="async" />
              </div>
              <p className="kind">{s.kind}</p>
              <h3 id={`site-${s.id}`}>{s.name}</h3>
              <p className="muted">{s.summary}</p>
              <span className="link">View the site</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
