import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Google_Sans, Unbounded } from 'next/font/google';
import { site, serviceGroups, team, nav } from './content';
import Nav from './nav';
import Effects from './effects';
import ThemeSwitch, { themeScript } from './theme';
import { tel } from './ui';
import './globals.css';

// next/font has no metric overrides for Google Sans yet, so fall back to plain Arial.
const sans = Google_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap', adjustFontFallback: false, fallback: ['Arial', 'sans-serif'] });
const display = Unbounded({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s | Vertex' },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, title: site.title, description: site.description, locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f141b' },
    { media: '(prefers-color-scheme: light)', color: '#f6f8fa' },
  ],
  colorScheme: 'dark light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.png`,
  image: `${site.url}/opengraph-image.jpg`,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: { '@type': 'PostalAddress', streetAddress: 'Ilma Tower, Ghasem Abad', addressLocality: 'Mashhad', addressRegion: 'Razavi Khorasan', addressCountry: 'IR' },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
  founder: { '@type': 'Person', name: 'Javad Ghased' },
  employee: team.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.role })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: serviceGroups.flatMap((g) => g.items).map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.text } })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Hide reveal targets only when JS will reveal them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <canvas id="particles" aria-hidden="true" />
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <footer className="footer">
          <div>
            <p className="footer-brand">Vertex</p>
            <p className="muted">Software, design and digital marketing studio.</p>
          </div>
          <nav aria-label="Footer">
            {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <address>
            <a href={tel}>{site.phoneLabel}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.address}</span>
          </address>
          <div className="bottom">
            <p>© {new Date().getFullYear()} Vertex Software Solutions</p>
            <ThemeSwitch />
          </div>
        </footer>
        <Effects />
      </body>
    </html>
  );
}
