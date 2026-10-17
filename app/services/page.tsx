import type { Metadata } from 'next';
import { serviceGroups } from '../content';
import { PageHead, Cta } from '../ui';

export const metadata: Metadata = {
  title: 'Services: apps, e-commerce, SEO, branding & AI',
  description: 'Application and e-commerce development, WordPress, SEO, social media management, branding, logo and social media design, plus AI agents, MCP and LLM integration.',
};

export default function Services() {
  return (
    <>
      <PageHead title="Services" lead="Development, growth, brand design and AI integration. Pick one, or bring us the whole launch." />
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
