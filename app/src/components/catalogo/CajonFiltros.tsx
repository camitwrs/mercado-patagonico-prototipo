import { useEffect, useRef } from 'react';
import { LuX } from 'react-icons/lu';
import { plural } from '../../data/catalogo';
import type { Faceta, ParamsCatalogo } from '../../lib/catalogoQuery';
import PanelFacetas from './PanelFacetas';

// Cajón lateral con los filtros (cuando no hay una familia elegida). Cierra con Esc o al tocar fuera.
export default function CajonFiltros({ p, total, alternar, cerrar }: { p: ParamsCatalogo; total: number; alternar: (f: Faceta, v: string) => void; cerrar: () => void }) {
  const cierre = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cierre.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [cerrar]);
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-blue-950/50" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <aside role="dialog" aria-modal="true" aria-label="Más filtros" className="flex h-full w-full max-w-[380px] flex-col bg-surface shadow-[-8px_0_30px_rgb(0_0_0/0.16)]">
        <div className="flex items-center justify-between bg-blue-900 px-5 py-4 text-white">
          <h2 className="!tracking-normal text-[18px] font-bold">Más filtros</h2>
          <button ref={cierre} type="button" aria-label="Cerrar" onClick={cerrar} className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white/15 hover:bg-white/25"><LuX aria-hidden="true" size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto"><PanelFacetas p={p} alternar={alternar} /></div>
        <div className="border-t border-line bg-subtle p-4"><button type="button" className="btn btn-p w-full" onClick={cerrar}>Ver {plural(total, 'producto', 'productos')}</button></div>
      </aside>
    </div>
  );
}
