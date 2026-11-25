// Escena del login: paisaje de Magallanes con un camión refrigerado en ruta.
// Mismo lenguaje que el logo (caras planas en dos tonos, sin bordes), pero distinta a la del hero.
import { VICUNA_PTS, pictoInner } from './art.js';

const poly = (pts, fill, extra = '') => '<polygon points="' + pts + '" fill="' + fill + '"' + extra + '/>';

export function loginSceneSVG(animar = true) {
  const camion =
    '<g transform="translate(0,350)">' +
    '<rect x="0" y="0" width="78" height="40" rx="4" fill="#FFFFFF"/>' +
    '<rect x="0" y="27" width="78" height="6" fill="#0095A3"/>' +
    pictoInner('snow', 39, 14, 20, '#186697') +
    poly('78,10 104,10 116,27 116,40 78,40', '#186697') +
    poly('90,14 102,14 109,25 90,25', '#DFEDF4') +
    '<circle cx="20" cy="42" r="9" fill="#002544"/><circle cx="20" cy="42" r="3.5" fill="#BADAE9"/>' +
    '<circle cx="98" cy="42" r="9" fill="#002544"/><circle cx="98" cy="42" r="3.5" fill="#BADAE9"/>' +
    '</g>';
  const conduce = animar
    ? '<g><animateTransform attributeName="transform" type="translate" from="-420 0" to="880 0" dur="24s" repeatCount="indefinite"/>' + camion + '</g>'
    : '<g transform="translate(210,0)">' + camion + '</g>';

  return '<svg class="scene" viewBox="-40 0 640 480" preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="438" cy="112" r="34" fill="#F26B21" fill-opacity="0.95"/>' +
    poly('26,330 146,150 146,330', '#A9D0E3') + poly('146,150 266,330 146,330', '#BADAE9') + poly('146,150 160,171 152,166 146,178 139,165 131,172', '#FFFFFF') +
    poly('170,330 330,90 330,330', '#186697') + poly('330,90 500,330 330,330', '#3491BD') + poly('330,90 364,138 349,129 330,150 312,127 298,138', '#FFFFFF') +
    poly('390,330 470,168 470,330', '#014776') + poly('470,168 560,330 470,330', '#186697') + poly('470,168 488,200 478,193 470,206 461,192 452,200', '#FFFFFF') +
    '<path d="M-300 340 C-100 310 120 296 300 306 S560 328 860 336 L860 490 L-300 490Z" fill="#0095A3"/>' +
    '<path d="M-300 362 C-100 345 200 336 400 346 S700 356 860 366 L860 490 L-300 490Z" fill="#026572"/>' +
    '<g transform="translate(72,276) scale(1.5)"><polygon points="' + VICUNA_PTS + '" fill="#002544"/></g>' +
    '<path d="M-300 398 C-100 386 360 380 860 402 L860 426 C360 408 -100 408 -300 426Z" fill="#3B5873"/>' +
    '<path d="M-300 412 C-100 398 360 394 860 414" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="9 11" stroke-linecap="round"/>' +
    conduce + '</svg>';
}
