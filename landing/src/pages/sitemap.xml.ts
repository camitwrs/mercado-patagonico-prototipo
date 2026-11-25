import type { APIRoute } from 'astro';

// Una sola página pública: la landing. Sin dominio configurado no hay URL absoluta que publicar.
export const GET: APIRoute = ({ site }) => new Response(
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + (site ? '<url><loc>' + site.href + '</loc></url>' : '') + '</urlset>\n',
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
