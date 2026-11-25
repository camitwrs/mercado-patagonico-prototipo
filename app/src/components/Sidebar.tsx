import { NavLink } from 'react-router-dom';
import { MENU } from '../nav/menu';
import { useToast } from '../state/ToastContext';
import { useCart } from '../state/CartContext';

// Menú lateral. Lo que aún no existe se muestra como "Pronto": no navega y explica qué traerá.
export default function Sidebar({ alNavegar, compacto = false }: { alNavegar?: () => void; compacto?: boolean }) {
  const aviso = useToast();
  const { resumen } = useCart();
  return (
    <nav aria-label="Principal" className={`flex flex-col ${compacto ? 'items-center gap-3 px-3 py-5' : 'gap-6 px-4 py-6'}`}>
      {MENU.map((g) => (
        <div key={g.grupo} className={`flex flex-col gap-0.5 ${compacto ? 'w-full items-center border-t border-line pt-3 first:border-0 first:pt-0' : ''}`}>
          {compacto ? <p className="sr-only">{g.grupo}</p> : <p className="px-3 pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{g.grupo}</p>}
          {g.items.map((it) => {
            const I = it.icono;
            if (it.proximamente || !it.path) {
              return (
                <button key={it.id} type="button" aria-disabled="true" title={compacto ? `${it.label} · próximamente` : undefined} onClick={() => aviso(`${it.label}: próximamente`, it.detalle, 'info')}
                  className={`flex cursor-default items-center rounded-lg text-left text-[14px] text-faint transition-colors hover:bg-subtle ${compacto ? 'h-11 w-11 justify-center' : 'w-full gap-3 px-3 py-2'}`}>
                  <I aria-hidden="true" size={compacto ? 19 : 17} className="flex-none" />
                  {compacto ? <span className="sr-only">{it.label}, próximamente</span> : <><span className="min-w-0 flex-1 leading-snug">{it.label}</span>
                  <span className="flex-none rounded-full bg-band px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted"><span aria-hidden="true">Pronto</span><span className="sr-only">Próximamente</span></span></>}
                </button>
              );
            }
            return (
              <NavLink key={it.id} to={it.path} end={it.fin} onClick={alNavegar} title={compacto ? it.label : undefined}
                className={({ isActive }) => `relative flex items-center rounded-lg text-[14px] font-medium transition-colors ${compacto ? 'h-11 w-11 justify-center' : 'gap-3 px-3 py-2'} ${isActive ? 'bg-blue-100 text-ink' : 'text-ink/90 hover:bg-subtle hover:text-ink'}`}>
                {({ isActive }) => (
                  <>
                    {isActive && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-cta" />}
                    <I aria-hidden="true" size={17} className={`flex-none ${isActive ? 'text-accent' : ''}`} />
                    {compacto ? <span className="sr-only">{it.label}</span> : <span className="min-w-0 flex-1 leading-snug">{it.label}</span>}
                    {it.id === 'carrito' && resumen.nLineas > 0 && <span className={`grid min-w-5 place-items-center rounded-full bg-cta px-1.5 text-[11px] font-bold leading-5 text-cta-fg ${compacto ? 'absolute -right-0.5 -top-0.5' : ''}`}>{resumen.nLineas}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
