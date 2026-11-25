import type { APIRoute } from 'astro';
import { LANGS, RUTA } from '../lib/i18n.js';

// Las dos versiones públicas de la landing, cada una con sus alternativas de idioma.
// Sin dominio configurado no hay URL absoluta que publicar.
export const GET: APIRoute = ({ site }) => {
  const abs = (l: string) => new URL(RUTA[l as keyof typeof RUTA], site!).href;
  const alternos = site ? LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${abs(l)}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${abs('es')}"/>` : '';
  const urls = site ? LANGS.map((l) => `<url><loc>${abs(l)}</loc>${alternos}</url>`).join('') : '';
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>\n',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
