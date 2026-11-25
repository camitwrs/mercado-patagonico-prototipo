import { LuSnowflake, LuTrash2 } from 'react-icons/lu';
import { estadoFecha, producto, sumarDias, type TonoFecha } from '../data/catalogo';
import { useCart } from '../state/CartContext';
import { Etiqueta, IconoFamilia, Stepper } from './ui';

const TONO: Record<TonoFecha, string> = {
  aviso: 'bg-orange-100 text-orange-600', gris: 'bg-band text-muted', azul: 'bg-blue-100 text-blue-700', verde: 'bg-teal-100 text-teal-700', rojo: 'bg-negative/10 text-negative',
};

// Productos del carrito. `confirmar` es la versión compacta del paso final (los productos sin fecha heredan la de cabecera).
export default function LineasTabla({ variante, cabecera = '' }: { variante: 'carrito' | 'confirmar'; cabecera?: string }) {
  const { estado, setCantLinea, setFechaLinea, setMarcaLinea, quitar } = useCart();
  const compacta = variante === 'confirmar';
  const minimo = sumarDias(1);
  return (
    <div className="overflow-x-auto">
      <table className="block w-full border-collapse md:table md:min-w-[680px] md:table-fixed">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <th scope="col" className="w-10 py-3 pl-5 font-medium">#</th>
            <th scope="col" className="px-3 py-3 font-medium">Producto</th>
            <th scope="col" className="w-[170px] px-3 py-3 font-medium">Cantidad</th>
            <th scope="col" className="w-[190px] px-3 py-3 font-medium">Fecha requerida</th>
            <th scope="col" className="w-14 py-3 pr-4"><span className="sr-only">Quitar</span></th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {estado.carrito.map((l, i) => {
            const p = producto(l.sku);
            if (!p) return null;
            const [txt, tono] = estadoFecha(l.fecha, cabecera);
            const frio = p.temp !== 'Ambiente';
            return (
              <tr key={l.id} className={`grid grid-cols-[auto_1fr_auto] gap-y-3 border-b border-line/70 px-4 py-4 last:border-0 md:table-row md:px-0 md:py-0 ${!l.fecha && !cabecera ? 'bg-orange-100/40' : ''}`}>
                <td className="md:table-cell md:py-3.5 md:pl-5 md:align-top"><span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 font-mono text-[11px] font-bold text-blue-700">{i + 1}</span></td>
                <td className="min-w-0 px-3 md:table-cell md:py-3.5 md:align-top">
                  <div className="flex gap-3">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-blue-100 text-blue-700"><IconoFamilia codigo={p.fam} size={19} /></span>
                    <div className="min-w-0">
                      <div className="mb-0.5 flex flex-wrap items-center gap-2"><span className="font-mono text-[12px] text-accent">{p.sku}</span><span className="truncate text-[12px] text-muted">{p.cat}</span>{frio && <Etiqueta icono={LuSnowflake}>{p.temp}</Etiqueta>}</div>
                      <p className="text-[14px] font-semibold leading-snug">{p.nombre}</p>
                      {!compacta ? (
                        <input value={l.marca} onChange={(e) => setMarcaLinea(l.id, e.target.value)} placeholder="Marca preferida (opcional)" aria-label={`Marca preferida para ${p.nombre}`}
                          className="mt-2 h-8 w-full max-w-[230px] rounded-lg border border-line bg-surface px-2.5 text-[12px] outline-none focus:border-cta" />
                      ) : l.marca ? <p className="mt-1 text-[12px] text-muted">Marca: {l.marca}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="col-span-3 px-0 md:table-cell md:px-3 md:py-3.5 md:align-top">
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted md:hidden">Cantidad</p>
                  <div className="flex items-center gap-1.5"><Stepper valor={l.cant} onChange={(n) => setCantLinea(l.id, n)} etiqueta={p.nombre} /><span className="rounded-md bg-band px-1.5 py-0.5 text-[11px] font-semibold text-muted">{p.uv}</span></div>
                  {p.moq > 1 && l.cant < p.moq && <p className="mt-1 text-[11px] font-semibold text-orange-600">Mínimo de venta: {p.moq}</p>}
                </td>
                <td className="col-span-3 px-0 md:table-cell md:px-3 md:py-3.5 md:align-top">
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted md:hidden">Fecha requerida</p>
                  <input type="date" value={l.fecha} min={minimo} onChange={(e) => setFechaLinea(l.id, e.target.value)} aria-label={`Fecha requerida de ${p.nombre}`}
                    className="h-10 w-full rounded-lg border border-line bg-surface px-2.5 text-[14px] outline-none focus:border-cta" />
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONO[tono]}`}>{txt}</span>
                </td>
                <td className="col-start-3 row-start-1 text-right md:table-cell md:py-3.5 md:pr-4 md:align-top">
                  <button type="button" aria-label={`Quitar ${p.nombre} del carrito`} title="Quitar del carrito" onClick={() => quitar(l.id)} className="inline-grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-negative transition-colors hover:bg-negative/10"><LuTrash2 aria-hidden="true" size={15} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
