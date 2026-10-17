import type { Metadata } from 'next';
import { strengths } from '../content';
import { PageHead, Location, Cta, Team } from '../ui';

export const metadata: Metadata = {
  title: 'About Vertex and our team',
  description: 'Meet the Vertex team in Mashhad: Javad Ghased, Mohammadreza Akmali, Danial Naghavi and Hana Alavizade.',
};

export default function About() {
  return (
    <>
      <PageHead
        title="A small senior team"
        lead="Vertex started as a group of developers and designers who were tired of slow agencies. We keep the team small, use modern tools to move fast, and spend our time on decisions, details and talking to you."
      />
      <section className="section ai" aria-label="How we work">
        <ul className="ai-points">
          {strengths.map(([stat, title, text]) => (
            <li key={title} className="rv"><p className="stat">{stat}</p><h3>{title}</h3><p className="muted">{text}</p></li>
          ))}
        </ul>
      </section>
      <Team />
      <Location />
      <Cta />
    </>
  );
}
