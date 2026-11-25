import type { IconType } from 'react-icons';
import { LuApple, LuArmchair, LuConciergeBell, LuEllipsis, LuLeaf, LuMinus, LuPackageOpen, LuPlus, LuShirt, LuSnowflake, LuSprayCan, LuThermometer, LuWine, LuWrench } from 'react-icons/lu';
import { origenDe } from '../data/catalogo';
import type { Producto } from '../data/types';

// Ícono de cada familia del maestro (la maqueta usa Font Awesome; aquí, el trazo fino de la landing).
const ICONOS_FAMILIA: Record<string, IconType> = {
  ALI: LuApple, ABA: LuWine, LIM: LuSprayCan, EQP: LuArmchair, TEX: LuShirt, MAN: LuWrench, EMB: LuPackageOpen, SER: LuConciergeBell, OTR: LuEllipsis,
};
export function IconoFamilia({ codigo, size = 20, className = '' }: { codigo: string; size?: number; className?: string }) {
  const I = ICONOS_FAMILIA[codigo] ?? LuEllipsis;
  return <I aria-hidden="true" size={size} className={className} />;
}

// Etiquetas de estado del producto: planas, sin sombra, con los colores de la paleta.
export function Etiqueta({ children, tono = 'azul', icono: I }: { children: React.ReactNode; tono?: 'azul' | 'verde' | 'rojo' | 'gris'; icono?: IconType }) {
  const t = { azul: 'bg-blue-100 text-blue-700', verde: 'bg-teal-100 text-teal-700', rojo: 'bg-orange-100 text-orange-600', gris: 'bg-band text-muted' }[tono];
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${t}`}>{I && <I aria-hidden="true" size={12} />}{children}</span>;
}

export function EtiquetasProducto({ p }: { p: Producto }) {
  return (
    <>
      {p.estado !== 'Activo' && <Etiqueta tono="rojo">{p.estado.toUpperCase()}</Etiqueta>}
      {p.temp === 'Refrigerado' && <Etiqueta icono={LuThermometer}>Refrigerado {p.tmin}–{p.tmax} °C</Etiqueta>}
      {p.temp === 'Congelado' && <Etiqueta icono={LuSnowflake}>Congelado ≤ {p.tmax} °C</Etiqueta>}
      {p.region === 'Magallanes' && <Etiqueta tono="verde" icono={LuLeaf}>Regional</Etiqueta>}
      {p.tipo !== 'Producto' && <Etiqueta tono="gris">{p.tipo.toUpperCase()}</Etiqueta>}
    </>
  );
}

// Selector de cantidad con − y +. El campo acepta números escritos a mano.
export function Stepper({ valor, onChange, etiqueta, grande = false }: { valor: number; onChange: (n: number) => void; etiqueta: string; grande?: boolean }) {
  const alto = grande ? 'h-11' : 'h-9';
  const boton = `${alto} ${grande ? 'w-9' : 'w-8'} grid place-items-center text-muted transition-colors hover:bg-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer`;
  return (
    <div className="inline-flex flex-none items-center overflow-hidden rounded-lg border border-line bg-surface" role="group" aria-label={etiqueta}>
      <button type="button" className={boton} aria-label="Disminuir cantidad" disabled={valor <= 1} onClick={() => onChange(valor - 1)}><LuMinus aria-hidden="true" size={14} /></button>
      <input inputMode="decimal" aria-label={`Cantidad: ${etiqueta}`} value={valor} onChange={(e) => onChange(Number(e.target.value.replace(',', '.')) || 1)}
        className={`${alto} ${grande ? 'w-14 text-[15px]' : 'w-9 text-[14px]'} min-w-0 border-x border-line bg-transparent p-0 text-center font-semibold text-ink focus:outline-none`} />
      <button type="button" className={boton} aria-label="Aumentar cantidad" onClick={() => onChange(valor + 1)}><LuPlus aria-hidden="true" size={14} /></button>
    </div>
  );
}

export { origenDe };
