import { LuArrowLeftRight, LuPlus } from 'react-icons/lu';
import type { Producto } from '../../data/types';
import { useCart } from '../../state/CartContext';
import { useToast } from '../../state/ToastContext';
import { useFicha } from '../../lib/useFicha';
import { EtiquetasProducto, Stepper } from '../ui';

// Tarjeta de producto: plana, con el código en mono y la acción de agregar al pie.
export default function ProductoCard({ p }: { p: Producto }) {
  const { estado, agregar, setCantTarjeta, cantidadEnCarrito } = useCart();
  const aviso = useToast();
  const { abrir } = useFicha();
  const enCarro = cantidadEnCarrito(p.sku);
  const cant = estado.cantidades[p.sku] || 1;
  const activo = p.estado === 'Activo';

  return (
    <article className={`relative flex flex-col gap-2.5 rounded-xl border p-4 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgb(0_37_68/0.1)] ${enCarro ? 'border-teal bg-teal-50' : 'border-line bg-surface hover:border-sky'}`}>
      {enCarro > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full border-2 border-page bg-[#026572] px-1 text-[11px] font-bold text-white" title={`En tu carrito: ${enCarro}`}>{enCarro}</span>
      )}
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => abrir(p.sku)} className="min-h-6 cursor-pointer font-mono text-[12px] font-medium tracking-wide text-accent hover:underline">{p.sku}</button>
        <span className="rounded-md bg-band px-2 py-0.5 text-[11px] font-semibold text-muted">{p.uv}</span>
      </div>
      <button type="button" onClick={() => abrir(p.sku)} className="min-h-6 cursor-pointer text-left font-display text-[15px] font-semibold leading-snug transition-colors hover:text-blue-600">{p.nombre}</button>
      <div className="flex flex-wrap gap-1"><EtiquetasProducto p={p} /></div>
      <p className="mt-auto truncate text-[12px] text-muted" title={`${p.sub} · ${p.marca}`}>{p.sub}{p.marca !== 'No aplica' ? ` · ${p.marca}` : ''}</p>
      {activo ? (
        <div className="flex items-center gap-2 pt-0.5">
          <Stepper valor={cant} onChange={(n) => setCantTarjeta(p.sku, n)} etiqueta={p.nombre} />
          <button type="button" className="btn btn-o !h-[38px] !min-w-0 !flex-1 !gap-1.5 !px-3 !py-0 !text-[13px]"
            onClick={() => { agregar(p.sku, cant); aviso('Agregado al carrito', p.nombre); }}>
            <LuPlus aria-hidden="true" size={15} className="shrink-0" /> Agregar
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-o w-full !px-3 !py-[7px] !text-[13px]" onClick={() => abrir(p.sustituto || p.sku)}>
          <LuArrowLeftRight aria-hidden="true" size={14} /> Ver sustituto aprobado
        </button>
      )}
    </article>
  );
}
