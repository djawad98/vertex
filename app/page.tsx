import Link from 'next/link';
import { serviceGroups, projects } from './content';
import { posts } from './mag/posts';
import { HeroTitle, ShapeDefs } from './hero';
import { Story } from './story';
import { ServiceIcon } from './icons';
import { ProjectBlock, Location, Cta, Team, LogoGrid, Halo, fmtDate } from './ui';

export default function Home() {
  return (
    <>
      <ShapeDefs />
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

      <Story />

      <section className="section services-home has-halo" aria-labelledby="services-h">
        <Halo img="circuit" />
        <div className="section-head rv">
          <h2 id="services-h">What we do</h2>
        </div>
        <ul className="groups rv">
          {serviceGroups.map((g) => (
            <li key={g.id} className="group">
              <ServiceIcon id={g.id} />
              <h3><Link href={`/services/#${g.id}`}>{g.name}</Link></h3>
              <p className="muted">{g.intro}</p>
              <ul className="tags">{g.items.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
            </li>
          ))}
        </ul>
        <div className="actions rv">
          <Link className="link" href="/services/">All services</Link>
          <Link className="link" href="/pricing/">Estimate your price</Link>
        </div>
      </section>

      <section className="section work" aria-labelledby="work-h">
        <div className="section-head rv"><h2 id="work-h">Selected work</h2></div>
        {projects.slice(0, 2).map((p, i) => <ProjectBlock key={p.id} p={p} flip={i % 2 === 1} />)}
        <Link className="btn btn-ghost rv" href="/work/">See all work and brand design</Link>
      </section>

      <section className="section logos-home" aria-labelledby="logos-h">
        <div className="section-head rv">
          <h2 id="logos-h">Logos we designed</h2>
          <p className="muted">Identities for clinics, factories, stores, media and startups.</p>
        </div>
        <LogoGrid />
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
