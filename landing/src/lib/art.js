// Gráficos de la landing, tomados del plugin de Figma (DESIGN/figma-landing-final) para que coincidan con el diseño.
import { iconSVG, svgOpen, n1 } from './svg.js';

export const VICUNA_PTS = '25,2 26,-1 28,3 34,7 34,9.5 29,10.5 27,15 27,23 29,29 28,43 25,43 24,31 21,31 13,31 12,43 9,43 8,30 5,27 4,23 6,19 12,17 19,18 21,16 23,8 23,3';

export function logoIconSVG(w, dark) {
  const P = dark
    ? { navyL: '#2F86C0', navyR: '#4DA3D8', midL: '#3C93CC', midR: '#6BBBE0', hill: '#14899E', wave: '#2FC3C9', wave2: '#7FE0E3', vic: '#EAF1F4' }
    : { navyL: '#014776', navyR: '#186697', midL: '#186697', midR: '#3491BD', hill: '#026572', wave: '#0095A3', wave2: '#6BC2CA', vic: '#002544' };
  const h = Math.round(w * 112 / 236);
  const poly = (pts, fill, op) => '<polygon points="' + pts + '" fill="' + fill + '"' + (op ? ' fill-opacity="' + op + '"' : '') + '/>';
  return '<svg width="' + w + '" height="' + h + '" viewBox="34 0 236 112" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    poly('40,92 105,30 105,92', P.navyL) + poly('105,30 165,92 105,92', P.navyR) +
    poly('105,30 121,52 113,47 108,60 102,46 95,55 89,48', '#FFFFFF') +
    poly('108,92 150,50 190,6 190,92', P.midL) + poly('190,6 234,50 266,92 190,92', P.midR) +
    poly('190,6 212,36 203,31 198,45 190,32 183,46 178,31 168,38', '#FFFFFF') +
    poly('150,50 168,38 172,56 160,62', '#FFFFFF', '0.9') +
    '<path d="M168 100 C 190 82, 240 80, 270 96 C 240 104, 196 106, 168 100 Z" fill="' + P.hill + '"/>' +
    '<g transform="translate(206 42) scale(1.05)"><polygon points="' + VICUNA_PTS + '" fill="' + P.vic + '"/></g>' +
    '<path d="M36 110 C 80 88, 150 88, 270 102 C 150 98, 80 100, 36 110 Z" fill="' + P.wave + '"/>' +
    '<path d="M34 111 C 100 96, 190 96, 270 106" stroke="' + P.wave2 + '" stroke-width="2.5" stroke-linecap="round"/></svg>';
}

export function topoSVG(w, h, color, op) {
  let d = '';
  const n = 7;
  for (let i = 0; i < n; i++) {
    const y = h * (0.15 + i * 0.13), a = 18 + i * 6;
    d += 'M0 ' + n1(y) + ' C ' + n1(w * 0.2) + ' ' + n1(y - a) + ', ' + n1(w * 0.35) + ' ' + n1(y + a) + ', ' + n1(w * 0.55) + ' ' + n1(y) + ' S ' + n1(w * 0.85) + ' ' + n1(y - a) + ', ' + w + ' ' + n1(y + a * 0.5) + ' ';
  }
  return svgOpen(w, h) + '<path d="' + d + '" stroke="' + color + '" stroke-opacity="' + (op == null ? 0.12 : op) + '" stroke-width="1.5"/></svg>';
}

export function waveSVG(w, h) {
  return svgOpen(w, h) + '<path d="M0 ' + n1(h * 0.9) + ' Q ' + n1(w * 0.3) + ' ' + n1(h * 0.1) + ' ' + w + ' ' + n1(h * 0.55) + '" stroke="#0095A3" stroke-width="' + n1(Math.max(3, h * 0.1)) + '" stroke-linecap="round"/><path d="M0 ' + n1(h * 0.98) + ' Q ' + n1(w * 0.34) + ' ' + n1(h * 0.3) + ' ' + w + ' ' + n1(h * 0.7) + '" stroke="#6BC2CA" stroke-opacity="0.7" stroke-width="' + n1(Math.max(2, h * 0.05)) + '" stroke-linecap="round"/></svg>';
}

