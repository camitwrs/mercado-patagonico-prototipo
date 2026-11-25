import { logoIconSVG } from '@landing/lib/art.js';

// Logo completo (isotipo + nombre), igual que el de la landing. dark = para fondos oscuros.
// compacto: en pantallas muy angostas se muestra solo el isotipo (el nombre queda para lectores de pantalla).
export default function Logo({ dark = false, className = '', compacto = false }: { dark?: boolean; className?: string; compacto?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="block leading-[0]" dangerouslySetInnerHTML={{ __html: logoIconSVG(76, dark) }} />
      <span className={`${compacto ? 'sr-only min-[480px]:not-sr-only min-[480px]:flex' : 'flex'} flex-col leading-none ${dark ? 'text-white' : 'text-ink'}`}>
        <span className="font-mono text-[10px] font-medium tracking-[0.42em]">MERCADO</span>
        <b className="mt-0.5 font-display text-[20px] font-extrabold tracking-[-0.01em]">PATAGÓNICO</b>
      </span>
    </span>
  );
}
