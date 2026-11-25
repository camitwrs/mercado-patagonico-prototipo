import type { APIRoute } from 'astro';

// La landing se indexa; la app (login y marketplace) no.
export const GET: APIRoute = ({ site }) => new Response(
  ['User-agent: *', 'Allow: /', 'Disallow: /app/', ...(site ? ['', 'Sitemap: ' + new URL('/sitemap.xml', site).href] : [])].join('\n') + '\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
