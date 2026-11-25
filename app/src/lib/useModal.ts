import { useEffect, useRef, type RefObject } from 'react';

// Comportamiento común de ventanas y cajones: foco al abrir, Tab que no se escapa, Esc para cerrar,
// y el foco vuelve al elemento que la abrió.
export function useModal(ref: RefObject<HTMLElement | null>, cerrar: () => void) {
  const alCerrar = useRef(cerrar);
  alCerrar.current = cerrar;
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    const enfocables = () => ref.current ? [...ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((e) => e.offsetParent !== null) : [];
    (enfocables()[0] ?? ref.current)?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); alCerrar.current(); return; }
      if (e.key !== 'Tab') return;
      const l = enfocables();
      if (!l.length) return;
      const primero = l[0], ultimo = l[l.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', tecla);
    const scroll = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', tecla); document.body.style.overflow = scroll; previo?.focus?.(); };
  }, [ref]);
}
