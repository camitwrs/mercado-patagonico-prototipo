import { useRef } from 'react';
import { useCart } from '../state/CartContext';
import { useToast } from '../state/ToastContext';
import { useUI } from '../state/UIContext';
import { useModal } from '../lib/useModal';

// Confirmación antes de vaciar el carrito (acción que no se puede deshacer).
export default function ConfirmarVaciar() {
  const { pidiendoVaciar, setPidiendoVaciar } = useUI();
  if (!pidiendoVaciar) return null;
  return <Dialogo cerrar={() => setPidiendoVaciar(false)} />;
}

function Dialogo({ cerrar }: { cerrar: () => void }) {
  const { vaciar } = useCart();
  const { setCarritoAbierto } = useUI();
  const aviso = useToast();
  const caja = useRef<HTMLDivElement>(null);
  useModal(caja, cerrar);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-blue-950/55 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div ref={caja} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="vaciar-t" aria-describedby="vaciar-d" className="w-full max-w-[440px] rounded-3xl bg-surface p-7 shadow-[0_24px_64px_rgb(0_37_68/0.3)] outline-none">
        <h2 id="vaciar-t" className="text-[22px] font-bold">¿Vaciar el carrito?</h2>
        <p id="vaciar-d" className="mb-6 mt-2 text-[15px] text-muted">Se quitarán todos los productos. Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-2.5">
          <button type="button" className="btn btn-o" onClick={cerrar}>Cancelar</button>
          <button type="button" className="btn !bg-negative text-white" onClick={() => { vaciar(); setCarritoAbierto(false); cerrar(); aviso('Carrito vaciado'); }}>Vaciar carrito</button>
        </div>
      </div>
    </div>
  );
}
