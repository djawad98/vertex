import type { MetadataRoute } from 'next';
import { site, nav } from './content';
import { posts } from './mag/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, priority: 1 },
    ...nav.map(([href]) => ({ url: `${site.url}${href}`, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/mag/${p.slug}/`, lastModified: p.date, priority: 0.6 })),
  ];
}
