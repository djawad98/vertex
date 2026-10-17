import Link from 'next/link';
import { site, mapsUrl, team, type Project } from './content';

export const tel = `tel:${site.phone}`;

export function PageHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="page-head">
      {/* No reveal here: the title is the LCP element on inner pages. */}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}

function Devices({ p }: { p: Project }) {
  return (
    <div className="devices" data-devices>
      <div className="laptop rv">
        <div className="laptop-screen">
          <div className="bar"><i /><i /><i /><span>{p.url.replace('https://', '')}</span></div>
          <div className="viewport">
            <img src={`${site.base}/work/${p.id}-desktop.webp`} srcSet={`${site.base}/work/${p.id}-desktop-sm.webp 640w, ${site.base}/work/${p.id}-desktop.webp 1200w`} sizes="(max-width: 960px) 90vw, 55vw" alt={`${p.name} website on desktop`} width={1200} height={4000} loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="laptop-base" />
      </div>
      <div className="phone rv">
        <div className="viewport">
          <img src={`${site.base}/work/${p.id}-mobile.webp`} srcSet={`${site.base}/work/${p.id}-mobile-sm.webp 300w, ${site.base}/work/${p.id}-mobile.webp 600w`} sizes="(max-width: 960px) 24vw, 15vw" alt={`${p.name} website on mobile`} width={600} height={6000} loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  );
}

export function ProjectBlock({ p, flip, full }: { p: Project; flip: boolean; full?: boolean }) {
  return (
    <article className={`project${flip ? ' flip' : ''}${full ? ' full' : ''}`} aria-labelledby={`${p.id}-h`}>
      <Devices p={p} />
      <div className="project-copy">
        <p className="kind rv">{p.kind}</p>
        <h3 id={`${p.id}-h`} className="rv">{p.name}</h3>
        <p className="summary rv">{p.summary}</p>
        <dl className="results rv">
          {p.results.map(([n, label]) => (
            <div key={label}><dt>{n}</dt><dd>{label}</dd></div>
          ))}
        </dl>
        {full && (
          <>
            <h4 className="rv">What we did</h4>
            <ul className="did rv">{p.did.map((d) => <li key={d}>{d}</li>)}</ul>
          </>
        )}
        <ul className="tags rv" aria-label="Stack">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
        {p.live !== false && (
          <a className="link rv" href={p.url} target="_blank" rel="noopener">Visit {p.url.replace('https://', '')}</a>
        )}
      </div>
    </article>
  );
}

export function Location() {
  const { lat, lon } = site.geo;
  const bbox = [lon - 0.012, lat - 0.007, lon + 0.012, lat + 0.007].join('%2C');
  return (
    <section className="section location" aria-labelledby="loc-h">
      <div className="loc-copy rv">
        <h2 id="loc-h">Visit the studio</h2>
        <address>
          <p>{site.address}</p>
          <p><a href={tel}>{site.phoneLabel}</a></p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </address>
        <p className="muted">Saturday to Wednesday, 9:00 to 18:00. Call ahead and we will have coffee ready.</p>
        <div className="actions">
          <a className="btn" href={mapsUrl} target="_blank" rel="noopener">Get directions</a>
          <Link className="btn btn-ghost" href="/contact/">Send a message</Link>
        </div>
      </div>
      <div className="map rv">
        <iframe
          title="Map showing Vertex at Ilma Tower, Ghasem Abad, Mashhad"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="section contact" aria-labelledby="cta-h">
      <h2 id="cta-h" className="rv">Have a project in mind?</h2>
      <p className="lead rv">Tell us what you are building. We reply within one working day with next steps and a rough budget.</p>
      <div className="actions rv">
        <Link className="btn btn-lg" href="/contact/">Start a project</Link>
        <a className="btn btn-lg btn-ghost" href={tel}>Call {site.phoneLabel}</a>
      </div>
    </section>
  );
}

export const fmtDate = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function Team() {
  return (
    <section className="section team" aria-labelledby="team-h">
      <div className="section-head rv">
        <h2 id="team-h">The people behind Vertex</h2>
        <p className="muted">You work with the people who do the work.</p>
      </div>
      <ul className="members">
        {team.map((m) => (
          <li key={m.name} className="member rv">
            <div className="portrait">
              {m.photo ? (
                <img src={`${site.base}/team/${m.photo}.webp`} alt={`Portrait of ${m.name}`} width={480} height={600} loading="lazy" decoding="async" />
              ) : (
                <span className="initials" aria-hidden="true">{m.name.split(' ').map((n) => n[0]).join('')}</span>
              )}
            </div>
            <h3>{m.url ? <a href={m.url} target="_blank" rel="noopener">{m.name}</a> : m.name}</h3>
            <p>{m.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
