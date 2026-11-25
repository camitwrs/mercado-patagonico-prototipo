# Mercado Patagónico · Prototipo

Prototipo navegable de la plataforma de abastecimiento hotelero y gastronómico para Magallanes.
**No es la aplicación real**: sirve para presentar el recorrido completo y validar diseño y flujo.

Recorrido: **landing** → "Ingresar" → **login** → **Marketplace** (portada, catálogo, ficha, carrito, confirmar solicitud).

## Contenido

| Carpeta | Qué es |
|---|---|
| `landing/` | Sitio de presentación en Astro (español/inglés, modo claro/oscuro). |
| `app/` | Prototipo de la plataforma en React + TypeScript + Tailwind (solo Marketplace). |
| `scripts/` | Construcción conjunta del sitio para publicar. |

El material de trabajo (tokens y plugins de diseño, propuestas, maqueta) se mantiene fuera del repositorio. Los tokens de color que usa el sitio ya están generados en `landing/src/styles/tokens.css`.

Se publica como un solo sitio: la landing en `/` y la app en `/app/`.

## Probarlo

Usuario de demostración: `msoto` / `prototipo` (cualquier usuario ingresa).

## Desarrollo

Requiere Node.js 22 o superior.

```bash
npm run install:all   # instala landing y app
npm run dev:landing   # http://localhost:4321
npm run dev:app       # http://localhost:5173/app/
npm run build:all     # genera dist/ (landing + app)
```

## Datos del prototipo

- Sin servidor: la sesión y el carrito se guardan en el navegador (`localStorage`).
- Los productos son datos de ejemplo extraídos de la maqueta; no son un catálogo real.
- Las secciones del menú marcadas "Pronto" aún no existen.

## Publicación (Vercel)

La configuración está en `vercel.json`. Variables opcionales:

| Variable | Para qué |
|---|---|
| `SITE_URL` | Dominio público de la landing (canonical, sitemap, vista previa al compartir). |
| `PUBLIC_APP_URL` | A dónde lleva "Ingresar"; por defecto `/app/login`. |
| `VITE_LANDING_URL` | A dónde vuelve el login; por defecto `/`. |

---

Desarrollado por Latitud53.
