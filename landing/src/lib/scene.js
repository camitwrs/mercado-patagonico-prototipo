// Escena isométrica del hero: cajas de abastecimiento → camino → alojamiento en Magallanes.
// Mismo lenguaje que las cajas: caras planas, sin bordes, sin sombras difusas.
import { pictoInner } from './art.js';

const n1 = (v) => Math.round(v * 10) / 10;
const pt = (p) => n1(p[0]) + ',' + n1(p[1]);
const poly = (pts, fill, extra = '') => '<polygon points="' + pts.map(pt).join(' ') + '" fill="' + fill + '"' + extra + '/>';

// Cubo isométrico. (cx, by) = vértice inferior frontal.
function isoCube(cx, by, s, c, icon, attrs = '') {
  const dx = s * 0.866, dy = s * 0.5;
  const B0 = [cx, by], B1 = [cx, by - s], L1 = [cx - dx, by - s - dy], R1 = [cx + dx, by - s - dy], T1 = [cx, by - s - 2 * dy];
  const FL = [cx - dx, by - dy], FR = [cx + dx, by - dy];
  const o = [-dx * 0.07, dy * 0.07];
  const p1 = [(T1[0] + L1[0]) / 2, (T1[1] + L1[1]) / 2], p2 = [(R1[0] + B1[0]) / 2, (R1[1] + B1[1]) / 2];
  const at = (u, v) => [cx + u * dx, by - s - u * dy + v * s];
  const ic = at(0.5, 0.52);
  return '<g ' + attrs + '>' +
    poly([T1, R1, B1, L1], c[0]) + poly([L1, B1, B0, FL], c[1]) + poly([B1, R1, FR, B0], c[2]) +
    poly([[p1[0] + o[0], p1[1] + o[1]], [p2[0] + o[0], p2[1] + o[1]], [p2[0] - o[0], p2[1] - o[1]], [p1[0] - o[0], p1[1] - o[1]]], c[3]) +
    (icon ? '<circle cx="' + n1(ic[0]) + '" cy="' + n1(ic[1]) + '" r="' + n1(s * 0.25) + '" fill="#FFFFFF" fill-opacity="0.95"/>' + pictoInner(icon, ic[0], ic[1], Math.round(s * 0.32), c[2]) : '') +
    '</g>';
}

export function heroSceneSVG() {
  const C = {
    big: ['#DFEDF4', '#3491BD', '#186697', '#0095A3'],
    teal: ['#D6EEF0', '#0095A3', '#026572', '#FFFFFF'],
    top: ['#BADAE9', '#186697', '#014776', '#F26B21'],
    tiny: ['#DFEDF4', '#3491BD', '#186697', '#0095A3'],
  };
  const dx = 0.866, dy = 0.5;
  // Camino sobre el plano del suelo, en la dirección isométrica (arriba-derecha).
  const B = [424.7, 252.5];
  const A = [B[0] - 150 * dx, B[1] + 150 * dy];
  const p = [dx * 13, dy * 13];
  const road = poly([[A[0] - p[0], A[1] - p[1]], [B[0] - p[0], B[1] - p[1]], [B[0] + p[0], B[1] + p[1]], [A[0] + p[0], A[1] + p[1]]], '#A9D0E3');
  const path = 'M' + pt(A) + ' L' + pt(B);

  // Alojamiento (destino): cubo con techo a dos aguas.
  const hx = 455, hy = 270, hs = 70, hdx = hs * dx, hdy = hs * dy;
  const B0 = [hx, hy], B1 = [hx, hy - hs], L1 = [hx - hdx, hy - hs - hdy], R1 = [hx + hdx, hy - hs - hdy], T1 = [hx, hy - hs - 2 * hdy];
  const FL = [hx - hdx, hy - hdy], FR = [hx + hdx, hy - hdy];
  const rh = 34;
  const mLT = [(L1[0] + T1[0]) / 2, (L1[1] + T1[1]) / 2 - rh], mBR = [(B1[0] + R1[0]) / 2, (B1[1] + R1[1]) / 2 - rh];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const d1 = lerp(FL, B0, 0.35), d2 = lerp(FL, B0, 0.65), up = [0, -hs * 0.55];
  const door = poly([d1, d2, [d2[0], d2[1] + up[1]], [d1[0], d1[1] + up[1]]], '#F26B21');
  const wa = (u, v) => [B1[0] + u * (R1[0] - B1[0]) + v * (B0[0] - B1[0]), B1[1] + u * (R1[1] - B1[1]) + v * (B0[1] - B1[1])];
  const win = poly([wa(0.28, 0.3), wa(0.72, 0.3), wa(0.72, 0.62), wa(0.28, 0.62)], '#FFFFFF', ' fill-opacity="0.9"');
  const house = '<g class="bld">' +
    poly([L1, B1, B0, FL], '#E8F3F8') + poly([B1, R1, FR, B0], '#BADAE9') + door + win +
    poly([T1, R1, mBR, mLT], '#3491BD') + poly([L1, B1, mBR, mLT], '#186697') + poly([R1, B1, mBR], '#BADAE9') +
    '<g class="pin"><path d="M455 100 L445.9 80.2 A10 10 0 1 1 464.1 80.2 Z" fill="#F26B21"/><path d="M455 66 A10 10 0 0 1 464.1 80.2 L455 100 Z" fill="#C94E12"/><circle cx="455" cy="76" r="3.8" fill="#fff"/></g></g>';

  // Caja mensajera que recorre el camino sola.
  const sc = (col, extra) => isoCube(0, 13, 26, col, null, extra);
  const auto = '<g class="courier auto" opacity="0">' + sc(C.top, '') +
    '<animateMotion dur="5s" begin="1s" repeatCount="indefinite" path="' + path + '" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/>' +
    '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="5s" begin="1s" repeatCount="indefinite"/></g>';
  const tpl = '<g data-tpl="" data-path="' + path + '" style="display:none">' + sc(C.top, '') + '</g>';

  const stack = '<g transform="translate(0,108) scale(0.8)">' +
    isoCube(150, 292, 112, C.big, 'cutlery', 'class="cube" data-c="' + C.big.join(',') + '" tabindex="0" role="button"') +
    isoCube(292, 304, 82, C.teal, 'cup', 'class="cube" data-c="' + C.teal.join(',') + '" tabindex="0" role="button"') +
    isoCube(150, 124, 58, C.top, 'cloche', 'class="cube" data-c="' + C.top.join(',') + '" tabindex="0" role="button"') +
    isoCube(48, 306, 42, C.tiny, 'snow', 'class="cube" data-c="' + C.tiny.join(',') + '" tabindex="0" role="button"') +
    '</g>';

  return '<svg class="scene" viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="290" cy="318" rx="270" ry="86" fill="#BADAE9" fill-opacity="0.55"/>' +
    '<ellipse cx="142" cy="338" rx="142" ry="30" fill="#BADAE9" fill-opacity="0.9"/><ellipse cx="142" cy="343" rx="116" ry="15" fill="#001B31" fill-opacity="0.2"/>' +
    road + '<path class="road-dash" d="' + path + '" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="7 9" stroke-linecap="round"/>' +
    auto + tpl + house + stack + '</svg>';
}
