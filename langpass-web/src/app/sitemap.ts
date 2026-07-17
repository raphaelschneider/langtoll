import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://langpass.app';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/privacy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
