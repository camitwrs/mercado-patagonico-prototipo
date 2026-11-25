import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Estado de interfaz compartido por el marco de la app: panel lateral del carrito y confirmación de vaciar.
type Ctx = { carritoAbierto: boolean; setCarritoAbierto: (v: boolean) => void; pidiendoVaciar: boolean; setPidiendoVaciar: (v: boolean) => void };
const UICtx = createContext<Ctx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [pidiendoVaciar, setPidiendoVaciar] = useState(false);
  const valor = useMemo(() => ({ carritoAbierto, setCarritoAbierto, pidiendoVaciar, setPidiendoVaciar }), [carritoAbierto, pidiendoVaciar]);
  return <UICtx.Provider value={valor}>{children}</UICtx.Provider>;
}

export const useUI = () => {
  const c = useContext(UICtx);
  if (!c) throw new Error('useUI fuera de UIProvider');
  return c;
};
