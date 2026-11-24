import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const today = new Date().toISOString().split('T')[0];

const URLS = [
  {
    loc: 'https://gridika.ru/',
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    loc: 'https://gridika.ru/3d-qr-code/',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: 'https://gridika.ru/promo-gift/',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: 'https://gridika.ru/3d-card/',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: 'https://gridika.ru/voxels/',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: 'https://gridika.ru/tilda/',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    loc: 'https://gridika.ru/guide',
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    loc: 'https://gridika.ru/offer',
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    loc: 'https://gridika.ru/privacy',
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.5',
  },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${URLS.map(
  (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
).join('\n')}
</urlset>
`;

const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapXml, 'utf-8');
console.log(`[sitemap] Successfully generated ${publicPath} with ${URLS.length} URLs`);

const distPath = path.join(rootDir, 'dist', 'sitemap.xml');
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  fs.writeFileSync(distPath, sitemapXml, 'utf-8');
  console.log(`[sitemap] Also wrote to ${distPath}`);
}
