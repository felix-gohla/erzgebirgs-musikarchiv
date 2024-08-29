import { SitemapStream,  } from 'sitemap'
import { Readable } from 'node:stream'
import { resolve } from 'node:path'
import { createWriteStream, writeFileSync } from 'node:fs'

const links = [
    { url: '/songs/', changefreq: 'weekly', priority: 0.7 },
    { url: '/authors/', changefreq: 'monthly', priority: 0.5 },
    { url: '/genres/', changefreq: 'monthly', priority: 0.2 }
]

// Write the sitemap.
const baseUrl = process.env['VITE_FRONTEND_BASE'] ?? 'https://erzgebirgs-musikarchiv.de' 
const stream = new SitemapStream({ hostname: baseUrl })
Readable.from(links).pipe(stream).pipe(createWriteStream(resolve(import.meta.dirname, '..', 'public', 'sitemap.xml')))

const sitemapUrl = new URL('sitemap.xml', baseUrl)
const robotsTxt = `
User-agent: *
Disallow: 
Crawl-delay: 20
Sitemap: ${sitemapUrl.toString()}
`;
writeFileSync(resolve(import.meta.dirname, '..', 'public', 'robots.txt'), robotsTxt)