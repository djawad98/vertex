import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="page-head not-found">
      <h1>Page not found</h1>
      <p className="lead">The page you are looking for has moved or never existed.</p>
      <div className="actions">
        <Link className="btn" href="/">Go to the home page</Link>
        <Link className="btn btn-ghost" href="/contact/">Contact us</Link>
      </div>
    </section>
  );
}
