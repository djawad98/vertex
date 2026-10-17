import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts } from '../posts';
import { site } from '../../content';
import { Cta, fmtDate } from '../../ui';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.date, authors: [p.author] } };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt,
    datePublished: p.date, author: { '@type': 'Person', name: p.author },
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/icon.png` } },
    mainEntityOfPage: `${site.url}/mag/${p.slug}/`,
  };
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 2);
  return (
    <>
      <article className="article">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <p className="kind"><Link href="/mag/">Mag</Link> / {p.tag}</p>
        <h1>{p.title}</h1>
        <p className="lead">{p.excerpt}</p>
        <p className="meta">{p.author}, <time dateTime={p.date}>{fmtDate(p.date)}</time></p>
        <div className="prose">
          {p.body.map((b, i) => (b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>))}
        </div>
      </article>
      <section className="section mag-more" aria-labelledby="more-h">
        <h2 id="more-h" className="rv">Keep reading</h2>
        <ul className="posts two">
          {more.map((m) => (
            <li key={m.slug} className="post-card rv">
              <p className="kind">{m.tag}</p>
              <h3><Link href={`/mag/${m.slug}/`}>{m.title}</Link></h3>
              <p className="muted">{m.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
      <Cta />
    </>
  );
}
