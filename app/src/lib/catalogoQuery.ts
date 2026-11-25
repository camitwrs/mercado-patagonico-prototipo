import { FAMILIAS, PRODUCTOS, origenDe } from '../data/catalogo';
import type { Producto } from '../data/types';

// Filtros del catálogo: todo vive en la URL (compartible), igual que la maqueta (`leerParams` / `escribirParams`).

export const FACETAS = ['seg', 'temp', 'origen', 'cli', 'marca', 'uv'] as const;
export type Faceta = (typeof FACETAS)[number];

export type ParamsCatalogo = {
  q: string; fam: string; cat: string; sub: string;
  seg: string[]; temp: string[]; origen: string[]; cli: string[]; marca: string[]; uv: string[];
  vista: 'grilla' | 'lista';
  pag: number; tam: number;
};

export const ETIQUETA_FACETA: Record<Faceta, string> = { seg: 'Área de uso', temp: 'Temperatura', origen: 'Origen', cli: 'Cliente', marca: 'Marca', uv: 'Unidad' };
export const TAMANOS = [12, 24, 48, 96] as const;

export const sinFacetas = { seg: [], temp: [], origen: [], cli: [], marca: [], uv: [] } as Pick<ParamsCatalogo, Faceta>;

const lista = (v: string | null) => (v || '').split('|').filter(Boolean);

export const leerParams = (q: URLSearchParams): ParamsCatalogo => {
  const tam = Number(q.get('tam'));
  return {
    q: (q.get('q') || '').trim(), fam: q.get('fam') || '', cat: q.get('cat') || '', sub: q.get('sub') || '',
    seg: lista(q.get('seg')), temp: lista(q.get('temp')), origen: lista(q.get('origen')), cli: lista(q.get('cli')), marca: lista(q.get('marca')), uv: lista(q.get('uv')),
    vista: q.get('vista') === 'lista' ? 'lista' : 'grilla',
    pag: Math.max(1, Math.round(Number(q.get('pag'))) || 1),
    tam: (TAMANOS as readonly number[]).includes(tam) ? tam : 24,
  };
};

// Escribe los filtros como query string. Cambiar un filtro vuelve a la página 1.
export const escribirParams = (p: ParamsCatalogo): string => {
  const q = new URLSearchParams();
  (['q', 'fam', 'cat', 'sub'] as const).forEach((k) => { if (p[k]) q.set(k, p[k]); });
  FACETAS.forEach((k) => { if (p[k].length) q.set(k, p[k].join('|')); });
  if (p.vista === 'lista') q.set('vista', 'lista');
  if (p.tam !== 24) q.set('tam', String(p.tam));
  if (p.pag > 1) q.set('pag', String(p.pag));
  return q.toString();
};

// La búsqueda ignora mayúsculas y tildes ("sabana" encuentra "sábana"); la maqueta solo ignoraba mayúsculas.
const normalizar = (v: unknown) => String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const coincideTexto = (p: Producto, q: string): boolean => {
  if (!q) return true;
  const t = normalizar(q);
  return [p.sku, p.nombre, p.desc, p.marca, p.cat, p.sub].some((x) => normalizar(x).includes(t));
};

export const baseFiltrada = (p: ParamsCatalogo): Producto[] =>
  PRODUCTOS.filter((x) => (!p.fam || x.fam === p.fam) && (!p.cat || x.cat === p.cat) && (!p.sub || x.sub === p.sub) && coincideTexto(x, p.q));

// `salvo` excluye una faceta, para que sus propias opciones sigan mostrando conteos.
export const pasaFacetas = (x: Producto, p: ParamsCatalogo, salvo?: Faceta): boolean =>
  (salvo === 'seg' || !p.seg.length || x.seg.some((s) => p.seg.includes(s))) &&
  (salvo === 'temp' || !p.temp.length || p.temp.includes(x.temp)) &&
  (salvo === 'marca' || !p.marca.length || p.marca.includes(x.marca)) &&
  (salvo === 'uv' || !p.uv.length || p.uv.includes(x.uv)) &&
  (salvo === 'origen' || !p.origen.length || p.origen.includes(origenDe(x))) &&
  (salvo === 'cli' || !p.cli.length || (x.clienteObj ?? []).some((c) => p.cli.includes(c)));

export const contar = (items: Producto[], fn: (x: Producto) => string | string[]): [string, number][] => {
  const m = new Map<string, number>();
  items.forEach((x) => ([] as string[]).concat(fn(x)).forEach((v) => { if (v) m.set(v, (m.get(v) || 0) + 1); }));
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
};

export type Facetas = { faceta: Faceta; titulo: string; sub: string; valores: [string, number][] }[];

export const calcularFacetas = (p: ParamsCatalogo): Facetas => {
  const base = baseFiltrada(p);
  const de = (f: Faceta, fn: (x: Producto) => string | string[]) => contar(base.filter((x) => pasaFacetas(x, p, f)), fn);
  return [
    { faceta: 'seg', titulo: 'Área de uso', sub: 'Segmento de uso', valores: de('seg', (x) => x.seg) },
    { faceta: 'temp', titulo: 'Condición de temperatura', sub: 'Cadena de frío', valores: de('temp', (x) => x.temp) },
    { faceta: 'origen', titulo: 'Origen', sub: 'País y región de origen', valores: de('origen', origenDe) },
    { faceta: 'cli', titulo: 'Tipo de cliente', sub: 'Cliente objetivo', valores: de('cli', (x) => x.clienteObj ?? []) },
    { faceta: 'marca', titulo: 'Marca', sub: 'Marca comercial', valores: de('marca', (x) => (x.marca === 'No aplica' ? '' : x.marca)).slice(0, 10) },
    { faceta: 'uv', titulo: 'Unidad de venta', sub: 'Cómo se vende', valores: de('uv', (x) => x.uv) },
  ].filter((g) => g.valores.length) as Facetas;
};

export type ArbolFamilia = { codigo: string; nombre: string; icono: string; cantidad: number; cats: { nombre: string; cantidad: number; subs: { nombre: string; cantidad: number }[] }[] };

export const arbol = (): ArbolFamilia[] => FAMILIAS.map((f) => {
  const prods = PRODUCTOS.filter((p) => p.fam === f.codigo);
  const cats = [...new Set(prods.map((p) => p.cat))].map((c) => {
    const delaCat = prods.filter((p) => p.cat === c);
    return { nombre: c, cantidad: delaCat.length, subs: [...new Set(delaCat.map((p) => p.sub))].map((s) => ({ nombre: s, cantidad: delaCat.filter((p) => p.sub === s).length })) };
  });
  return { ...f, cantidad: prods.length, cats };
});
