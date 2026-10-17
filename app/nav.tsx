'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { nav } from './content';
import { Mark } from './mark';

export default function Nav() {
  const path = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => { if (menu.current) menu.current.open = false; }, [path]);
  const links = nav.map(([href, label]) => (
    <Link key={href} href={href} aria-current={path.startsWith(href) ? 'page' : undefined}>{label}</Link>
  ));
  return (
    <header className="nav" id="nav">
      <Link href="/" className="brand" aria-label="Vertex home">
        <Mark id="nm" className="brand-mark" />
        <span>Vertex</span>
      </Link>
      <nav aria-label="Main" className="nav-links">{links}</nav>
      <Link className="btn btn-sm nav-cta" href="/contact/">Start a project</Link>
      <details className="menu" ref={menu}>
        <summary aria-label="Menu"><span /><span /></summary>
        <nav aria-label="Mobile">{links}</nav>
      </details>
    </header>
  );
}
