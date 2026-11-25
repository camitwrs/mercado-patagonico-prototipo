import { useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { plural } from '../../data/catalogo';
import { arbol } from '../../lib/catalogoQuery';
import { IconoFamilia } from '../ui';

type Destino = { fam: string; cat?: string; sub?: string };

// Menú de categorías: familias a la izquierda, categorías y subcategorías de la familia activa a la derecha.
export default function MenuCategorias({ famActual, ir, cerrar }: { famActual: string; ir: (d: Destino) => void; cerrar: () => void }) {
  const fams = arbol();
  const [hover, setHover] = useState(famActual);
  const activa = fams.find((f) => f.codigo === hover) ?? fams[0];
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [cerrar]);

  return (
    <>
      <div className="fixed inset-0 z-[34] bg-blue-950/20" onMouseDown={cerrar} aria-hidden="true" />
      <div role="dialog" aria-label="Categorías" className="absolute left-0 top-[calc(100%+8px)] z-[36] grid h-[min(500px,calc(100vh-240px))] w-[min(980px,calc(100vw-48px))] grid-cols-[minmax(230px,270px)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_rgb(0_37_68/0.18)]">
        <div className="flex min-h-0 flex-col overflow-y-auto border-r border-line bg-subtle py-2">
          <p className="px-4 pb-1 pt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Familias</p>
          {fams.map((f) => {
            const a = f.codigo === activa.codigo;
            return (
              <button key={f.codigo} type="button" onMouseEnter={() => setHover(f.codigo)} onFocus={() => setHover(f.codigo)} onClick={() => ir({ fam: f.codigo })}
                className={`mx-2 my-px flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14px] transition-colors ${a ? 'bg-surface shadow-[0_1px_3px_rgb(0_37_68/0.12)]' : 'hover:bg-surface/70'}`}>
                <span className={`grid h-7 w-7 flex-none place-items-center rounded-md ${a ? 'bg-teal text-white' : 'bg-blue-100 text-blue-700'}`}><IconoFamilia codigo={f.codigo} size={15} /></span>
                <span className={`min-w-0 flex-1 truncate ${a ? 'font-semibold' : 'font-medium'}`}>{f.nombre}</span>
                <span className="font-mono text-[12px] text-muted">{f.cantidad}</span>
                <LuChevronRight aria-hidden="true" size={14} className={a ? 'text-teal' : 'text-faint'} />
              </button>
            );
          })}
        </div>
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <div className="min-w-0"><h3 className="truncate text-[18px] font-bold">{activa.nombre}</h3><p className="text-[12px] text-muted">{plural(activa.cantidad, 'producto', 'productos')} · {plural(activa.cats.length, 'categoría', 'categorías')}</p></div>
            <button type="button" className="btn btn-o !px-4 !py-2 !text-[13px]" onClick={() => ir({ fam: activa.codigo })}>Ver todo ({activa.cantidad})</button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-8 gap-y-5 p-6">
            {activa.cats.map((c) => (
              <div key={c.nombre}>
                <button type="button" onClick={() => ir({ fam: activa.codigo, cat: c.nombre })} className="flex w-full cursor-pointer items-center justify-between gap-2 border-b border-line pb-1.5 text-left">
                  <span className="font-display text-[14px] font-bold hover:text-blue-600">{c.nombre}</span><span className="font-mono text-[12px] text-muted">{c.cantidad}</span>
                </button>
                <div className="mt-1.5 flex flex-col">
                  {c.subs.map((s) => (
                    <button key={s.nombre} type="button" onClick={() => ir({ fam: activa.codigo, cat: c.nombre, sub: s.nombre })}
                      className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left text-[14px] text-muted transition-colors hover:bg-subtle hover:text-ink">
                      <span>{s.nombre}</span><span className="font-mono text-[12px]">{s.cantidad}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
