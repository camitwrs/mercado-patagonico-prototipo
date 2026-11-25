import { LuPlus } from 'react-icons/lu';
import type { Producto } from '../../data/types';
import { useCart } from '../../state/CartContext';
import { useToast } from '../../state/ToastContext';
import { useFicha } from '../../lib/useFicha';
import { EtiquetasProducto, IconoFamilia, Stepper } from '../ui';

// Vista en lista del catálogo (tabla). Misma acción de agregar que la tarjeta.
export default function TablaLista({ productos }: { productos: Producto[] }) {
  const { estado, agregar, setCantTarjeta, cantidadEnCarrito } = useCart();
  const aviso = useToast();
  const { abrir } = useFicha();
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {['Producto', 'Unidad', 'Categoría', 'Conservación', 'Cantidad'].map((c) => <th key={c} scope="col" className="px-4 py-3 font-medium">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const cant = estado.cantidades[p.sku] || 1;
            const activo = p.estado === 'Activo';
            return (
              <tr key={p.sku} className={`border-b border-line/70 last:border-0 ${cantidadEnCarrito(p.sku) ? 'bg-teal-50' : 'hover:bg-subtle'}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-blue-100 text-blue-700"><IconoFamilia codigo={p.fam} size={16} /></span>
                    <div className="min-w-0">
                      <button type="button" onClick={() => abrir(p.sku)} className="min-h-6 cursor-pointer font-mono text-[12px] text-accent hover:underline">{p.sku}</button>
                      <div className="font-semibold">{p.nombre}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5"><span className="rounded-md bg-band px-2 py-0.5 text-[11px] font-semibold text-muted">{p.uv}</span></td>
                <td className="px-4 py-2.5 text-[12px] text-muted">{p.cat} · {p.sub}</td>
                <td className="px-4 py-2.5"><div className="flex flex-wrap gap-1">{p.temp === 'Ambiente' && p.estado === 'Activo' ? <span className="text-[12px] text-muted">Ambiente</span> : <EtiquetasProducto p={p} />}</div></td>
                <td className="px-4 py-2.5">
                  {activo ? (
                    <div className="flex items-center gap-2">
                      <Stepper valor={cant} onChange={(n) => setCantTarjeta(p.sku, n)} etiqueta={p.nombre} />
                      <button type="button" aria-label={`Agregar ${p.nombre} al carrito`} className="btn btn-o !h-[38px] !px-3 !py-0" onClick={() => { agregar(p.sku, cant); aviso('Agregado al carrito', p.nombre); }}><LuPlus aria-hidden="true" size={15} /></button>
                    </div>
                  ) : <button type="button" className="min-h-6 text-[13px] font-semibold text-accent hover:underline" onClick={() => abrir(p.sustituto || p.sku)}>Ver sustituto</button>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
