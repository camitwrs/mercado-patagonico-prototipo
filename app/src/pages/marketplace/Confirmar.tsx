import { useEffect, type ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LuCheck, LuChevronDown, LuSend, LuSnowflake } from 'react-icons/lu';
import { CENTROS_COSTO, ESTABLECIMIENTOS, HOY_ISO, TIPOS_FACTURA, establecimiento, plural, sumarDias } from '../../data/catalogo';
import type { FormConfirmar } from '../../data/types';
import { useCart } from '../../state/CartContext';
import LineasTabla from '../../components/LineasTabla';

// Campo con etiqueta, marca de obligatorio y error. Borde verde si está completo; rojo si se intentó enviar sin completarlo.
function Campo({ etiqueta, req = false, error = false, ayuda, children }: { etiqueta: string; req?: boolean; error?: boolean; ayuda?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="field-label">{etiqueta}{req && <><span className="ml-1 text-negative" aria-hidden="true">*</span><span className="sr-only"> (obligatorio)</span></>}</span>
      {children}
      {ayuda && <span className="text-[12px] text-muted">{ayuda}</span>}
      {error && <span role="alert" className="text-[13px] text-negative">Campo obligatorio</span>}
    </label>
  );
}

const estiloCampo = (ok: boolean, error: boolean) => `field-input ${ok ? '!border-b-positive' : error ? '!border-b-negative' : ''}`;

