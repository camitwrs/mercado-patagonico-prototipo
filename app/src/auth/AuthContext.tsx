import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

// Sesión simulada del prototipo: cualquier usuario ingresa. Sin servidor.
export type Usuario = { usuario: string; nombre: string; cargo: string; establecimiento: string };

const KEY = 'mp-session';
const DEMO: Usuario = { usuario: 'msoto', nombre: 'María José Soto', cargo: 'Jefa de compras', establecimiento: 'Hotel Costa Austral' };

const leer = (): Usuario | null => {
  try { const v = localStorage.getItem(KEY); return v ? (JSON.parse(v) as Usuario) : null; } catch { return null; }
};

type Ctx = { usuario: Usuario | null; entrar: (usuario: string) => void; salir: () => void };
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leer);
  const entrar = useCallback((u: string) => {
    const nuevo = { ...DEMO, usuario: u.trim() || DEMO.usuario };
    try { localStorage.setItem(KEY, JSON.stringify(nuevo)); } catch { /* sin almacenamiento */ }
    setUsuario(nuevo);
  }, []);
  const salir = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* sin almacenamiento */ }
    setUsuario(null);
  }, []);
  const valor = useMemo(() => ({ usuario, entrar, salir }), [usuario, entrar, salir]);
  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth fuera de AuthProvider');
  return c;
};

export const CREDENCIALES_DEMO = { usuario: DEMO.usuario, clave: 'prototipo' };
