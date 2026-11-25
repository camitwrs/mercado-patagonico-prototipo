import type { IconType } from 'react-icons';
import { LuBuilding2, LuCalendarClock, LuClipboardList, LuFileCheck, LuHeadset, LuHouse, LuLayoutGrid, LuPackageCheck, LuRoute, LuShoppingCart, LuTriangleAlert, LuUsers } from 'react-icons/lu';

// Menú de la plataforma como datos: lo que hoy funciona y lo que viene, ordenado según el recorrido
// del negocio que cuenta la landing (comprar → pedir → recibir → acompañamiento).
// Cuando una sección se construye, se le agrega `path` y se quita `proximamente`.
export type ItemMenu = { id: string; label: string; icono: IconType; path?: string; fin?: boolean; proximamente?: boolean; detalle?: string };
export type GrupoMenu = { grupo: string; items: ItemMenu[] };

export const MENU: GrupoMenu[] = [
  {
    grupo: 'Comprar',
    items: [
      { id: 'inicio', label: 'Inicio', icono: LuHouse, path: '/marketplace', fin: true },
      { id: 'catalogo', label: 'Catálogo', icono: LuLayoutGrid, path: '/marketplace/catalogo' },
      { id: 'carrito', label: 'Carrito', icono: LuShoppingCart, path: '/marketplace/carrito' },
    ],
  },
  {
    grupo: 'Pedir',
    items: [
      { id: 'solicitudes', label: 'Solicitudes de pedido', icono: LuClipboardList, proximamente: true, detalle: 'Tus solicitudes y el estado de cada una.' },
      { id: 'ordenes', label: 'Órdenes de compra', icono: LuFileCheck, proximamente: true, detalle: 'Órdenes de compra y su seguimiento.' },
      { id: 'programado', label: 'Abastecimiento programado', icono: LuCalendarClock, proximamente: true, detalle: 'Define tus frecuencias de entrega.' },
    ],
  },
  {
    grupo: 'Recibir',
    items: [
      { id: 'seguimiento', label: 'Seguimiento de pedidos', icono: LuRoute, proximamente: true, detalle: 'Sigue el estado de cada pedido, de punta a punta.' },
      { id: 'entregas', label: 'Entregas y recepción', icono: LuPackageCheck, proximamente: true, detalle: 'Cadena de frío y entrega hasta la última milla.' },
      { id: 'posventa', label: 'Incidentes y posventa', icono: LuTriangleAlert, proximamente: true, detalle: 'Soporte después de cada entrega.' },
    ],
  },
  {
    grupo: 'Tu cuenta',
    items: [
      { id: 'ejecutivo', label: 'Ejecutivo de cuenta', icono: LuHeadset, proximamente: true, detalle: 'Un interlocutor para tu operación.' },
      { id: 'establecimientos', label: 'Establecimientos', icono: LuBuilding2, proximamente: true, detalle: 'Tus establecimientos y sus horarios de recepción.' },
      { id: 'usuarios', label: 'Usuarios', icono: LuUsers, proximamente: true, detalle: 'Quién puede pedir en tu empresa.' },
    ],
  },
];
