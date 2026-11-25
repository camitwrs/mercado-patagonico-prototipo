// Extrae los datos de ejemplo del Marketplace desde la maqueta aprobada (sin retipearlos) a app/src/data/maqueta.json.
// Uso: node app/scripts/extract-maqueta.cjs
// Los campos internos del equipo (costos, márgenes, proveedores, stock, auditoría) NO se exportan:
// el cliente nunca debe recibirlos en la app.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
const src = path.join(root, 'documentacion', 'maqueta', 'Maqueta-Mercado-Patagonico-v1.html');
const out = path.join(root, 'app', 'src', 'data', 'maqueta.json');

const html = fs.readFileSync(src, 'utf8');
const ini = html.indexOf('<script>', html.indexOf('<body')) + '<script>'.length;
const fin = html.lastIndexOf('</script>');
const script = html.slice(ini, fin);

// Solo la parte de datos: todo lo anterior al estado de la interfaz.
const corte = script.indexOf('const estado = {');
if (corte < 0) throw new Error('No se encontró el inicio del estado en la maqueta');
const nombres = ['EMPRESA', 'VENDEDOR', 'ESTABLECIMIENTOS', 'FAMILIAS', 'SEGMENTOS', 'TIPOS_FACTURA', 'CENTROS_COSTO', 'PRODUCTOS', 'ESTADOS_SOLICITUD', 'HOY_ISO'];
const datos = vm.runInNewContext(`${script.slice(0, corte)}\n;({${nombres.join(',')}})`, { document: {}, window: {}, location: { hash: '' }, console }, { timeout: 5000 });

const INTERNOS = ['provPri', 'provAlt', 'skuProvPri', 'skuProvAlt', 'moqCompra', 'monedaCompra', 'costoCompra', 'costoFlete', 'costoOtros', 'costoBodega', 'margen', 'margenMin', 'descMax', 'canal', 'demanda', 'stockSeg', 'reorden', 'loteOpt', 'ubicacion', 'stock', 'proxVenc', 'fechaAltaMaestro', 'solicitanteAlta', 'aprobador', 'fechaAct', 'actualizadoPor', 'versionReg', 'motivoCambio', 'estadoVal', 'duplicado', 'observ', 'abc', 'precio'];
const productos = datos.PRODUCTOS.map((p) => {
  const limpio = { ...p };
  for (const k of INTERNOS) delete limpio[k];
  return limpio;
});

const resultado = {
  empresa: datos.EMPRESA,
  vendedor: datos.VENDEDOR,
  establecimientos: datos.ESTABLECIMIENTOS,
  familias: datos.FAMILIAS,
  segmentos: datos.SEGMENTOS,
  tiposFactura: datos.TIPOS_FACTURA,
  centrosCosto: datos.CENTROS_COSTO,
  productos,
  estadosSolicitud: datos.ESTADOS_SOLICITUD,
  hoyIso: datos.HOY_ISO,
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(resultado, null, 1));
console.log(`✓ ${productos.length} productos, ${resultado.familias.length} familias, ${resultado.establecimientos.length} establecimientos → ${path.relative(root, out)}`);
