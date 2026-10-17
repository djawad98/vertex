import type { Metadata } from 'next';
import { site, projects, prints } from '../content';
import { PageHead, ProjectBlock, Cta, LogoGrid } from '../ui';

export const metadata: Metadata = {
  title: 'Work: websites, stores and brand design',
  description: 'Case studies with results: Hamyar Tashkhis online academy, HiTech smart building store, Subchi transcription app, plus logos, posters and catalogs.',
};

export default function Work() {
  return (
    <>
      <PageHead title="Work" lead="Real products, live for real customers, with the numbers they moved." />
      <section className="section work" aria-labelledby="cases-h">
        <h2 id="cases-h" className="rv">Case studies</h2>
        {projects.map((p, i) => <ProjectBlock key={p.id} p={p} flip={i % 2 === 1} full />)}
      </section>

      <section className="section brand-work" aria-labelledby="brand-h">
        <div className="section-head rv">
          <h2 id="brand-h">Logos and graphic design</h2>
          <p className="muted">Marks, posters, catalogs and book covers.</p>
        </div>
        <LogoGrid />
      </section>
      <section className="prints" aria-label="Print and poster design">
        <div className="prints-track" id="prints">
          {prints.map(([f, title, kind, w, h]) => (
            <figure key={f}>
              <img src={`${site.base}/brand/${f}.webp`} alt={`${title}, ${kind.toLowerCase()}`} width={w} height={h} loading="lazy" decoding="async" />
              <figcaption><strong>{title}</strong> {kind}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
