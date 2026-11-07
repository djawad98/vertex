import { site, sites } from './content';

// Home "Selected work": websites from github.com/djawad98/portfolio.
// Screenshots: public/work/sites/<id>.jpg (1396×868 home-page captures).
export function SiteGrid() {
  return (
    <ul className="site-grid">
      {sites.map((s) => {
        const host = s.url.replace('https://', '');
        return (
          <li key={s.id} className="site-card rv">
            <a href={s.url} target="_blank" rel="noopener" aria-labelledby={`site-${s.id}`}>
              <div className="site-shot">
                <div className="bar"><i /><i /><i /><span>{host}</span></div>
                <img src={`${site.base}/work/sites/${s.id}.jpg`} sizes="(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 30vw" alt={`${s.name} home page`} width={1396} height={868} loading="lazy" decoding="async" />
              </div>
              <p className="kind">{s.kind}</p>
              <h3 id={`site-${s.id}`}>{s.name}</h3>
              <p className="muted">{s.summary}</p>
              <span className="link">Visit {host}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
