import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuShoppingCart, LuSnowflake, LuTrash2, LuX } from 'react-icons/lu';
import { plural, producto } from '../data/catalogo';
import { useCart } from '../state/CartContext';
import { useUI } from '../state/UIContext';
import { useModal } from '../lib/useModal';
import { useFicha } from '../lib/useFicha';
import { Etiqueta, IconoFamilia, Stepper } from './ui';

// Panel lateral del carrito: permite ajustar cantidades sin salir de la pantalla en que se está.
export default function CarritoPanel() {
  const { carritoAbierto, setCarritoAbierto, setPidiendoVaciar } = useUI();
  if (!carritoAbierto) return null;
  return <Panel cerrar={() => setCarritoAbierto(false)} pedirVaciar={() => setPidiendoVaciar(true)} />;
}

function Panel({ cerrar, pedirVaciar }: { cerrar: () => void; pedirVaciar: () => void }) {
  const { estado, resumen, setCantLinea, quitar } = useCart();
  const { abrir } = useFicha();
  const caja = useRef<HTMLElement>(null);
  useModal(caja, cerrar);
  const hay = resumen.nLineas > 0;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-blue-950/55" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <aside ref={caja} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Carrito" className="flex h-full w-full max-w-[400px] flex-col bg-surface shadow-[-8px_0_30px_rgb(0_0_0/0.18)] outline-none">
        <div className="flex items-center justify-between gap-3 bg-blue-900 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15"><LuShoppingCart aria-hidden="true" size={18} /></span>
            <h2 className="!tracking-normal text-[18px] font-bold">Carrito</h2>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[12px] font-bold">{resumen.nLineas}</span>
          </div>
          <button type="button" aria-label="Cerrar carrito" onClick={cerrar} className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/15 hover:bg-white/25"><LuX aria-hidden="true" size={18} /></button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {!hay ? (
            <div className="px-6 py-12 text-center">
              <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-band text-muted"><LuShoppingCart aria-hidden="true" size={22} /></span>
              <p className="text-[15px] text-muted">Agrega productos del catálogo y se irán acumulando aquí, sin cambiar de pantalla.</p>
            </div>
          ) : (
            <>
              {resumen.frio > 0 && <p className="flex items-center gap-2 border-b border-line bg-blue-100 px-5 py-2 text-[12px] font-semibold text-blue-700"><LuSnowflake aria-hidden="true" size={13} />{plural(resumen.frio, 'producto requiere', 'productos requieren')} cadena de frío</p>}
              <div className="flex items-center justify-between border-b border-line bg-subtle px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted"><span>Productos</span><span>{plural(resumen.nUnidades, 'unidad', 'unidades')}</span></div>
              {estado.carrito.map((l, i) => {
                const p = producto(l.sku);
                if (!p) return null;
                return (
                  <div key={l.id} className="flex flex-col gap-2.5 border-b border-line/70 px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 gap-3">
                        <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-blue-100 font-mono text-[11px] font-bold text-blue-700">{i + 1}</span>
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-blue-100 text-blue-700"><IconoFamilia codigo={p.fam} size={19} /></span>
                        <div className="min-w-0">
                          <button type="button" onClick={() => { cerrar(); abrir(p.sku); }} className="min-h-6 cursor-pointer font-mono text-[12px] text-accent hover:underline">{p.sku}</button>
                          <p className="mt-0.5 text-[14px] font-semibold leading-snug">{p.nombre}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">{p.cat}{p.temp !== 'Ambiente' && <Etiqueta icono={LuSnowflake}>{p.temp}</Etiqueta>}</div>
                        </div>
                      </div>
                      <button type="button" aria-label={`Quitar ${p.nombre}`} title="Quitar del carrito" onClick={() => quitar(l.id)} className="grid h-8 w-8 flex-none cursor-pointer place-items-center rounded-full text-negative transition-colors hover:bg-negative/10"><LuTrash2 aria-hidden="true" size={15} /></button>
                    </div>
                    <div className="flex items-center gap-2 pl-8"><Stepper valor={l.cant} onChange={(n) => setCantLinea(l.id, n)} etiqueta={p.nombre} /><span className="rounded-md bg-band px-1.5 py-0.5 text-[11px] font-semibold text-muted">{p.uv}</span></div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {hay && (
          <div className="border-t border-line bg-subtle px-5 py-4">
            <div className="mb-3 flex justify-between text-[14px] text-muted"><span>{plural(resumen.nUnidades, 'unidad', 'unidades')}</span><span>{plural(resumen.nCategorias, 'categoría', 'categorías')}</span></div>
            <Link to="/marketplace/carrito" onClick={cerrar} className="btn btn-cta w-full">Revisar y solicitar <LuArrowRight aria-hidden="true" size={16} /></Link>
            <button type="button" onClick={pedirVaciar} className="mt-2 h-10 w-full cursor-pointer text-[14px] font-semibold text-negative hover:underline">Vaciar carrito</button>
          </div>
        )}
      </aside>
    </div>
  );
}
