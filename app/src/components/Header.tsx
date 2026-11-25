import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuBell, LuChevronDown, LuMoon, LuSun, LuCircleHelp, LuLogOut, LuMenu, LuShoppingCart } from 'react-icons/lu';
import Logo from './Logo';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../state/CartContext';
import { useUI } from '../state/UIContext';
import { EMPRESA } from '../data/catalogo';

// Ayuda contextual por pantalla (equivale al "¿Cómo funciona esta página?" de la maqueta).
const AYUDA: Record<string, { titulo: string; pasos: string[] }> = {
  '/marketplace': { titulo: 'Inicio del Marketplace', pasos: ['Busca por código, descripción o marca.', 'O entra por familia de productos o por área de uso.', 'Los accesos rápidos filtran productos regionales y de cadena de frío.'] },
  '/marketplace/catalogo': { titulo: 'Catálogo', pasos: ['Filtra por familia, temperatura, origen o marca.', 'Abre un producto para ver su ficha técnica.', 'Elige la cantidad y agrégalo al carrito.'] },
  '/marketplace/carrito': { titulo: 'Carrito', pasos: ['Ajusta cantidades y fechas de cada producto.', 'Usa "Misma fecha para todas" para ahorrar tiempo.', 'Cuando esté listo, continúa para confirmar la solicitud.'] },
  '/marketplace/confirmar': { titulo: 'Confirmar solicitud', pasos: ['Elige el establecimiento y la fecha requerida.', 'Indica el tipo de factura.', 'Genera la solicitud: Mercado Patagónico te enviará la cotización.'] },
};

// Notificaciones: aún no existen pedidos que seguir, así que muestra qué avisos llegarán.
function Notificaciones() {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [abierto]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Notificaciones" aria-haspopup="dialog" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-colors hover:border-sky">
        <LuBell aria-hidden="true" size={18} />
      </button>
      {abierto && (
        <div role="dialog" aria-label="Notificaciones" className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] max-w-[calc(100vw-32px)] rounded-2xl border border-line bg-surface p-5 shadow-[0_14px_30px_rgb(0_37_68/0.16)]">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-[16px] font-bold">Notificaciones</p>
            <span className="rounded-full bg-band px-2 py-0.5 font-mono text-[11px] text-muted">Próximamente</span>
          </div>
          <p className="mt-2 text-[14px] text-muted">Te avisaremos aquí cuando:</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[14px]">
            <li>Tu solicitud pase a revisión</li>
            <li>Tengas una cotización lista</li>
            <li>Tu pedido salga a despacho</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Ayuda: panel que se queda abierto mientras se lee (un aviso temporal desaparece antes de terminar).
function Ayuda({ pathname }: { pathname: string }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ayuda = AYUDA[pathname] ?? AYUDA['/marketplace'];
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [abierto]);
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button type="button" aria-label="¿Cómo funciona esta página?" aria-haspopup="dialog" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-colors hover:border-sky">
        <LuCircleHelp aria-hidden="true" size={18} />
      </button>
      {abierto && (
        <div role="dialog" aria-label={`Ayuda: ${ayuda.titulo}`} className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] rounded-2xl border border-line bg-surface p-5 shadow-[0_14px_30px_rgb(0_37_68/0.16)]">
          <p className="kick">Ayuda</p>
          <p className="mt-2 font-display text-[17px] font-bold">{ayuda.titulo}</p>
          <ol className="mt-3 flex flex-col gap-2.5 text-[14px]">
            {ayuda.pasos.map((p, i) => (
              <li key={p} className="flex gap-3"><span aria-hidden="true" className="grid h-5 w-5 flex-none place-items-center rounded-full bg-blue-100 font-mono text-[11px] font-bold text-blue-700">{i + 1}</span><span>{p}</span></li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// Modo claro/oscuro: comparte la clave 'mp-theme' con la landing, así la elección viaja entre ambas.
function Tema() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.dataset.theme === 'dark');
  const alternar = () => {
    const nuevo = oscuro ? 'light' : 'dark';
    document.documentElement.dataset.theme = nuevo;
    try { localStorage.setItem('mp-theme', nuevo); } catch { /* sin almacenamiento */ }
    setOscuro(!oscuro);
  };
  return (
    <button type="button" onClick={alternar} aria-pressed={oscuro} aria-label="Modo oscuro" title={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-colors hover:border-sky">
      {oscuro ? <LuSun aria-hidden="true" size={18} /> : <LuMoon aria-hidden="true" size={18} />}
    </button>
  );
}

function MenuUsuario() {
  const { usuario, salir } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [abierto]);

  if (!usuario) return null;
  const iniciales = usuario.nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('');
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}
        className="flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface pl-1.5 pr-3 transition-colors hover:border-sky">
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-blue-900 font-display text-[12px] font-bold text-white">{iniciales}</span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[13px] font-semibold">{usuario.nombre}</span>
          <span className="block text-[11px] text-muted">{EMPRESA.nombre}</span>
        </span>
        <LuChevronDown aria-hidden="true" className={`transition-transform ${abierto ? 'rotate-180' : ''}`} size={16} />
      </button>
      {abierto && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_14px_30px_rgb(0_37_68/0.16)]">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[14px] font-semibold">{usuario.nombre}</p>
            <p className="text-[12px] text-muted">{usuario.cargo}</p>
            <p className="mt-1 font-mono text-[11px] text-faint">{EMPRESA.nombre} · {EMPRESA.rut}</p>
          </div>
          <button role="menuitem" type="button" onClick={() => { salir(); navigate('/login', { replace: true }); }}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-[14px] font-medium transition-colors hover:bg-subtle">
            <LuLogOut aria-hidden="true" size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({ abrirMenu }: { abrirMenu: () => void }) {
  const { resumen, estado } = useCart();
  const { setCarritoAbierto } = useUI();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button type="button" aria-label="Abrir menú" onClick={abrirMenu} className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-full border border-line bg-surface lg:hidden"><LuMenu aria-hidden="true" size={19} /></button>
        <Link to="/marketplace" aria-label="Mercado Patagónico, inicio" className="shrink-0"><Logo compacto /></Link>

        <div className="ml-auto flex min-w-0 items-center gap-2">

          <button type="button" aria-label={`Abrir carrito, ${resumen.nLineas === 1 ? '1 producto' : `${resumen.nLineas} productos`}`} onClick={() => setCarritoAbierto(true)} title="Carrito" className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-colors hover:border-sky">
            <LuShoppingCart aria-hidden="true" size={18} />
            {resumen.nLineas > 0 && (
              <span key={estado.pulso} className="badge-pop absolute -right-1.5 -top-1.5 grid min-w-[22px] place-items-center rounded-full border-2 border-page bg-cta px-1 text-[11px] font-bold leading-[18px] text-cta-fg">{resumen.nLineas}</span>
            )}
          </button>

          <Tema />

          <Notificaciones />

          <Ayuda pathname={pathname} />

          <MenuUsuario />
        </div>
      </div>

    </header>
  );
}
