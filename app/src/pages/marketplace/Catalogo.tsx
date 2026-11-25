import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuLayoutGrid, LuList, LuListTree, LuSearch, LuSlidersHorizontal, LuX } from 'react-icons/lu';
import { familia, plural } from '../../data/catalogo';
import { ETIQUETA_FACETA, FACETAS, TAMANOS, arbol, baseFiltrada, escribirParams, leerParams, pasaFacetas, sinFacetas, type Faceta, type ParamsCatalogo } from '../../lib/catalogoQuery';
import ProductoCard from '../../components/catalogo/ProductoCard';
import TablaLista from '../../components/catalogo/TablaLista';
import PanelFacetas from '../../components/catalogo/PanelFacetas';
import CajonFiltros from '../../components/catalogo/CajonFiltros';
import MenuCategorias from '../../components/catalogo/MenuCategorias';

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const p = useMemo(() => leerParams(params), [params]);
  const [menuCat, setMenuCat] = useState(false);
  const [cajon, setCajon] = useState(false);
  const [panel, setPanel] = useState(true);
  const [texto, setTexto] = useState(p.q);

  // Cambiar cualquier filtro vuelve a la página 1.
  const ir = useCallback((cambios: Partial<ParamsCatalogo>, reemplazar = false) => {
    setParams(new URLSearchParams(escribirParams({ ...p, pag: 1, ...cambios })), { replace: reemplazar });
  }, [p, setParams]);

  // Búsqueda con retardo: el texto se escribe en la URL a los 280 ms.
  useEffect(() => { setTexto(p.q); }, [p.q]);
  useEffect(() => {
    if (texto.trim() === p.q) return;
    const t = setTimeout(() => ir({ q: texto.trim() }, true), 280);
    return () => clearTimeout(t);
  }, [texto, p.q, ir]);

  const alternar = (f: Faceta, v: string) => ir({ [f]: p[f].includes(v) ? p[f].filter((x) => x !== v) : [...p[f], v] } as Partial<ParamsCatalogo>, true);

  const fam = familia(p.fam);
  const famArbol = fam ? arbol().find((f) => f.codigo === p.fam) : undefined;
  const catArbol = famArbol && p.cat ? famArbol.cats.find((c) => c.nombre === p.cat) : undefined;

  const productos = useMemo(() => baseFiltrada(p).filter((x) => pasaFacetas(x, p)), [p]);
  const nFacetas = FACETAS.reduce((a, k) => a + p[k].length, 0);
  const hayFiltros = nFacetas > 0 || !!p.q || !!p.fam;
  const titulo = p.sub || p.cat || (fam ? fam.nombre : p.q ? `Resultados para “${p.q}”` : p.seg.length === 1 && !p.temp.length ? p.seg[0] : 'Todos los productos');

  const paginas = Math.max(1, Math.ceil(productos.length / p.tam));
  const pag = Math.min(p.pag, paginas);
  const visibles = productos.slice((pag - 1) * p.tam, pag * p.tam);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [p.pag, p.tam]);

  const chips: [string, string, () => void][] = [
    ...(p.q ? [['Búsqueda', p.q, () => ir({ q: '' }, true)] as [string, string, () => void]] : []),
    ...FACETAS.flatMap((k) => p[k].map((v): [string, string, () => void] => [ETIQUETA_FACETA[k], v, () => alternar(k, v)])),
  ];
  const atras = () => {
    if (p.sub) ir({ sub: '' }); else if (p.cat) ir({ cat: '', sub: '' }); else if (p.fam) ir({ fam: '', cat: '', sub: '' }); else navigate('/marketplace');
  };
  const chipHijo = (etiqueta: string, n: number, activo: boolean, cambios: Partial<ParamsCatalogo>) => (
    <button key={etiqueta} type="button" aria-pressed={activo} onClick={() => ir(cambios)}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${activo ? 'border-blue-900 bg-blue-900 text-white' : 'border-line bg-surface hover:border-teal'}`}>
      {etiqueta}<span className={`rounded-full px-1.5 font-mono text-[11px] ${activo ? 'bg-white/20' : 'bg-band text-muted'}`}>{n}</span>
    </button>
  );

  const aside = fam && (panel ? (
    <aside aria-label="Filtros" className="sticky top-[84px] flex max-h-[calc(100vh-110px)] w-[240px] flex-none flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2 font-display text-[14px] font-bold"><LuSlidersHorizontal aria-hidden="true" size={15} className="text-accent" /> Filtros</span>
        <span className="flex items-center gap-2.5">
          {nFacetas > 0 && <button type="button" className="min-h-6 cursor-pointer text-[12px] font-semibold text-accent hover:underline" onClick={() => ir(sinFacetas, true)}>Limpiar</button>}
          <button type="button" aria-label="Ocultar filtros" onClick={() => setPanel(false)} className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-line hover:bg-subtle"><LuChevronLeft aria-hidden="true" size={14} /></button>
        </span>
      </div>
      <div className="min-h-0 overflow-y-auto"><PanelFacetas p={p} alternar={alternar} /></div>
    </aside>
  ) : (
    <aside aria-label="Filtros" className="sticky top-[84px] flex w-11 flex-none flex-col items-center gap-3 rounded-xl border border-line bg-surface py-3">
      <button type="button" aria-label="Mostrar filtros" onClick={() => setPanel(true)} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line hover:bg-subtle"><LuChevronRight aria-hidden="true" size={14} /></button>
      <LuSlidersHorizontal aria-hidden="true" size={16} className="text-accent" />
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted [writing-mode:vertical-rl] rotate-180">Filtros</span>
    </aside>
  ));

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-3">
        <button type="button" aria-label="Volver" onClick={atras} className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-full border border-line bg-surface transition-colors hover:border-teal"><LuChevronLeft aria-hidden="true" size={18} /></button>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="min-w-0 break-words text-[clamp(24px,2.5vw,32px)] font-extrabold leading-tight">{titulo}</h1>
          <span className="font-mono text-[13px] text-muted">{plural(productos.length, 'producto', 'productos')}</span>
        </div>
      </div>

      <div className="relative z-30 mb-5 rounded-2xl border border-line bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-none">
            <button type="button" aria-expanded={menuCat} onClick={() => setMenuCat((v) => !v)} className={`btn !h-10 !gap-2 !px-4 !py-0 !text-[14px] ${menuCat ? 'btn-p' : 'btn-o'}`}>
              <LuListTree aria-hidden="true" size={16} /> Categorías <LuChevronDown aria-hidden="true" size={14} className={`transition-transform ${menuCat ? 'rotate-180' : ''}`} />
            </button>
            {menuCat && <MenuCategorias famActual={p.fam} cerrar={() => setMenuCat(false)} ir={(d) => { setMenuCat(false); ir({ fam: d.fam, cat: d.cat ?? '', sub: d.sub ?? '', ...sinFacetas }); }} />}
          </div>
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Buscar por código, descripción o marca</span>
            <LuSearch aria-hidden="true" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar por código, descripción o marca"
              className="h-10 w-full rounded-full border border-line bg-page pl-10 pr-4 text-[14px] outline-none transition-[border-color,box-shadow] focus:border-cta focus:shadow-[0_0_0_3px_rgb(242_107_33/0.2)]" />
          </label>
          {!p.fam && (
            <button type="button" onClick={() => setCajon(true)} className="btn btn-o !h-10 !gap-2 !px-4 !py-0 !text-[14px]">
              <LuSlidersHorizontal aria-hidden="true" size={15} /> Más filtros
              {nFacetas > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-cta px-1.5 text-[11px] font-bold leading-5 text-cta-fg">{nFacetas}</span>}
            </button>
          )}
          <div role="group" aria-label="Tipo de vista" className="flex h-10 flex-none items-center gap-0.5 rounded-full bg-band p-[3px]">
            {([['grilla', LuLayoutGrid, 'Vista en grilla'], ['lista', LuList, 'Vista en lista']] as const).map(([v, I, t]) => (
              <button key={v} type="button" title={t} aria-label={t} aria-pressed={p.vista === v} onClick={() => ir({ vista: v }, true)}
                className={`grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-full transition-colors ${p.vista === v ? 'bg-surface shadow-[0_1px_2px_rgb(0_37_68/0.12)]' : 'text-muted hover:text-ink'}`}><I aria-hidden="true" size={16} /></button>
            ))}
          </div>
        </div>

        {fam && famArbol && (
          <div className="mt-3 flex flex-col gap-2.5 border-t border-line pt-3">
            <div className="flex flex-wrap items-center gap-2 text-[14px] font-semibold">
              <button type="button" className="min-h-6 cursor-pointer text-accent hover:underline" onClick={() => ir({ fam: '', cat: '', sub: '', ...sinFacetas })}>Todas las familias</button>
              <LuChevronRight aria-hidden="true" size={13} className="text-faint" />
              <button type="button" className={`min-h-6 cursor-pointer ${p.cat ? 'text-accent hover:underline' : ''}`} onClick={() => ir({ cat: '', sub: '' })}>{fam.nombre}</button>
              {p.cat && <><LuChevronRight aria-hidden="true" size={13} className="text-faint" /><button type="button" className={`min-h-6 cursor-pointer ${p.sub ? 'text-accent hover:underline' : ''}`} onClick={() => ir({ sub: '' })}>{p.cat}</button></>}
              {p.sub && <><LuChevronRight aria-hidden="true" size={13} className="text-faint" /><span>{p.sub}</span></>}
            </div>
            {!p.cat && <div className="flex flex-wrap items-center gap-2"><span className="text-[12px] text-muted">Categorías</span>{chipHijo('Toda la familia', famArbol.cantidad, true, { cat: '', sub: '' })}{famArbol.cats.map((c) => chipHijo(c.nombre, c.cantidad, false, { cat: c.nombre, sub: '' }))}</div>}
            {catArbol && catArbol.subs.length > 1 && <div className="flex flex-wrap items-center gap-2"><span className="text-[12px] text-muted">Subcategorías</span>{chipHijo('Toda la categoría', catArbol.cantidad, !p.sub, { sub: '' })}{catArbol.subs.map((s) => chipHijo(s.nombre, s.cantidad, p.sub === s.nombre, { sub: s.nombre }))}</div>}
          </div>
        )}

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            {chips.map(([e, v, quitar]) => (
              <span key={e + v} className="inline-flex items-center gap-2 rounded-full bg-blue-100 py-1 pl-3 pr-1.5 text-[12px] font-semibold text-blue-700">
                <span className="font-medium text-muted">{e}:</span><span className="max-w-[170px] truncate">{v}</span>
                <button type="button" aria-label={`Quitar filtro ${e}: ${v}`} onClick={quitar} className="grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-blue-700/15 hover:bg-blue-700/25"><LuX aria-hidden="true" size={12} /></button>
              </span>
            ))}
            {hayFiltros && <button type="button" className="btn btn-o ml-auto !px-3.5 !py-1.5 !text-[13px]" onClick={() => setParams(new URLSearchParams(p.vista === 'lista' ? 'vista=lista' : ''))}>Limpiar todo</button>}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-5">
        {aside}
        <div className="min-w-0 flex-[1_1_520px]">
          {productos.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface px-6 py-14 text-center">
              <p className="font-display text-[18px] font-bold">Sin resultados</p>
              <p className="mt-1 text-[14px] text-muted">No encontramos productos con estos filtros.</p>
            </div>
          ) : p.vista === 'lista' ? <TablaLista productos={visibles} /> : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5">{visibles.map((x) => <ProductoCard key={x.sku} p={x} />)}</div>
          )}

          {productos.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-4 py-3">
              <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-muted">
                <span>Mostrar</span>
                <div role="group" aria-label="Productos por página" className="flex items-center gap-1 rounded-full bg-band p-[3px]">
                  {TAMANOS.map((n) => <button key={n} type="button" aria-pressed={n === p.tam} onClick={() => ir({ tam: n }, true)} className={`h-7 min-w-9 cursor-pointer rounded-full px-2 text-[12px] font-semibold ${n === p.tam ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(0_37_68/0.12)]' : 'text-muted hover:text-ink'}`}>{n}</button>)}
                </div>
                <span>por página</span>
                <span className="mx-1 hidden h-4 w-px bg-line sm:block" />
                <span><strong className="font-semibold text-ink">{(pag - 1) * p.tam + 1}–{Math.min(pag * p.tam, productos.length)}</strong> de {plural(productos.length, 'producto', 'productos')}</span>
              </div>
              {paginas > 1 && (
                <nav aria-label="Paginación" className="flex items-center gap-1.5">
                  <button type="button" aria-label="Página anterior" disabled={pag <= 1} onClick={() => ir({ pag: pag - 1 }, true)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line disabled:cursor-not-allowed disabled:opacity-40"><LuChevronLeft aria-hidden="true" size={15} /></button>
                  {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
                    <button key={n} type="button" aria-label={`Página ${n}`} aria-current={n === pag ? 'page' : undefined} onClick={() => ir({ pag: n }, true)}
                      className={`grid h-9 min-w-9 cursor-pointer place-items-center rounded-full border px-2 text-[14px] font-semibold ${n === pag ? 'border-blue-900 bg-blue-900 text-white' : 'border-line hover:border-teal'}`}>{n}</button>
                  ))}
                  <button type="button" aria-label="Página siguiente" disabled={pag >= paginas} onClick={() => ir({ pag: pag + 1 }, true)} className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line disabled:cursor-not-allowed disabled:opacity-40"><LuChevronRight aria-hidden="true" size={15} /></button>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>

      {cajon && <CajonFiltros p={p} total={productos.length} alternar={alternar} cerrar={() => setCajon(false)} />}
    </div>
  );
}
