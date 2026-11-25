import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowRight, LuLeaf, LuSearch, LuSnowflake } from 'react-icons/lu';
import { PRODUCTOS, SEGMENTOS, plural } from '../../data/catalogo';
import { arbol } from '../../lib/catalogoQuery';
import { IconoFamilia } from '../../components/ui';

const CATALOGO = '/marketplace/catalogo';

// Fila tipográfica con línea naranja que se dibuja al pasar el cursor (mismo gesto que la landing).
function Destacado({ a, icono: I, titulo, detalle }: { a: string; icono: typeof LuLeaf; titulo: string; detalle: string }) {
  return (
    <Link to={a} className="group relative flex items-center gap-5 border-t border-line py-6 transition-[padding] duration-300 hover:pl-3">
      <span aria-hidden="true" className="absolute left-0 top-[-1px] h-0.5 w-0 bg-cta transition-[width] duration-500 group-hover:w-full" />
      <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-blue-100 text-blue-700"><I aria-hidden="true" size={22} /></span>
      <span className="min-w-0 flex-1"><span className="block font-display text-[20px] font-bold leading-tight">{titulo}</span><span className="block text-[14px] text-muted">{detalle}</span></span>
      <LuArrowRight aria-hidden="true" size={20} className="flex-none text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
    </Link>
  );
}

export default function Portada() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const fams = arbol();
  const nRegional = PRODUCTOS.filter((p) => p.region === 'Magallanes').length;
  const nFrio = PRODUCTOS.filter((p) => p.temp !== 'Ambiente').length;

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    navigate(t ? `${CATALOGO}?q=${encodeURIComponent(t)}` : CATALOGO);
  };

  return (
    <div className="flex flex-col gap-16 pt-4">
      <section className="max-w-[880px]">
        <p className="kick">Marketplace</p>
        <h1 className="mt-5 text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.06]">¿Qué necesita <span className="text-sky">tu establecimiento</span>?</h1>
        <p className="mt-4 text-[18px] text-muted">Busca por código o descripción, o entra por familia de productos.</p>
        <form role="search" onSubmit={buscar} className="mt-8 flex max-w-[720px] flex-wrap items-end gap-4">
          <label className="relative flex min-w-[260px] flex-[1_1_320px] flex-col gap-1">
            <span className="sr-only">Buscar productos</span>
            <LuSearch aria-hidden="true" size={20} className="pointer-events-none absolute bottom-3 left-0.5 text-muted" />
            <input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej.: MP-ALI-00101, cordero, amenities, sábanas" className="field-input !pl-8" />
          </label>
          <button type="submit" className="btn btn-cta btn-lg">Buscar</button>
        </form>
        <Link to={CATALOGO} className="mt-5 inline-flex min-h-6 items-center gap-2 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">
          o ver los {PRODUCTOS.length} productos del catálogo <LuArrowRight aria-hidden="true" size={15} />
        </Link>
      </section>

      <section aria-label="Accesos rápidos" className="grid gap-x-10 md:grid-cols-2">
        <Destacado a={`${CATALOGO}?origen=${encodeURIComponent('Regional · Magallanes')}`} icono={LuLeaf} titulo="Productos regionales de Magallanes" detalle={`${plural(nRegional, 'producto', 'productos')} de origen local`} />
        <Destacado a={`${CATALOGO}?temp=${encodeURIComponent('Refrigerado|Congelado')}`} icono={LuSnowflake} titulo="Cadena de frío" detalle={plural(nFrio, 'producto refrigerado o congelado', 'productos refrigerados o congelados')} />
      </section>

      <section>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[28px] font-extrabold">Familias</h2>
          <span className="font-mono text-[12px] text-muted">{fams.length} familias</span>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {fams.map((f) => (
            <li key={f.codigo}>
              <Link to={`${CATALOGO}?fam=${f.codigo}`} className="group relative flex items-center gap-4 border-t border-line py-5 transition-[padding] duration-300 hover:pl-3">
                <span aria-hidden="true" className="absolute left-0 top-[-1px] h-0.5 w-0 bg-cta transition-[width] duration-500 group-hover:w-full" />
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-blue-100 text-blue-700"><IconoFamilia codigo={f.codigo} size={21} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[17px] font-bold leading-tight">{f.nombre}</span>
                  <span className="block font-mono text-[12px] text-muted">{plural(f.cantidad, 'producto', 'productos')} · {plural(f.cats.length, 'categoría', 'categorías')}</span>
                </span>
                <LuArrowRight aria-hidden="true" size={18} className="flex-none text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-[28px] font-extrabold">Comprar por área de uso</h2>
        <div role="group" aria-label="Área de uso" className="mt-5 flex flex-wrap gap-2.5">
          {SEGMENTOS.map((s) => (
            <Link key={s} to={`${CATALOGO}?seg=${encodeURIComponent(s)}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[14px] font-medium transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-teal">
              {s}<span className="rounded-full bg-band px-2 font-mono text-[11px] text-muted">{PRODUCTOS.filter((p) => p.seg.includes(s)).length}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
