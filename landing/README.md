# Mercado Patagónico · landing (Astro)

Landing de la **propuesta B · Aire**, elegida por la clienta. Es la puerta de entrada del prototipo: desde aquí el botón **Ingresar** lleva al login de la app (`../app`).

## Cómo levantarlo

Requiere Node.js 22 o superior.

```powershell
npm install
npm run dev
```

Abre http://localhost:4321. `npm run build` genera el sitio estático en `dist/`.

En la raíz del repositorio, `npm run build:all` construye la landing y la app juntas (landing en `/`, app en `/app/`).

## Qué trae

- Secciones, en orden: hero, problema, ruta de abastecimiento, propuesta de valor, para quién, cómo funciona, acompañamiento y canales, preguntas y contacto, más navbar y footer.
- Español e inglés, modo claro y oscuro (botones en el navbar y selector ES | EN en el footer; se recuerdan en el navegador), responsive.
- Animaciones suaves: aparición al hacer scroll, cajas flotando, rutas que fluyen, acordeón y un camión en el formulario de contacto que avanza con cada dato válido. Respeta `prefers-reduced-motion`.
- SEO: título y descripción, vista previa para redes (`public/og.png`), datos estructurados, `robots.txt` y `sitemap.xml`. La app (`/app/`) queda fuera del índice.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `PUBLIC_APP_URL` | A dónde lleva **Ingresar**. Por defecto `/app/login`; en desarrollo (`.env.development`) apunta a `http://localhost:5173/app/login`. |
| `SITE_URL` | Dominio público del sitio (canonical, `og:url`, sitemap). En Vercel se toma del dominio de producción si no se define. |

## Estructura

- `src/pages/index.astro` arma la página con `src/components/*`. También están `robots.txt.ts` y `sitemap.xml.ts`.
- `src/layouts/Layout.astro` cabecera HTML: SEO, tema e idioma antes de pintar.
- `src/data/content.json` y `i18n.json`: todos los textos ES/EN.
- `src/styles/tokens.css` colores (claro/oscuro) y `src/styles/landing.css` estilos. Los tokens se comparten con la app.
- `src/lib/art.js`, `scene.js`, `scene-login.js`, `svg.js`: gráficos SVG. La app reutiliza `art.js` y `scene-login.js` (el paisaje del login).
- `src/scripts/interact.js`: idioma, tema, menú, animaciones, acordeón y formulario.
- `src/legacy/` las cuatro propuestas anteriores (ya no se publican).

## Pendiente de definir

- El formulario de contacto solo valida en el navegador; no envía datos a ningún lado.
- Las fotos de hoteles y lodges son las de la presentación de la clienta (baja resolución); conviene pedir originales.
- El texto en inglés comparte la URL con el español, así que los buscadores solo indexan el español.
