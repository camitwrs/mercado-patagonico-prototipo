import raw from './maqueta.json';
import type { DatosMaqueta, Establecimiento, Familia, Producto } from './types';

// Capa de acceso a datos. Hoy lee el JSON de ejemplo; en el producto real se reemplaza por la API
// sin tocar las pantallas.
const datos = raw as unknown as DatosMaqueta;

export const EMPRESA = datos.empresa;
export const VENDEDOR = datos.vendedor;
export const ESTABLECIMIENTOS = datos.establecimientos;
export const FAMILIAS = datos.familias;
export const SEGMENTOS = datos.segmentos;
export const TIPOS_FACTURA = datos.tiposFactura;
export const CENTROS_COSTO = datos.centrosCosto;
export const PRODUCTOS = datos.productos;
export const HOY_ISO = datos.hoyIso;

const porSku = new Map<string, Producto>(PRODUCTOS.map((p) => [p.sku, p]));
export const producto = (sku: string): Producto | undefined => porSku.get(sku);
export const familia = (codigo: string): Familia | undefined => FAMILIAS.find((f) => f.codigo === codigo);
export const establecimiento = (id: string): Establecimiento | undefined => ESTABLECIMIENTOS.find((e) => e.id === id);

export const origenDe = (p: Producto) => (p.region === 'Magallanes' ? 'Regional · Magallanes' : p.origen === 'Chile' ? 'Nacional' : 'Importado');
export const esFrio = (p: Producto) => p.temp === 'Refrigerado' || p.temp === 'Congelado';
export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

// Fechas: el prototipo vive "hoy" = HOY_ISO (como la maqueta), para que las demos sean reproducibles.
export const sumarDias = (dias: number, desde = HOY_ISO): string => {
  const d = new Date(`${desde}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};
export const fechaLarga = (iso = HOY_ISO) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fechaCorta = (iso: string) => {
  const [a, m, d] = iso.split('-');
  return `${d}-${m}-${a}`;
};

// Estado de la fecha requerida de una línea (texto y tono), igual que la maqueta.
export type TonoFecha = 'aviso' | 'gris' | 'azul' | 'verde' | 'rojo';
export const estadoFecha = (fecha: string, cabecera = ''): [string, TonoFecha] => {
  if (!fecha) return cabecera ? [`Hereda ${fechaCorta(cabecera)} de cabecera`, 'gris'] : ['Sin fecha', 'aviso'];
  const dias = Math.round((new Date(fecha).getTime() - new Date(HOY_ISO).getTime()) / 86400000);
  if (dias < 0) return ['Fecha pasada', 'rojo'];
  if (dias === 0) return ['Hoy', 'azul'];
  if (dias === 1) return ['Mañana', 'azul'];
  return [`En ${dias} días`, 'verde'];
};
