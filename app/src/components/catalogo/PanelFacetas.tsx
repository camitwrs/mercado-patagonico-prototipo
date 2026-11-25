import { LuCheck } from 'react-icons/lu';
import { calcularFacetas, type Faceta, type ParamsCatalogo } from '../../lib/catalogoQuery';

// Grupos de filtros con conteos. Sirve para el panel lateral y para el cajón "Más filtros".
export default function PanelFacetas({ p, alternar }: { p: ParamsCatalogo; alternar: (f: Faceta, v: string) => void }) {
  const grupos = calcularFacetas(p);
  if (!grupos.length) return <p className="px-4 py-6 text-[14px] text-muted">No hay filtros disponibles para esta selección.</p>;
  return (
    <div className="divide-y divide-line">
      {grupos.map((g) => (
        <div key={g.faceta} role="group" aria-labelledby={`faceta-${g.faceta}`} className="px-2 pb-2 pt-5">
          <div className="px-2 pb-2"><p id={`faceta-${g.faceta}`} className="font-display text-[14px] font-bold">{g.titulo}</p><p className="text-[12px] text-muted">{g.sub}</p></div>
          <div className="flex flex-col gap-px">
            {g.valores.map(([v, n]) => {
              const activa = p[g.faceta].includes(v);
              return (
                <button key={v} type="button" role="checkbox" aria-checked={activa} onClick={() => alternar(g.faceta, v)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-subtle">
                  <span aria-hidden="true" className={`grid h-4 w-4 flex-none place-items-center rounded-[4px] border-[1.5px] ${activa ? 'border-teal bg-teal text-white' : 'border-line-strong/40 bg-surface'}`}>{activa && <LuCheck size={11} strokeWidth={3} />}</span>
                  <span className={`min-w-0 flex-1 truncate text-[14px] ${activa ? 'font-semibold' : ''}`}>{v}</span>
                  <span className="flex-none font-mono text-[12px] text-muted">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
