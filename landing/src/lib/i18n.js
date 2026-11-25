// Idiomas de la landing: una URL por idioma ("/" en español, "/en/" en inglés).
export const LANGS = ['es', 'en'];
export const RUTA = { es: '/', en: '/en/' };
export const otro = (lang) => (lang === 'es' ? 'en' : 'es');

export const META = {
  es: {
    title: 'Mercado Patagónico · Abastecimiento hotelero y gastronómico',
    description: 'Plataforma de abastecimiento hotelero y gastronómico para Magallanes: un solo operador, múltiples proveedores, una solución integral.',
    locale: 'es_CL',
    area: 'Región de Magallanes, Chile',
    ogAlt: 'Mercado Patagónico: abastecimiento hotelero y gastronómico para Magallanes',
  },
  en: {
    title: 'Mercado Patagónico · Hotel and food-service supply',
    description: 'Hotel and food-service supply platform for Magallanes: one operator, multiple suppliers, one complete solution.',
    locale: 'en_US',
    area: 'Magallanes Region, Chile',
    ogAlt: 'Mercado Patagónico: hotel and food-service supply for Magallanes',
  },
};

// Textos de interfaz que no viven en content.json (etiquetas accesibles).
export const UI = {
  es: { skip: 'Saltar al contenido', idioma: 'Idioma', cambiarA: 'English', tema: 'Modo claro / oscuro', menu: 'Menú', principal: 'Principal', pie: 'Pie de página' },
  en: { skip: 'Skip to content', idioma: 'Language', cambiarA: 'Español', tema: 'Light / dark mode', menu: 'Menu', principal: 'Main', pie: 'Footer' },
};
