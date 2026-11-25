import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

// La ficha de producto abierta vive en la URL (?ficha=SKU), así se puede compartir y el botón Atrás la cierra.
export function useFicha() {
  const [params, setParams] = useSearchParams();
  const sku = params.get('ficha') || '';
  const abrir = useCallback((s: string) => { const q = new URLSearchParams(params); q.set('ficha', s); setParams(q); }, [params, setParams]);
  const cerrar = useCallback(() => { const q = new URLSearchParams(params); q.delete('ficha'); setParams(q, { replace: true }); }, [params, setParams]);
  return { sku, abrir, cerrar };
}
