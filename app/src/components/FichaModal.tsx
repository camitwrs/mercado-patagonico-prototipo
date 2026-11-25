import { useRef, useState, type ReactNode } from 'react';
import { LuChevronDown, LuFileText, LuInfo, LuPlus, LuTriangleAlert, LuX } from 'react-icons/lu';
import { PRODUCTOS, plural, producto } from '../data/catalogo';
import type { Producto } from '../data/types';
import { useCart } from '../state/CartContext';
import { useToast } from '../state/ToastContext';
import { useFicha } from '../lib/useFicha';
import { useModal } from '../lib/useModal';
import { EtiquetasProducto, IconoFamilia, Stepper } from './ui';

const vacio = (v: unknown) => v === '' || v == null || v === 'No aplica';

type Par = [string, ReactNode];

// Ficha en dos zonas: a la izquierda lo que se necesita para decidir y pedir (resumen + cantidad);
// a la derecha el detalle técnico en secciones plegables, para no obligar a leer 40 datos.
function Resumen({ pares }: { pares: Par[] }) {
  const visibles = pares.filter(([, v]) => !vacio(v));
  if (!visibles.length) return null;
  return (
    <dl className="divide-y divide-line rounded-xl border border-line bg-surface">
      {visibles.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
          <dt className="text-[13px] text-muted">{k}</dt>
          <dd className="text-right text-[14px] font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Seccion({ titulo, pares, abierta, onToggle }: { titulo: string; pares: Par[]; abierta: boolean; onToggle: () => void }) {
  const visibles = pares.filter(([, v]) => !vacio(v));
  if (!visibles.length) return null;
  return (
    <section className="border-b border-line last:border-0">
      <h3>
        <button type="button" aria-expanded={abierta} onClick={onToggle} className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left">
          <span className="font-display text-[15px] font-bold">{titulo} <span className="ml-1 font-mono text-[12px] font-normal text-muted">{visibles.length}</span></span>
          <LuChevronDown aria-hidden="true" size={18} className={`flex-none text-muted transition-transform ${abierta ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      {abierta && (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3.5 pb-5 sm:grid-cols-2">
          {visibles.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="mb-0.5 text-[12px] text-muted">{k}</dt>
              <dd className="text-[14px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

function Relacionados({ titulo, items, abrir }: { titulo: string; items: Producto[]; abrir: (s: string) => void }) {
  if (!items.length) return null;
  return (
    <div className="pt-6">
      <h3 className="mb-2 font-display text-[15px] font-bold">{titulo}</h3>
      <div className="flex flex-col overflow-hidden rounded-xl border border-line">
        {items.map((o, i) => (
          <button key={o.sku} type="button" onClick={() => abrir(o.sku)} className={`flex cursor-pointer items-center gap-3 bg-surface px-3 py-2.5 text-left transition-colors hover:bg-subtle ${i < items.length - 1 ? 'border-b border-line' : ''}`}>
            <span className="w-[104px] flex-none font-mono text-[12px] text-accent">{o.sku}</span>
            <span className="min-w-0 flex-1 truncate text-[14px]">{o.nombre}</span>
            <span className="flex-none rounded-md bg-band px-1.5 py-0.5 text-[11px] font-semibold text-muted">{o.uv}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Cantidad y botón de agregar. Se usa en la columna izquierda (escritorio) y en la barra inferior (móvil).
function Accion({ p, enCarro }: { p: Producto; enCarro: number }) {
  const { agregar } = useCart();
  const aviso = useToast();
  const [cant, setCant] = useState(1);
  return (
    <div>
      {enCarro > 0 && <p className="mb-2 text-[13px] font-semibold text-accent">Ya tienes {plural(enCarro, 'unidad', 'unidades')} en el carrito.</p>}
      <div className="flex flex-wrap items-center gap-3">
        <Stepper grande valor={cant} onChange={(n) => setCant(Math.max(1, Math.min(99999, Math.round(n))))} etiqueta={p.nombre} />
        <button type="button" className="btn btn-cta !min-w-0 flex-1" onClick={() => { agregar(p.sku, cant); aviso('Agregado al carrito', p.nombre); setCant(1); }}>
          <LuPlus aria-hidden="true" size={17} /> Agregar al carrito
        </button>
      </div>
      {p.moq > 1 && <p className="mt-2 text-[12px] text-muted">Mínimo de venta: {p.moq} {p.uv}.</p>}
    </div>
  );
}

function Contenido({ p }: { p: Producto }) {
  const { abrir, cerrar } = useFicha();
  const { cantidadEnCarrito } = useCart();
  const aviso = useToast();
  const caja = useRef<HTMLDivElement>(null);
  useModal(caja, cerrar);

  const enCarro = cantidadEnCarrito(p.sku);
  const activo = p.estado === 'Activo';
  const servicio = p.tipo === 'Servicio';
  const variantes = p.skuPadre ? PRODUCTOS.filter((x) => x.skuPadre === p.skuPadre && x.sku !== p.sku) : [];
  const sustituto = p.sustituto ? producto(p.sustituto) : undefined;
  const otros = PRODUCTOS.filter((x) => x.sub === p.sub && x.cat === p.cat && x.sku !== p.sku && !variantes.includes(x)).slice(0, 5);
  const docs = [[p.fichaUrl, 'Ficha técnica'], [p.manualUrl, 'Manual'], [p.hdsUrl, 'Hoja de datos de seguridad']].filter(([u]) => u);

  // Lo que se necesita para decidir, de un vistazo.
  const vistazo: Par[] = [
    ['Se vende por', p.uv],
    ['Formato', p.contNeto || p.factorTexto],
    ['Mínimo de venta', p.moq > 1 ? `${p.moq} ${p.uv}` : ''],
    ['Plazo de entrega', p.lead ? `${p.lead} días` : ''],
    ['Conservación', p.temp !== 'Ambiente' ? `${p.temp} · ${p.tmin} a ${p.tmax} °C` : ''],
    ['Vida útil', p.vida ? `${p.vida} días` : ''],
    ['Origen', [p.region, p.origen].filter(Boolean).join(', ')],
  ];

  const secciones: { id: string; titulo: string; pares: Par[] }[] = [
    { id: 'cons', titulo: 'Conservación y trazabilidad', pares: [['Condición de temperatura', p.temp], ['Rango de temperatura', p.temp !== 'Ambiente' ? `${p.tmin} a ${p.tmax} °C` : ''], ['Vida útil', p.vida ? `${p.vida} días` : ''], ['Vida útil mínima al recibir', p.vidaRec ? `${p.vidaRec} días` : ''], ['Almacenamiento', p.alm], ['Requiere lote', servicio ? '' : p.lote], ['Requiere fecha de vencimiento', servicio ? '' : p.venc], ['Requiere número de serie', p.serie === 'Sí' ? 'Sí' : '']] },
    { id: 'form', titulo: 'Formato y unidades', pares: [['Unidad base', p.ub], ['Unidad de compra', p.uc], ['Unidad de venta', p.uv], ['Conversión', p.factorTexto], ['Contenido neto', p.contNeto], ['Unidades por caja', p.uxCaja], ['Cajas por pallet', p.pallet], ['Mínimo de venta', p.moq > 1 ? `${p.moq} ${p.uv}` : '']] },
    { id: 'tec', titulo: 'Descripción técnica', pares: [['Descripción larga', p.larga], ['Especificación clave 1', p.esp[0]], ['Especificación clave 2', p.esp[1]], ['Especificación clave 3', p.esp[2]], ['Capacidad / potencia', p.capacidad], ['Material', p.material], ['Color', p.color], ['Talla / dimensiones', p.talla]] },
    { id: 'cump', titulo: 'Cumplimiento', pares: [['Registro sanitario', p.regSan], ['Certificaciones', p.certif], ['Uso restringido', p.condicion], ['Riesgo químico', p.riesgo === 'Sí' ? 'Sí' : '']] },
    { id: 'log', titulo: 'Logística', pares: [['Peso', p.peso], ['Dimensiones (largo x ancho x alto)', p.dims], ['Volumen', p.volumen], ['Apilable', p.apilable], ['Frágil', p.fragilTxt], ['Manejo especial', p.manejoEsp]] },
    { id: 'serv', titulo: 'Servicio y garantía', pares: [['Garantía', p.garantia ? `${p.garantia} meses` : ''], ['Requiere instalación', p.instalacion === 'Sí' ? 'Sí' : ''], ['Requiere mantención', p.mantencion === 'Sí' ? 'Sí' : ''], ['Repuestos disponibles', p.repuestos === 'Sí' ? 'Sí' : '']] },
    { id: 'abas', titulo: 'Abastecimiento', pares: [['Plazo de entrega', p.lead ? `${p.lead} días` : ''], ['Frecuencia de reposición', p.frec], ['Estacionalidad', p.estacional], ['Meses de demanda alta', p.mesesAlta], ['Tipo de cliente', (p.clienteObj ?? []).join(', ')], ['Impuesto', p.afecto ? `${p.afecto}${p.afecto === 'Afecto' ? ` · IVA ${p.iva} %` : ''}` : '']] },
    { id: 'ident', titulo: 'Identificación', pares: [['Código de barras (GTIN/EAN)', p.gtin], ['Fabricante', p.fabricante], ['Código del fabricante', p.codFab], ['Modelo / versión', p.modelo], ['País de origen', p.origen], ['Región de origen', p.region]] },
  ];
  const conDatos = secciones.filter((s) => s.pares.some(([, v]) => !vacio(v)));
  // Se abren por defecto las dos primeras con datos (lo más consultado); el resto, plegado.
  const [abiertas, setAbiertas] = useState<Set<string>>(() => new Set(conDatos.slice(0, 2).map((s) => s.id)));
  const alternar = (id: string) => setAbiertas((a) => { const n = new Set(a); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const todas = abiertas.size === conDatos.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/55 p-0 sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div ref={caja} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="ficha-titulo" className="flex h-full max-h-[calc(100vh-0px)] w-full max-w-[1080px] flex-col overflow-hidden bg-surface shadow-[0_24px_64px_rgb(0_37_68/0.3)] outline-none sm:h-auto sm:max-h-[calc(100vh-32px)] sm:rounded-3xl">
        <div className="flex flex-none items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-blue-100 text-blue-700"><IconoFamilia codigo={p.fam} size={22} /></span>
            <div className="min-w-0">
              <p className="font-mono text-[13px] font-medium tracking-wide text-accent">{p.sku}</p>
              <h2 id="ficha-titulo" className="mt-1 text-[20px] font-bold leading-snug">{p.nombre}</h2>
              <div className="mt-2 flex flex-wrap gap-1"><EtiquetasProducto p={p} /></div>
            </div>
          </div>
          <button type="button" aria-label="Cerrar" onClick={cerrar} className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-full border border-line hover:bg-subtle"><LuX aria-hidden="true" size={18} /></button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Izquierda: resumen y acción */}
          <aside className="flex-none border-b border-line bg-subtle px-5 py-5 sm:px-6 md:flex md:w-[360px] md:flex-col md:gap-5 md:overflow-y-auto md:border-b-0 md:border-r">
            {!activo && sustituto && (
              <div className="mb-4 flex items-start gap-3 rounded-xl bg-orange-100 p-4 text-orange-600 md:mb-0">
                <LuInfo aria-hidden="true" size={20} className="mt-0.5 flex-none" />
                <div>
                  <p className="font-semibold">Producto descontinuado</p>
                  <p className="mt-1 text-[14px]">Mercado Patagónico aprobó como sustituto <button type="button" onClick={() => abrir(sustituto.sku)} className="cursor-pointer font-semibold underline">{sustituto.sku} · {sustituto.nombre}</button>.</p>
                </div>
              </div>
            )}
            {p.desc && <p className="mb-4 text-[15px] leading-relaxed md:mb-0">{p.desc}</p>}
            {p.alergenos && (
              <p className="mb-4 flex items-start gap-2 rounded-xl bg-negative/10 px-3 py-2.5 text-[13px] text-negative md:mb-0"><LuTriangleAlert aria-hidden="true" size={16} className="mt-0.5 flex-none" /><span><b>Alérgenos:</b> {p.alergenos}</span></p>
            )}
            <div className="mb-4 md:mb-0"><Resumen pares={vistazo} /></div>
            {activo && <div className="mt-auto hidden md:block"><Accion p={p} enCarro={enCarro} /></div>}
          </aside>

          {/* Derecha: detalle técnico plegable */}
          <div className="min-h-0 flex-1 px-5 py-5 sm:px-6 md:overflow-y-auto">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="font-display text-[17px] font-bold">Ficha técnica</h3>
              <button type="button" onClick={() => setAbiertas(todas ? new Set() : new Set(conDatos.map((s) => s.id)))} className="min-h-6 cursor-pointer text-[13px] font-semibold text-accent hover:underline">{todas ? 'Plegar todo' : 'Desplegar todo'}</button>
            </div>
            <div>{conDatos.map((s) => <Seccion key={s.id} titulo={s.titulo} pares={s.pares} abierta={abiertas.has(s.id)} onToggle={() => alternar(s.id)} />)}</div>

            {docs.length > 0 && (
              <div className="pt-6">
                <h3 className="mb-2 font-display text-[15px] font-bold">Documentos</h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
                  {docs.map(([, t]) => <button key={t} type="button" onClick={() => aviso('Documento no disponible en el prototipo', 'En la plataforma real se descarga desde aquí.', 'info')} className="inline-flex min-h-6 cursor-pointer items-center gap-1.5 text-accent hover:underline"><LuFileText aria-hidden="true" size={15} />{t}</button>)}
                </div>
              </div>
            )}
            <Relacionados titulo="Otras presentaciones" items={variantes} abrir={abrir} />
            <Relacionados titulo={`Otros productos de ${p.sub}`} items={otros} abrir={abrir} />
          </div>
        </div>

        {/* En móvil la acción queda fija abajo, siempre a la vista */}
        {activo && <div className="flex-none border-t border-line bg-subtle px-5 py-3.5 md:hidden"><Accion p={p} enCarro={enCarro} /></div>}
      </div>
    </div>
  );
}

// La ficha abierta vive en la URL (?ficha=SKU). Cambiar de producto dentro de la ficha reinicia el estado.
export default function FichaModal() {
  const { sku } = useFicha();
  const p = sku ? producto(sku) : undefined;
  if (!p) return null;
  return <Contenido key={p.sku} p={p} />;
}
