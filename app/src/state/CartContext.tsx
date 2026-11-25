import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { EMPRESA, establecimiento, esFrio, producto } from '../data/catalogo';
import type { FormConfirmar, LineaCarrito, Solicitud } from '../data/types';

// Estado del carrito y de la solicitud en curso. Reemplaza al objeto `estado` de la maqueta
// (carrito, cantidades, confirmar, intentoEnvio, confirmado, solicitudesCreadas, correlativo).

type Estado = {
  carrito: LineaCarrito[];
  cantidades: Record<string, number>; // cantidad elegida en cada tarjeta antes de agregar
  form: FormConfirmar;
  intentoEnvio: boolean;
  confirmado: Solicitud | null;
  solicitudes: Solicitud[];
  correlativo: number;
  pulso: number; // sube cada vez que se agrega algo: anima el contador del carrito
};

const formVacio = (): FormConfirmar => ({ est: '', fecha: '', factura: '', solicitante: EMPRESA.usuario, moneda: 'CLP', centro: '', ref: '', fechaRef: '', consid: '' });
const inicial = (): Estado => ({ carrito: [], cantidades: {}, form: formVacio(), intentoEnvio: false, confirmado: null, solicitudes: [], correlativo: 1043, pulso: 0 });

type Accion =
  | { t: 'agregar'; sku: string; cant: number }
  | { t: 'cantTarjeta'; sku: string; cant: number }
  | { t: 'cantLinea'; id: string; cant: number }
  | { t: 'fechaLinea'; id: string; fecha: string }
  | { t: 'fechaTodas'; fecha: string }
  | { t: 'marcaLinea'; id: string; marca: string }
  | { t: 'quitar'; id: string }
  | { t: 'vaciar' }
  | { t: 'campo'; campo: keyof FormConfirmar; valor: string }
  | { t: 'enviar' }
  | { t: 'cerrarConfirmado' }
  | { t: 'reiniciar'; estado: Estado };

// Cantidades: entero entre 1 y 99999, como la maqueta.
export const normalizarCantidad = (v: number | string): number => Math.max(1, Math.min(99999, Math.round(Number(String(v).replace(',', '.')) || 1)));
const nuevoId = () => `L${Date.now()}${Math.random().toString(16).slice(2, 6)}`;

function reducir(s: Estado, a: Accion): Estado {
  switch (a.t) {
    case 'agregar': {
      const existente = s.carrito.find((l) => l.sku === a.sku && !l.fecha);
      const carrito = existente
        ? s.carrito.map((l) => (l === existente ? { ...l, cant: l.cant + a.cant } : l))
        : [...s.carrito, { id: nuevoId(), sku: a.sku, cant: a.cant, fecha: '', marca: '' }];
      return { ...s, carrito, cantidades: { ...s.cantidades, [a.sku]: 1 }, pulso: s.pulso + 1 };
    }
    case 'cantTarjeta': return { ...s, cantidades: { ...s.cantidades, [a.sku]: normalizarCantidad(a.cant) } };
    case 'cantLinea': return { ...s, carrito: s.carrito.map((l) => (l.id === a.id ? { ...l, cant: normalizarCantidad(a.cant) } : l)) };
    case 'fechaLinea': return { ...s, carrito: s.carrito.map((l) => (l.id === a.id ? { ...l, fecha: a.fecha } : l)) };
    case 'marcaLinea': return { ...s, carrito: s.carrito.map((l) => (l.id === a.id ? { ...l, marca: a.marca } : l)) };
    case 'fechaTodas': return a.fecha ? { ...s, carrito: s.carrito.map((l) => ({ ...l, fecha: a.fecha })) } : s;
    case 'quitar': return { ...s, carrito: s.carrito.filter((l) => l.id !== a.id) };
    case 'vaciar': return { ...s, carrito: [] };
    case 'campo': {
      const form = { ...s.form, [a.campo]: a.valor };
      if (a.campo === 'est') {
        // Igual que la maqueta: al elegir establecimiento se sugieren consideraciones y centro de costo.
        const est = establecimiento(a.valor);
        if (est && !form.consid) form.consid = `Recepción ${est.recepcion}. Recibe ${est.jefe}.`;
        if (est && !form.centro) form.centro = est.tipo === 'Restaurante' ? 'Restaurante y bar' : 'Cocina';
      }
      return { ...s, form };
    }
    case 'enviar': {
      const f = s.form;
      if (!f.est || !f.fecha || !f.factura || !f.solicitante.trim()) return { ...s, intentoEnvio: true };
      const sol: Solicitud = { codigo: `SP-0${s.correlativo}`, ...f, lineas: s.carrito.map((l) => ({ ...l })), creada: new Date().toISOString() };
      return { ...s, solicitudes: [sol, ...s.solicitudes], confirmado: sol, carrito: [], form: formVacio(), intentoEnvio: false, correlativo: s.correlativo + 1 };
    }
    case 'cerrarConfirmado': return { ...s, confirmado: null };
    case 'reiniciar': return a.estado;
  }
}

