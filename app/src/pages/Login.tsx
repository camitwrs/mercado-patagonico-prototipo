import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import Logo from '../components/Logo';
import { CREDENCIALES_DEMO, useAuth } from '../auth/AuthContext';
import { loginSceneSVG } from '@landing/lib/scene-login.js';

// La landing vive fuera de la SPA: es un enlace normal, no una ruta de React Router.
const LANDING = import.meta.env.VITE_LANDING_URL || '/';

export default function Login() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = (location.state as { desde?: string } | null)?.desde ?? '/marketplace';
  const [user, setUser] = useState(CREDENCIALES_DEMO.usuario);
  const [clave, setClave] = useState(CREDENCIALES_DEMO.clave);
  const [error, setError] = useState(false);

  useEffect(() => { document.title = 'Iniciar sesión · Mercado Patagónico'; }, []);

  if (usuario) return <Navigate to={destino} replace />;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !clave.trim()) { setError(true); return; }
    entrar(user);
    navigate(destino, { replace: true });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca: paisaje propio del login (distinto al hero de la landing). */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-band p-12 lg:flex">
        <a href={LANDING} aria-label="Volver al sitio de Mercado Patagónico" className="w-fit"><Logo /></a>
        <div className="my-auto max-w-[520px] py-8">
          <p className="kick">Plataforma de abastecimiento hotelero y gastronómico</p>
          <h1 className="mt-4 text-[44px] font-extrabold leading-[1.08] text-ink">
            Todo lo que el sur <span className="text-sky">debería tener</span>, resuelto desde un solo lugar.
          </h1>
        </div>
        <div className="-mx-12 -mb-12 h-[52vh] min-h-[320px] shrink-0 [&>svg]:h-full [&>svg]:w-full" aria-hidden="true" inert dangerouslySetInnerHTML={{ __html: loginSceneSVG(!matchMedia('(prefers-reduced-motion: reduce)').matches) }} />
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <form onSubmit={enviar} noValidate className="flex w-full max-w-[420px] flex-col gap-6">
          <a href={LANDING} aria-label="Volver al sitio de Mercado Patagónico" className="w-fit lg:hidden"><Logo /></a>
          <a href={LANDING} className="inline-flex min-h-6 w-fit items-center gap-1.5 text-[15px] font-semibold text-accent underline-offset-4 hover:underline"><LuArrowLeft aria-hidden="true" size={16} /> Volver al sitio</a>
          <div>
            <h2 className="text-[34px] font-extrabold leading-[1.05]">Ingresa a tu cuenta</h2>
            <p className="mt-3 text-[16px] text-muted">Tu usuario lo crea un administrador de nuestro equipo.</p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="field-label">Usuario</span>
            <input className="field-input" autoComplete="username" value={user} onChange={(e) => { setUser(e.target.value); setError(false); }} aria-invalid={error && !user.trim()} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="field-label">Contraseña</span>
            <input className="field-input" type="password" autoComplete="current-password" value={clave} onChange={(e) => { setClave(e.target.value); setError(false); }} aria-invalid={error && !clave.trim()} />
          </label>
          {error && <p role="alert" className="text-[14px] text-negative">Ingresa tu usuario y contraseña.</p>}

          <button type="submit" className="btn btn-cta btn-lg w-full">Iniciar sesión</button>

          <p className="border-t border-line pt-5 font-mono text-[12px] leading-relaxed text-muted">
            Prototipo: cualquier usuario ingresa. Datos de demostración precargados: <b className="text-ink">{CREDENCIALES_DEMO.usuario}</b> / <b className="text-ink">{CREDENCIALES_DEMO.clave}</b>.
          </p>
        </form>
      </main>
    </div>
  );
}
