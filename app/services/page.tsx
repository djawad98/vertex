import type { Metadata } from 'next';
import { serviceGroups } from '../content';
import { PageHead, Cta } from '../ui';

export const metadata: Metadata = {
  title: 'Services: app development, SEO, design, social media & AI',
  description: 'App and e-commerce development, SEO, logo and graphic design, social media management and design, and AI solutions engineering: agents, MCP servers and LLM integration.',
};

export default function Services() {
  return (
    <>
      <PageHead title="Services" lead="App development, SEO, design, social media and AI. Pick one, or bring us the whole launch." />
      {serviceGroups.map((g) => (
        <section key={g.id} id={g.id} className="section services" aria-labelledby={`${g.id}-h`}>
          <div className="services-head rv">
            <h2 id={`${g.id}-h`}>{g.name}</h2>
            <p className="muted">{g.intro}</p>
          </div>
          <ul className="service-list">
            {g.items.map((s) => (
              <li key={s.name} className="service rv">
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <ul className="tags" aria-label={`${s.name} includes`}>{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Cta />
    </>
  );
}
