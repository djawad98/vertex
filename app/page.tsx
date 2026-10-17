import Link from 'next/link';
import { serviceGroups, projects, logos } from './content';
import { posts } from './mag/posts';
import { HeroTitle } from './hero';
import { ProjectBlock, Location, Cta, Team, fmtDate } from './ui';

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroTitle />
        <div className="hero-sub">
          {/* This paragraph is the LCP element: keep it visible without JS. */}
          <p className="lead">
            Vertex designs brands, builds websites, stores and apps, and grows them with SEO and social media. One senior team, from first sketch to first page of Google.
          </p>
          <div className="actions">
            <Link className="btn" href="/contact/">Start a project</Link>
            <Link className="btn btn-ghost" href="/work/">See our work</Link>
          </div>
        </div>
      </section>

      <section className="section services-home" aria-labelledby="services-h">
        <div className="section-head rv">
          <h2 id="services-h">What we do</h2>
        </div>
        <ul className="groups rv">
          {serviceGroups.map((g) => (
            <li key={g.id} className="group">
              <h3><Link href={`/services/#${g.id}`}>{g.name}</Link></h3>
              <p className="muted">{g.intro}</p>
              <ul className="tags">{g.items.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
            </li>
          ))}
        </ul>
        <Link className="link rv" href="/services/">All services</Link>
      </section>

      <section className="section work" aria-labelledby="work-h">
        <div className="section-head rv"><h2 id="work-h">Selected work</h2></div>
        {projects.slice(0, 2).map((p, i) => <ProjectBlock key={p.id} p={p} flip={i % 2 === 1} />)}
        <Link className="btn btn-ghost rv" href="/work/">See all work and brand design</Link>
      </section>

      <section className="section logos-home" aria-label="Brands we designed">
        <ul className="logo-strip rv">
          {logos.slice(0, 6).map(([f, name]) => (
            <li key={f}><img src={`/brand/${f}.webp`} alt={`${name} logo`} width={560} height={560} loading="lazy" decoding="async" /></li>
          ))}
        </ul>
      </section>

      <Team />

      <section className="section mag-home" aria-labelledby="mag-h">
        <div className="section-head rv"><h2 id="mag-h">From the Mag</h2></div>
        <ul className="posts">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug} className="post-card rv">
              <p className="kind">{p.tag}</p>
              <h3><Link href={`/mag/${p.slug}/`}>{p.title}</Link></h3>
              <p className="muted">{p.excerpt}</p>
              <p className="meta"><time dateTime={p.date}>{fmtDate(p.date)}</time></p>
            </li>
          ))}
        </ul>
        <Link className="link rv" href="/mag/">Read the Mag</Link>
      </section>

      <Location />
      <Cta />
    </>
  );
}
