import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LuPanelLeftClose, LuPanelLeftOpen, LuX } from 'react-icons/lu';
import Header from './Header';
import Sidebar from './Sidebar';
import FichaModal from './FichaModal';
import CarritoPanel from './CarritoPanel';
import ConfirmarVaciar from './ConfirmarVaciar';
import { UIProvider } from '../state/UIContext';
import { useModal } from '../lib/useModal';

const MIGAS: Record<string, string[]> = {
  '/marketplace': [],
  '/marketplace/catalogo': ['Catálogo'],
  '/marketplace/carrito': ['Carrito'],
  '/marketplace/confirmar': ['Carrito', 'Confirmar solicitud'],
};

const TITULOS: Record<string, string> = {
  '/marketplace': 'Inicio',
  '/marketplace/catalogo': 'Catálogo',
  '/marketplace/carrito': 'Carrito',
  '/marketplace/confirmar': 'Confirmar solicitud',
};

// Menú lateral en pantallas angostas: foco atrapado, Esc cierra, el foco vuelve al botón que lo abrió.
function CajonMenu({ cerrar }: { cerrar: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  useModal(caja, cerrar);
  return (
    <div className="fixed inset-0 z-[70] flex bg-blue-950/50 lg:hidden" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div ref={caja} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Menú" className="flex h-full w-[286px] max-w-[85vw] flex-col overflow-y-auto bg-page shadow-[8px_0_30px_rgb(0_0_0/0.2)] outline-none">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-display text-[15px] font-bold">Menú</span>
          <button type="button" aria-label="Cerrar menú" onClick={cerrar} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line bg-surface"><LuX aria-hidden="true" size={18} /></button>
        </div>
        <Sidebar alNavegar={cerrar} />
      </div>
    </div>
  );
}

// Marco de la app: encabezado fijo, menú lateral (cajón en pantallas angostas), migas y contenido.
function Marco() {
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const migas = MIGAS[pathname] ?? [];
  const [compacto, setCompacto] = useState(() => { try { return localStorage.getItem('mp-sidebar') === 'compacto'; } catch { return false; } });
  const alternar = () => setCompacto((v) => { const n = !v; try { localStorage.setItem('mp-sidebar', n ? 'compacto' : 'abierto'); } catch { /* sin almacenamiento */ } return n; });
  const principal = useRef<HTMLElement>(null);
  const primera = useRef(true);

  // En una SPA el lector de pantalla no se entera de que cambió la página: se actualiza el título y se lleva el foco al contenido.
  useEffect(() => {
    document.title = `${TITULOS[pathname] ?? 'Marketplace'} · Mercado Patagónico`;
    if (primera.current) { primera.current = false; return; }
    principal.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="absolute left-4 top-[-60px] z-[200] rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-fg focus:top-3">Saltar al contenido</a>
      <Header abrirMenu={() => setMenu(true)} />
      <div className="flex flex-1">
        <aside className={`sticky top-16 hidden h-[calc(100vh-64px)] flex-none flex-col border-r border-line transition-[width] duration-200 motion-reduce:transition-none lg:flex ${compacto ? 'w-[76px]' : 'w-[292px]'}`}>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"><Sidebar compacto={compacto} /></div>
          <div className={`border-t border-line p-3 ${compacto ? 'flex justify-center' : ''}`}>
            <button type="button" onClick={alternar} aria-expanded={!compacto} aria-label={compacto ? 'Expandir menú lateral' : 'Contraer menú lateral'} title={compacto ? 'Expandir menú' : undefined}
              className={`flex h-11 cursor-pointer items-center gap-3 rounded-lg text-[14px] font-medium text-muted transition-colors hover:bg-subtle hover:text-ink ${compacto ? 'w-11 justify-center' : 'w-full px-3'}`}>
              {compacto ? <LuPanelLeftOpen aria-hidden="true" size={19} /> : <><LuPanelLeftClose aria-hidden="true" size={19} /> Contraer menú</>}
            </button>
          </div>
        </aside>
        <main id="contenido" ref={principal} tabIndex={-1} className="min-w-0 flex-1 px-6 pb-20 pt-6 outline-none">
          <div className="mx-auto w-full max-w-[1200px]">
            {migas.length > 0 && (
              <nav aria-label="Migas de pan" className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[12px] tracking-wide text-muted">
                <Link to="/marketplace" className="inline-flex min-h-6 items-center hover:text-ink hover:underline">Marketplace</Link>
                {migas.map((m, i) => (
                  <span key={m} className="flex items-center gap-2"><span aria-hidden="true">/</span><span className={i === migas.length - 1 ? 'text-ink' : ''} aria-current={i === migas.length - 1 ? 'page' : undefined}>{m}</span></span>
                ))}
              </nav>
            )}
            <Outlet />
          </div>
        </main>
      </div>

      <FichaModal />
      <CarritoPanel />
      <ConfirmarVaciar />

      {menu && <CajonMenu cerrar={() => setMenu(false)} />}
    </div>
  );
}

export default function AppLayout() {
  return <UIProvider><Marco /></UIProvider>;
}
