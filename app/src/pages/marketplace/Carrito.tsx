import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuCalendar, LuShoppingCart, LuSnowflake } from 'react-icons/lu';
import { plural, sumarDias } from '../../data/catalogo';
import { useCart } from '../../state/CartContext';
import { useUI } from '../../state/UIContext';
import LineasTabla from '../../components/LineasTabla';

export default function Carrito() {
  const { resumen, setFechaTodas } = useCart();
  const { setPidiendoVaciar } = useUI();
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('');
  const hay = resumen.nLineas > 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kick">Carrito</p>
          <h1 className="mt-4 text-[clamp(26px,2.8vw,36px)] font-extrabold leading-[1.08]">Mi carrito</h1>
          <p className="mt-2 text-[16px] text-muted">Revisa cantidades y fechas antes de confirmar la solicitud.</p>
        </div>
        <div className="flex gap-2.5">
          <Link to="/marketplace/catalogo" className="btn btn-o">Seguir agregando</Link>
          {hay && <button type="button" className="btn btn-o !border-negative/40 !text-negative" onClick={() => setPidiendoVaciar(true)}>Vaciar carrito</button>}
        </div>
      </div>

      {!hay ? (
        <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-band text-muted"><LuShoppingCart aria-hidden="true" size={24} /></span>
          <p className="font-display text-[20px] font-bold">Tu carrito está vacío</p>
          <p className="mb-5 mt-1 text-[15px] text-muted">Agrega productos desde el catálogo para armar tu pedido.</p>
          <Link to="/marketplace/catalogo" className="btn btn-cta">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-6">
          <section className="min-w-0 flex-[1_1_620px] overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="text-[18px] font-bold">Productos de la solicitud</h2>
              <div className="flex items-center gap-2.5">
                {resumen.sinFecha > 0 && <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[12px] font-bold text-orange-600">{plural(resumen.sinFecha, 'producto sin fecha', 'productos sin fecha')}</span>}
                <span className="font-mono text-[12px] text-muted">{plural(resumen.nLineas, 'producto', 'productos')}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-b border-line bg-subtle px-5 py-3">
              <span className="flex items-center gap-2 text-[14px] font-semibold"><LuCalendar aria-hidden="true" size={15} className="text-accent" /> Misma fecha para todas</span>
              <input type="date" value={fecha} min={sumarDias(1)} onChange={(e) => setFecha(e.target.value)} aria-label="Fecha para todos los productos" className="h-10 w-[170px] rounded-lg border border-line bg-surface px-2.5 text-[14px] outline-none focus:border-cta" />
              <button type="button" disabled={!fecha} className="btn btn-o !px-4 !py-2 !text-[13px] disabled:cursor-not-allowed disabled:opacity-40" onClick={() => setFechaTodas(fecha)}>Aplicar a {plural(resumen.nLineas, 'producto', 'productos')}</button>
            </div>
            {resumen.frio > 0 && (
              <p className="flex items-start gap-2 border-b border-line bg-blue-100 px-5 py-2.5 text-[14px] text-ink">
                <LuSnowflake aria-hidden="true" size={15} className="mt-0.5 flex-none" />
                <span><b>{plural(resumen.frio, 'producto requiere', 'productos requieren')} cadena de frío.</b> Mercado Patagónico las despacha en vehículo refrigerado y registra lote y vencimiento en la guía.</span>
              </p>
            )}
            <LineasTabla variante="carrito" />
            <p className="border-t border-line bg-subtle px-5 py-3 text-[12px] text-muted">El mismo producto con fechas distintas aparece dos veces en la lista. Los productos sin fecha usan la fecha de cabecera de la confirmación.</p>
          </section>

          <aside className="sticky top-[84px] min-w-0 max-w-[340px] flex-[1_1_280px] rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-[18px] font-bold">Resumen</h2>
            <dl className="flex flex-col gap-2.5 text-[14px] text-muted">
              {([['Productos', resumen.nLineas], ['Suma de unidades', resumen.nUnidades], ['Categorías', resumen.nCategorias], ['Con cadena de frío', resumen.frio]] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-bold text-ink">{v}</dd></div>
              ))}
            </dl>
            <p className="my-4 border-t border-line pt-4 text-[12px] leading-relaxed text-muted">Sin montos: Mercado Patagónico cotiza tu solicitud con precios y disponibilidad después de recibirla.</p>
            <button type="button" className="btn btn-cta btn-lg w-full" onClick={() => navigate('/marketplace/confirmar')}>Continuar</button>
          </aside>
        </div>
      )}
    </div>
  );
}
