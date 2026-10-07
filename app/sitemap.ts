import type { MetadataRoute } from 'next';
import { projects, SITE_URL } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'projects/', 'experience/', 'activities/', 'profile/', ...projects.map((p) => `projects/${p.id}/`)];
  return pages.map((path) => ({ url: `${SITE_URL}/${path}`, priority: path === '' ? 1 : 0.7 }));
}
