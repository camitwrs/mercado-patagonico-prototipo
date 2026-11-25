# Mercado Patagónico · landing (Astro)

Landing de la **propuesta B · Aire**, elegida por la clienta. El diseño de referencia está en Figma (`../DESIGN/figma-landing-final`) y el sistema de diseño en `../DESIGN/DESIGN-SYSTEM.md`.

## Cómo levantarlo

```powershell
npm install
npm run dev
```

Abre http://localhost:4321. `npm run build` genera el sitio estático en `dist/`.

## Qué trae

- Secciones: hero, ruta de abastecimiento, propuesta de valor, para quién, acompañamiento y canales, cómo funciona, preguntas, contacto y footer.
- Español e inglés, modo claro y oscuro (botones en el navbar; se recuerdan en el navegador), responsive.
- Animaciones suaves: aparición al hacer scroll, cajas flotando, rutas que fluyen, código de barras con escaneo, acordeón, validación del formulario. Respeta `prefers-reduced-motion`.

## Estructura

- `src/pages/index.astro` arma la página con `src/components/*` (Nav, Hero, Route, Value, Segments, Support, Steps, Faq, Contact, Footer).
- `src/data/content.json` todos los textos ES/EN (salen del plugin de Figma: `DESIGN/figma-landing-final/src/10-content.js`).
- `src/styles/tokens.css` colores (generado desde `DESIGN/tokens/tokens.json`) y `src/styles/landing.css` estilos.
- `src/lib/art.js` gráficos SVG tomados del plugin de Figma; `src/lib/svg.js` íconos.
- `src/legacy/` las cuatro propuestas anteriores (ya no se publican). Siguen en el historial de git.

## Pendiente de definir

- El botón **Ingresar** muestra un aviso: falta la URL de la plataforma.
- El formulario solo valida en el navegador; no envía datos a ningún lado.
- Las fotos de hoteles y lodges son las de la presentación de la clienta (baja resolución); conviene pedir originales.
