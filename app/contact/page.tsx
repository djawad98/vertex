import type { Metadata } from 'next';
import { site } from '../content';
import { PageHead, Location, tel } from '../ui';
import ContactForm from './form';

export const metadata: Metadata = {
  title: 'Contact Vertex',
  description: `Start a project with Vertex. Call ${site.phoneLabel}, email ${site.email} or visit us at Ilma Tower, Ghasem Abad, Mashhad.`,
};

export default function Contact() {
  return (
    <>
      <PageHead title="Start a project" lead="Tell us what you are building. We reply within one working day with next steps and a rough budget." />
      <section className="section contact-grid">
        <ContactForm />
        <aside className="contact-side rv" aria-label="Other ways to reach us">
          <h2>Prefer to talk?</h2>
          <a className="big-link" href={tel}>{site.phoneLabel}</a>
          <a className="big-link" href={`mailto:${site.email}`}>{site.email}</a>
          <p className="muted">{site.address}</p>
        </aside>
      </section>
      <Location />
    </>
  );
}
