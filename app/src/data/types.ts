// Tipos del catálogo de ejemplo del Marketplace (datos extraídos de la maqueta; ver scripts/extract-maqueta.cjs).

export type Familia = { codigo: string; nombre: string; icono: string };

export type Establecimiento = {
  id: string; nombre: string; tipo: string; ciudad: string; direccion: string;
  habitaciones: number; centro: string; estado: string; jefe: string; recepcion: string;
};

export type Producto = {
  sku: string; fam: string; cat: string; sub: string; nombre: string;
  estado: 'Activo' | 'Descontinuado' | string;
  tipo: 'Producto' | 'Servicio' | 'Kit/Combo' | string;
  desc: string; larga: string; seg: string[]; marca: string; fabricante: string; material: string;
  ub: string; uc: string; uv: string; factor: number; contNeto: string; uxCaja: string; pallet: string;
  temp: 'Ambiente' | 'Refrigerado' | 'Congelado' | string; tmin: number | ''; tmax: number | '';
  vida: number | ''; vidaRec: number | ''; lote: string; venc: string; serie: string;
  origen: string; region: string; alm: string; regSan: string; alergenos: string; certif: string;
  moq: number; lead: number; frec: string; critico: string; estacional: string;
  peso: string; dims: string; garantia: number | ''; instalacion: string; mantencion: string;
  gtin?: string; codFab?: string; esp: string[]; capacidad?: string; factorTexto?: string; uContNeto?: string;
  pesoNeto?: string; volumen?: string; apilable?: string; fragilTxt?: string; manejoEsp?: string;
  fichaUrl?: string; hdsUrl?: string; manualUrl?: string; fotoUrl?: string;
  iva?: number; afecto?: string; sustituto?: string; skuPadre?: string; mesesAlta?: string; clienteObj?: string[];
  modelo?: string; color?: string; talla?: string; condicion?: string; riesgo?: string; repuestos?: string;
};

export type LineaCarrito = { id: string; sku: string; cant: number; fecha: string; marca: string };

export type FormConfirmar = {
  est: string; fecha: string; factura: string; solicitante: string; moneda: string;
  centro: string; ref: string; fechaRef: string; consid: string;
};

export type Solicitud = FormConfirmar & { codigo: string; lineas: LineaCarrito[]; creada: string };

export type DatosMaqueta = {
  empresa: { nombre: string; rut: string; usuario: string; correo: string; cargo: string };
  vendedor: { nombre: string; ciudad: string };
  establecimientos: Establecimiento[];
  familias: Familia[];
  segmentos: string[];
  tiposFactura: string[];
  centrosCosto: string[];
  productos: Producto[];
  estadosSolicitud: Record<string, string>;
  hoyIso: string;
};
