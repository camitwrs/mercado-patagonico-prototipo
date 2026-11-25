import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

// Avisos breves (equivalente al `toast` de la maqueta), con el mismo estilo que el de la landing.
type Aviso = { id: number; titulo: string; detalle?: string; tipo: 'ok' | 'info' };
type Ctx = { aviso: (titulo: string, detalle?: string, tipo?: Aviso['tipo']) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const n = useRef(0);
  const aviso = useCallback((titulo: string, detalle?: string, tipo: Aviso['tipo'] = 'ok') => {
    const id = ++n.current;
    setAvisos((a) => [...a.slice(-2), { id, titulo, detalle, tipo }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3200);
  }, []);
  const valor = useMemo(() => ({ aviso }), [aviso]);
  return (
    <ToastCtx.Provider value={valor}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
        {avisos.map((a) => (
          <div key={a.id} className="toast-in pointer-events-auto flex max-w-[460px] items-start gap-3 rounded-2xl bg-blue-900 px-5 py-3 text-white shadow-[0_14px_30px_rgb(0_37_68/0.28)]">
            <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${a.tipo === 'ok' ? 'bg-teal-500' : 'bg-blue-300'}`} />
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold">{a.titulo}</span>
              {a.detalle && <span className="block text-[13px] text-white/80">{a.detalle}</span>}
            </span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const c = useContext(ToastCtx);
  if (!c) throw new Error('useToast fuera de ToastProvider');
  return c.aviso;
};