export type Resumen = { nLineas: number; nUnidades: number; nCategorias: number; sinFecha: number; frio: number };

type Ctx = {
  estado: Estado;
  resumen: Resumen;
  cantidadEnCarrito: (sku: string) => number;
  agregar: (sku: string, cant?: number) => void;
  setCantTarjeta: (sku: string, cant: number) => void;
  setCantLinea: (id: string, cant: number) => void;
  setFechaLinea: (id: string, fecha: string) => void;
  setFechaTodas: (fecha: string) => void;
  setMarcaLinea: (id: string, marca: string) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  setCampo: (campo: keyof FormConfirmar, valor: string) => void;
  enviarSolicitud: () => boolean;
  cerrarConfirmado: () => void;
};
const CartCtx = createContext<Ctx | null>(null);

const KEY = 'mp-cart-v1';
const cargar = (): Estado => {
  try {
    const v = localStorage.getItem(KEY);
    if (!v) return inicial();
    const s = JSON.parse(v) as Estado;
    // Solo se conserva lo que el usuario construyó; lo transitorio se reinicia.
    return { ...inicial(), carrito: s.carrito ?? [], form: { ...formVacio(), ...(s.form ?? {}) }, solicitudes: s.solicitudes ?? [], correlativo: s.correlativo ?? 1043 };
  } catch { return inicial(); }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducir, undefined, cargar);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ carrito: estado.carrito, form: estado.form, solicitudes: estado.solicitudes, correlativo: estado.correlativo })); } catch { /* sin almacenamiento */ }
  }, [estado.carrito, estado.form, estado.solicitudes, estado.correlativo]);

  const resumen = useMemo<Resumen>(() => {
    const cats = new Set(estado.carrito.map((l) => producto(l.sku)?.cat));
    return {
      nLineas: estado.carrito.length,
      nUnidades: estado.carrito.reduce((a, l) => a + l.cant, 0),
      nCategorias: cats.size,
      sinFecha: estado.carrito.filter((l) => !l.fecha).length,
      frio: estado.carrito.filter((l) => { const p = producto(l.sku); return p ? esFrio(p) : false; }).length,
    };
  }, [estado.carrito]);

  const cantidadEnCarrito = useCallback((sku: string) => estado.carrito.filter((l) => l.sku === sku).reduce((a, l) => a + l.cant, 0), [estado.carrito]);

  // enviarSolicitud devuelve si pasó la validación, para que la pantalla decida qué mostrar.
  const enviarSolicitud = useCallback(() => {
    const f = estado.form;
    const ok = !!(f.est && f.fecha && f.factura && f.solicitante.trim());
    dispatch({ t: 'enviar' });
    return ok;
  }, [estado.form]);

  // Las acciones solo usan dispatch (estable): su identidad no cambia entre renders, así pueden ir en dependencias de efectos.
  const acciones = useMemo(() => ({
    agregar: (sku: string, cant = 1) => dispatch({ t: 'agregar', sku, cant }),
    setCantTarjeta: (sku: string, cant: number) => dispatch({ t: 'cantTarjeta', sku, cant }),
    setCantLinea: (id: string, cant: number) => dispatch({ t: 'cantLinea', id, cant }),
    setFechaLinea: (id: string, fecha: string) => dispatch({ t: 'fechaLinea', id, fecha }),
    setFechaTodas: (fecha: string) => dispatch({ t: 'fechaTodas', fecha }),
    setMarcaLinea: (id: string, marca: string) => dispatch({ t: 'marcaLinea', id, marca }),
    quitar: (id: string) => dispatch({ t: 'quitar', id }),
    vaciar: () => dispatch({ t: 'vaciar' }),
    setCampo: (campo: keyof FormConfirmar, valor: string) => dispatch({ t: 'campo', campo, valor }),
    cerrarConfirmado: () => dispatch({ t: 'cerrarConfirmado' }),
  }), []);

  const valor = useMemo<Ctx>(() => ({
    estado, resumen, cantidadEnCarrito, enviarSolicitud, ...acciones,
  }), [estado, resumen, cantidadEnCarrito, enviarSolicitud, acciones]);

  // Solo en desarrollo: facilita probar el estado desde la consola (window.__cart).
  if (import.meta.env.DEV) (window as unknown as { __cart?: Ctx }).__cart = valor;
  return <CartCtx.Provider value={valor}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart fuera de CartProvider');
  return c;
};
