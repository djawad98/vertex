import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from './posts';
import { PageHead, fmtDate } from '../ui';

export const metadata: Metadata = {
  title: 'Mag: development, design, marketing and AI',
  description: 'Articles from the Vertex team on e-commerce speed, branding, social media, AI agents and MCP.',
};

export default function Mag() {
  const [lead, ...rest] = posts;
  return (
    <>
      <PageHead title="Vertex Mag" lead="Notes from our work on development, design, marketing and AI." />
      <section className="section mag">
        <article className="post-lead rv">
          <p className="kind">{lead.tag}</p>
          <h2><Link href={`/mag/${lead.slug}/`}>{lead.title}</Link></h2>
          <p className="lead">{lead.excerpt}</p>
          <p className="meta">{lead.author}, <time dateTime={lead.date}>{fmtDate(lead.date)}</time></p>
        </article>
        <ul className="posts">
          {rest.map((p) => (
            <li key={p.slug} className="post-card rv">
              <p className="kind">{p.tag}</p>
              <h3><Link href={`/mag/${p.slug}/`}>{p.title}</Link></h3>
              <p className="muted">{p.excerpt}</p>
              <p className="meta">{p.author}, <time dateTime={p.date}>{fmtDate(p.date)}</time></p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