export function crystalSVG(w, h) {
  const poly = (pts, fill, op) => '<polygon points="' + pts.map((p) => n1(p[0] * w) + ',' + n1(p[1] * h)).join(' ') + '" fill="' + fill + '" fill-opacity="' + op + '"/>';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    poly([[0.02, 1], [0.34, 0.22], [0.66, 1]], '#186697', 0.7) + poly([[0.3, 1], [0.62, 0.02], [0.94, 1]], '#3491BD', 0.55) +
    poly([[0.62, 0.02], [0.94, 1], [0.62, 1]], '#89BFD9', 0.35) + poly([[0.6, 1], [0.8, 0.42], [0.98, 1]], '#0095A3', 0.6) + '</svg>';
}

export function crateClusterSVG(w) {
  const pt = (x, y) => n1(x) + ',' + n1(y);
  const cube = (cx, by, s, top, left, right, tape, icon) => {
    const dx = s * 0.866, dy = s * 0.5;
    const B0 = [cx, by], B1 = [cx, by - s], L1 = [cx - dx, by - s - dy], R1 = [cx + dx, by - s - dy], T1 = [cx, by - s - 2 * dy];
    const FL = [cx - dx, by - dy], FR = [cx + dx, by - dy];
    const q = (a) => a.map((p) => pt(p[0], p[1])).join(' ');
    const o = [-dx * 0.07, dy * 0.07];
    const p1 = [(T1[0] + L1[0]) / 2, (T1[1] + L1[1]) / 2], p2 = [(R1[0] + B1[0]) / 2, (R1[1] + B1[1]) / 2];
    const at = (u, v) => [cx + u * dx, by - s - u * dy + v * s];
    return '<g class="cube">' + '<polygon points="' + q([T1, R1, B1, L1]) + '" fill="' + top + '"/>' +
      '<polygon points="' + q([L1, B1, B0, FL]) + '" fill="' + left + '"/>' +
      '<polygon points="' + q([B1, R1, FR, B0]) + '" fill="' + right + '"/>' +
      '<polygon points="' + q([[p1[0] + o[0], p1[1] + o[1]], [p2[0] + o[0], p2[1] + o[1]], [p2[0] - o[0], p2[1] - o[1]], [p1[0] - o[0], p1[1] - o[1]]]) + '" fill="' + tape + '"/>' +
      (icon ? '<circle cx="' + n1(at(0.5, 0.52)[0]) + '" cy="' + n1(at(0.5, 0.52)[1]) + '" r="' + n1(s * 0.25) + '" fill="#FFFFFF" fill-opacity="0.95"/>' + pictoInner(icon, at(0.5, 0.52)[0], at(0.5, 0.52)[1], Math.round(s * 0.32), right) : '') + '</g>';
  };
  const body =
    cube(150, 292, 112, '#DFEDF4', '#3491BD', '#186697', '#0095A3', 'cutlery') +
    cube(292, 304, 82, '#D6EEF0', '#0095A3', '#026572', '#FFFFFF', 'cup') +
    cube(150, 292 - 112 - 56, 58, '#BADAE9', '#186697', '#014776', '#F26B21', 'cloche') +
    cube(48, 306, 42, '#DFEDF4', '#3491BD', '#186697', '#0095A3', 'snow');
  return '<svg width="' + w + '" height="' + Math.round(w * 340 / 420) + '" viewBox="-10 -4 420 340" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="200" cy="300" rx="205" ry="24" fill="#BADAE9" fill-opacity="0.9"/><ellipse cx="200" cy="302" rx="165" ry="13" fill="#001B31" fill-opacity="0.2"/>' + body + '</svg>';
}

