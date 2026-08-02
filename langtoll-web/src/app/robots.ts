import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Only /api/ is named. The admin dashboard (/langtoll-adm) is deliberately NOT listed —
      // robots.txt is public, so listing a secret path just hands it to scanners.
      disallow: ['/api/'],
    },
    sitemap: 'https://langtoll.app/sitemap.xml',
  };
}
