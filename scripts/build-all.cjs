// Construye la landing (Astro) y la app (React) y las deja en un solo sitio estático:
//   dist/        → landing
//   dist/app/    → app (Vite con base '/app/')
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const run = (cmd, cwd) => execSync(cmd, { cwd: path.join(root, cwd), stdio: 'inherit' });
const dist = path.join(root, 'dist');

// En producción el enlace "Ingresar" apunta a la app publicada junto a la landing.
// Para apuntar a otra URL (p. ej. la app real) define PUBLIC_APP_URL antes de construir.
process.env.PUBLIC_APP_URL = process.env.PUBLIC_APP_URL || '/app/login';

console.log('→ landing');
run('npm run build', 'landing');
console.log('→ app');
run('npm run build', 'app');

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'landing', 'dist'), dist, { recursive: true });
fs.cpSync(path.join(root, 'app', 'dist'), path.join(dist, 'app'), { recursive: true });

// La app es de una sola página: cada ruta interna debe devolver su index.html para que React Router la resuelva.
// Se dejan copias físicas por ruta (en vez de depender de una regla de redirección del hosting).
const rutasApp = ['login', 'marketplace', 'marketplace/catalogo', 'marketplace/carrito', 'marketplace/confirmar'];
const indiceApp = path.join(dist, 'app', 'index.html');
for (const ruta of rutasApp) {
  const carpeta = path.join(dist, 'app', ruta);
  fs.mkdirSync(carpeta, { recursive: true });
  fs.copyFileSync(indiceApp, path.join(carpeta, 'index.html'));
}

console.log('✓ sitio listo en', dist);