export function crateSingleSVG(w) {
  const s = 60, dx = 51.96, dy = 30;
  const pt = (x, y) => n1(x) + ',' + n1(y);
  const T = [0, 0], Rr = [dx, dy], B = [0, 2 * dy], Ll = [-dx, dy];
  const at = (u, v) => [B[0] + u * dx, B[1] - u * dy + v * s];
  const o = [-dx * 0.07, dy * 0.07], p1 = [-dx / 2, dy / 2], p2 = [dx / 2, 1.5 * dy];
  const ln = (a, b) => 'M' + pt(a[0], a[1]) + ' L' + pt(b[0], b[1]);
  const body = '<polygon points="' + [T, Rr, B, Ll].map((p) => pt(p[0], p[1])).join(' ') + '" fill="#DFEDF4"/>' +
    '<polygon points="' + [Ll, B, [B[0], B[1] + s], [Ll[0], Ll[1] + s]].map((p) => pt(p[0], p[1])).join(' ') + '" fill="#3491BD"/>' +
    '<polygon points="' + [B, Rr, [Rr[0], Rr[1] + s], [B[0], B[1] + s]].map((p) => pt(p[0], p[1])).join(' ') + '" fill="#186697"/>' +
    '<polygon points="' + [[p1[0] + o[0], p1[1] + o[1]], [p2[0] + o[0], p2[1] + o[1]], [p2[0] - o[0], p2[1] - o[1]], [p1[0] - o[0], p1[1] - o[1]]].map((p) => pt(p[0], p[1])).join(' ') + '" fill="#0095A3"/>' +
    '<circle cx="' + n1(at(0.5, 0.52)[0]) + '" cy="' + n1(at(0.5, 0.52)[1]) + '" r="15" fill="#FFFFFF" fill-opacity="0.95"/>' + pictoInner('cutlery', at(0.5, 0.52)[0], at(0.5, 0.52)[1], 20, '#186697');
  return '<svg width="' + w + '" height="' + Math.round(w * 142 / 112) + '" viewBox="-56 -4 112 142" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="0" cy="128" rx="58" ry="9" fill="#001B31" fill-opacity="0.4"/>' + body + '</svg>';
}

export function pictoInner(kind, cx, cy, size, color) {
  return iconSVG(kind, size, color).replace(/^<svg[^>]*>/, '<svg x="' + n1(cx - size / 2) + '" y="' + n1(cy - size / 2) + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none">');
}

export function iconSVG2(kind, s, color) {
  const st = ' stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
  const p = {
    screen: '<rect x="3" y="4" width="18" height="12" rx="1.5"' + st + '/><path d="M8 20 H16 M12 16 V20"' + st + '/>',
    person: '<circle cx="12" cy="8" r="3.5"' + st + '/><path d="M5 20 C5 15.5 8 13.5 12 13.5 C16 13.5 19 15.5 19 20"' + st + '/>',
    doc: '<path d="M6 3 H14 L19 8 V21 H6 Z"' + st + '/><path d="M14 3 V8 H19 M9 13 H16 M9 17 H16"' + st + '/>'
  };
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' + p[kind] + '</svg>';
}

export function vicunaIconSVG(size, color) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 -6 38 54" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="' + VICUNA_PTS + '" fill="' + color + '"/></svg>';
}

export function ridgeSoftSVG(w, h, dark) {
  const c1 = dark ? '#0B3350' : '#D9E9F3', c2 = dark ? '#134566' : '#C2DCEB', c3 = dark ? '#1B5B83' : '#9CC6DD';
  const cap = (x, y, s) => '<path d="M ' + (x - s * 0.5) + ' ' + (y + s * 0.45) + ' L ' + x + ' ' + y + ' L ' + (x + s * 0.45) + ' ' + (y + s * 0.4) + ' L ' + (x + s * 0.2) + ' ' + (y + s * 0.3) + ' L ' + x + ' ' + (y + s * 0.55) + ' L ' + (x - s * 0.2) + ' ' + (y + s * 0.32) + ' Z" fill="#FFFFFF" fill-opacity="' + (dark ? 0.35 : 0.95) + '"/>';
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 600 200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill="' + c1 + '" d="M0 200 V120 L50 90 L100 112 L170 50 L225 96 L290 62 L350 112 L430 36 L500 92 L560 66 L600 96 V200 Z"/>' + cap(170, 50, 40) + cap(430, 36, 46) +
    '<path fill="' + c2 + '" d="M0 200 V150 L80 116 L140 140 L240 98 L320 146 L400 118 L480 152 L550 126 L600 148 V200 Z"/>' +
    '<path fill="' + c3 + '" d="M0 200 V178 L120 156 L230 176 L340 154 L460 178 L560 162 L600 172 V200 Z"/></svg>';
}