export default function Confirmar() {
  const { estado, resumen, setCampo, enviarSolicitud } = useCart();
  const navigate = useNavigate();
  const f = estado.form;
  const intento = estado.intentoEnvio;
  const est = establecimiento(f.est);

  // Al salir de la pantalla de éxito se limpia la solicitud confirmada.
  const { cerrarConfirmado } = useCart();
  useEffect(() => () => { cerrarConfirmado(); }, [cerrarConfirmado]);

  if (estado.confirmado) return <Exito />;
  if (resumen.nLineas === 0) return <Navigate to="/marketplace/carrito" replace />;

  const checklist: [string, boolean][] = [['Establecimiento', !!f.est], ['Fecha requerida en establecimiento', !!f.fecha], ['Tipo de factura', !!f.factura], ['Solicitante', !!f.solicitante.trim()], ['Productos cargados', resumen.nLineas > 0]];
  const listos = checklist.filter((c) => c[1]).length;
  const set = (campo: keyof FormConfirmar) => (e: { target: { value: string } }) => setCampo(campo, e.target.value);

  const enviar = () => {
    if (!enviarSolicitud()) {
      // Lleva el foco al primer campo obligatorio que falta.
      const faltan = ['est', 'fecha', 'factura', 'solicitante'].find((c) => !(f[c as keyof FormConfirmar] as string).trim());
      if (faltan) document.getElementById(`cf-${faltan}`)?.focus();
    }
  };

  return (
    <div>
      <div className="mb-7">
        <p className="kick">Solicitud</p>
        <h1 className="mt-4 text-[clamp(26px,2.8vw,36px)] font-extrabold leading-[1.08]">Confirmar solicitud</h1>
        <p className="mt-2 text-[16px] text-muted">Los datos administrativos se piden aquí, al final del flujo.</p>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-0 flex-[1_1_600px]">
          <section className="mb-6 rounded-2xl border border-line bg-surface p-6">
            <h2 className="border-b border-line pb-4 text-[18px] font-bold">Datos de la solicitud</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-5 pt-5">
              <Campo etiqueta="Establecimiento" req error={intento && !f.est}>
                <div className="relative">
                  <select id="cf-est" value={f.est} onChange={set('est')} className={`${estiloCampo(!!f.est, intento && !f.est)} appearance-none pr-8`}>
                    <option value="">Selecciona un establecimiento</option>
                    {ESTABLECIMIENTOS.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </select>
                  <LuChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </Campo>
              <Campo etiqueta="Fecha requerida en establecimiento" req error={intento && !f.fecha}>
                <input id="cf-fecha" type="date" value={f.fecha} min={sumarDias(1)} onChange={set('fecha')} className={estiloCampo(!!f.fecha, intento && !f.fecha)} />
              </Campo>
              <Campo etiqueta="Tipo de factura" req error={intento && !f.factura}>
                <div className="relative">
                  <select id="cf-factura" value={f.factura} onChange={set('factura')} className={`${estiloCampo(!!f.factura, intento && !f.factura)} appearance-none pr-8`}>
                    <option value="">Selecciona el tipo de factura</option>
                    {TIPOS_FACTURA.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <LuChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </Campo>
              <Campo etiqueta="Solicitante" req error={intento && !f.solicitante.trim()}>
                <input id="cf-solicitante" value={f.solicitante} onChange={set('solicitante')} placeholder="Nombre y apellido" className={estiloCampo(!!f.solicitante.trim(), intento && !f.solicitante.trim())} />
              </Campo>
              <Campo etiqueta="Moneda de cotización" ayuda="Es la moneda en que quieres recibir la cotización.">
                <div className="relative">
                  <select value={f.moneda} onChange={set('moneda')} className="field-input appearance-none pr-8"><option>CLP</option><option>USD</option></select>
                  <LuChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </Campo>
              <Campo etiqueta="Centro de costo">
                <div className="relative">
                  <select value={f.centro} onChange={set('centro')} className="field-input appearance-none pr-8">
                    <option value="">Sin centro de costo</option>
                    {CENTROS_COSTO.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <LuChevronDown aria-hidden="true" size={16} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </Campo>
              <Campo etiqueta="Referencia del cliente"><input value={f.ref} onChange={set('ref')} placeholder="Ej.: OC-HME-2026-320" className="field-input" /></Campo>
              <Campo etiqueta="Fecha Doc. Referencia Cliente"><input type="date" value={f.fechaRef} max={HOY_ISO} onChange={set('fechaRef')} className="field-input" /></Campo>
            </div>

            {est && (
              <dl className="mt-6 grid gap-4 rounded-xl bg-blue-100 p-4 text-[14px] sm:grid-cols-3">
                {([['Dirección de entrega', `${est.direccion}, ${est.ciudad}`], ['Horario de recepción', est.recepcion], ['Recibe', est.jefe]] as const).map(([k, v]) => (
                  <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-blue-700">{k}</dt><dd className="mt-0.5 text-ink">{v}</dd></div>
                ))}
              </dl>
            )}

            <label className="mt-6 flex flex-col gap-1.5">
              <span className="field-label">Consideraciones</span>
              <textarea rows={3} maxLength={500} value={f.consid} onChange={set('consid')} placeholder="Indicaciones de entrega, horarios de recepción, contacto en el establecimiento…"
                className="w-full resize-y rounded-xl border border-line bg-page px-4 py-3 text-[15px] outline-none transition-colors focus:border-cta" />
            </label>
          </section>

          <section className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div><h2 className="text-[18px] font-bold">Productos solicitados</h2><p className="mt-0.5 text-[12px] text-muted">Puedes ajustar cantidad, fecha o quitar productos aquí mismo, sin volver al carrito.</p></div>
              <span className="font-mono text-[12px] text-muted">{plural(resumen.nLineas, 'producto', 'productos')} · {plural(resumen.nUnidades, 'unidad', 'unidades')}</span>
            </div>
            {resumen.frio > 0 && (
              <p className="flex items-start gap-2 border-b border-line bg-blue-100 px-5 py-2.5 text-[14px] text-ink">
                <LuSnowflake aria-hidden="true" size={15} className="mt-0.5 flex-none" />
                <span><b>{plural(resumen.frio, 'producto requiere', 'productos requieren')} cadena de frío.</b> {est ? `Se recibirán en ${est.nombre} en horario ${est.recepcion}.` : 'Elige el establecimiento para ver su horario de recepción.'}</span>
              </p>
            )}
            <LineasTabla variante="confirmar" cabecera={f.fecha} />
          </section>
        </div>

        <aside className="sticky top-[84px] min-w-0 max-w-[340px] flex-[1_1_280px] rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-[18px] font-bold">Progreso</h2>
          <ul className="flex flex-col gap-2.5">
            {checklist.map(([t, ok]) => (
              <li key={t} className="flex items-center gap-2.5 text-[14px]">
                <span aria-hidden="true" className={`grid h-5 w-5 flex-none place-items-center rounded-full ${ok ? 'bg-teal text-white' : 'border-2 border-line text-transparent'}`}><LuCheck size={12} strokeWidth={3} /></span>
                <span className={ok ? '' : 'text-muted'}>{t}<span className="sr-only">{ok ? ': listo' : ': pendiente'}</span></span>
              </li>
            ))}
          </ul>
          <p className="mb-1.5 mt-5 border-t border-line pt-4 font-mono text-[12px] text-muted">{listos} de {checklist.length} requisitos listos</p>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-band"><div className="h-full rounded-full bg-teal transition-[width] duration-300" style={{ width: `${(listos / checklist.length) * 100}%` }} /></div>
          {intento && listos < checklist.length && <p role="alert" className="mb-3 text-[13px] text-negative">Completa los campos obligatorios para generar la solicitud.</p>}
          <button type="button" className="btn btn-cta btn-lg w-full" onClick={enviar}><LuSend aria-hidden="true" size={17} /> Generar solicitud</button>
          <Link to="/marketplace/carrito" className="btn btn-o mt-2.5 w-full">Volver al carrito</Link>
        </aside>
      </div>
    </div>
  );

  // (el flujo continúa en <Exito /> cuando la solicitud queda confirmada)
}

function Paso({ n, titulo, detalle, estado }: { n: number; titulo: string; detalle: string; estado: 'hecho' | 'actual' | 'pendiente' }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
      <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-[13px] font-bold ${estado === 'hecho' ? 'bg-teal text-white' : estado === 'actual' ? 'border-2 border-cta bg-orange-100 text-orange-600' : 'bg-band text-muted'}`}>
        {estado === 'hecho' ? <LuCheck aria-hidden="true" size={15} strokeWidth={3} /> : n}
      </span>
      <span className={`text-[13px] font-bold ${estado === 'pendiente' ? 'text-muted' : ''}`}>{titulo}</span>
      <span className="text-[12px] text-muted">{detalle}</span>
    </div>
  );
}

function Exito() {
  const { estado } = useCart();
  const navigate = useNavigate();
  const c = estado.confirmado;
  if (!c) return null;
  const unidades = c.lineas.reduce((a, l) => a + l.cant, 0);
  return (
    <div className="mx-auto my-6 max-w-[680px] rounded-3xl border border-line bg-surface px-8 py-12 text-center sm:px-12">
      <span className="mx-auto mb-6 grid h-[76px] w-[76px] place-items-center rounded-full bg-teal text-white"><LuCheck aria-hidden="true" size={34} strokeWidth={3} /></span>
      <h1 className="text-[clamp(24px,2.5vw,32px)] font-extrabold leading-[1.1]">Solicitud enviada a revisión</h1>
      <div className="mb-7 mt-3 space-y-2 text-[16px] text-muted">
        <p>Quedó en estado EN REVISIÓN. El equipo de Mercado Patagónico la revisará y te enviará la cotización con precios y disponibilidad.</p>
        <p>Podrás seguir el estado de tu solicitud en Solicitudes de pedido, que estará disponible próximamente.</p>
      </div>
      <div className="mb-8 inline-flex flex-col gap-1.5 rounded-2xl border border-dashed border-teal bg-teal-50 px-9 py-5">
        <span className="font-mono text-[12px] tracking-[0.12em] text-muted">N° SOLICITUD</span>
        <span className="font-mono text-[32px] font-bold text-accent">{c.codigo}</span>
        <span className="text-[12px] text-muted">{plural(c.lineas.length, 'producto', 'productos')} · {plural(unidades, 'unidad', 'unidades')} · {establecimiento(c.est)?.nombre}</span>
      </div>
      <div className="mx-auto mb-8 flex max-w-[540px] items-start justify-center gap-2" aria-label="Estado de la solicitud">
        <Paso n={1} titulo="Enviada" detalle="Tu solicitud" estado="hecho" />
        <span aria-hidden="true" className="mt-4 h-0.5 w-10 flex-none bg-teal" />
        <Paso n={2} titulo="En revisión" detalle="Mercado Patagónico" estado="actual" />
        <span aria-hidden="true" className="mt-4 h-0.5 w-10 flex-none bg-line" />
        <Paso n={3} titulo="Cotizada" detalle="Precios y stock" estado="pendiente" />
      </div>
      <button type="button" className="btn btn-cta btn-lg" onClick={() => navigate('/marketplace')}>Volver al Marketplace</button>
    </div>
  );
}
