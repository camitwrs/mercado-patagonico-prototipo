// @ts-check
import { defineConfig } from 'astro/config';

// URL pública del sitio (canonical, og:url, sitemap). En Vercel se toma del dominio de producción; también se puede fijar con SITE_URL.
const site = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined);

export default defineConfig({
  site,
  server: { port: 4321 },
});
