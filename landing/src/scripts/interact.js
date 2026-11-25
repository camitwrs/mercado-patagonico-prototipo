// Interacciones de la landing.
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

// los SVG que solo decoran (sin rol ni nombre, sin controles dentro) se ocultan a lectores de pantalla
$$('svg:not([role]):not([aria-label]):not([aria-hidden])').forEach((s) => { if (!s.querySelector('[role], [tabindex]') && !s.closest('a, button')) s.setAttribute('aria-hidden', 'true'); });

// el logo vuelve al inicio (el menú es sticky, así que #top no desplaza la página)
$$('.nav-logo, .foot-logo').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
}));

// idioma y tema
const setLang = (l) => { root.dataset.lang = l; root.lang = l; store('mp-lang', l); };
$$('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => setLang(root.dataset.lang === 'es' ? 'en' : 'es')));
$$('[data-set-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.setLang)));
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = t; store('mp-theme', t);
}));

// aviso breve
const toast = $('#toast');
let toastT;
function say(es, en) {
  if (!toast) return;
  toast.textContent = root.dataset.lang === 'en' ? en : es;
  toast.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toast.classList.remove('show'), 2600);
}

// aparición al hacer scroll
const rv = $$('[data-reveal]');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  rv.forEach((el) => io.observe(el));
} else rv.forEach((el) => el.classList.add('in'));

// elementos que se activan al entrar en pantalla
const lv = $$('[data-live]');
if ('IntersectionObserver' in window) {
  const io2 = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('live', e.isIntersecting)), { threshold: 0.35 });
  lv.forEach((el) => io2.observe(el));
} else lv.forEach((el) => el.classList.add('live'));

// menú móvil
const nav = $('.nav');
const btn = $('[data-menu-btn]');
if (nav && btn) {
  const close = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o)); });
  $$('.nav a').forEach((a) => a.addEventListener('click', close));
}

// sección activa en el menú
const spy = $$('[data-spy]');
if (spy.length && 'IntersectionObserver' in window) {
  const map = new Map(spy.map((a) => [a.dataset.spy, a]));
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { spy.forEach((a) => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  // contacto y problema no tienen enlace propio: al entrar apagan el resaltado anterior
  [...map.keys(), 'problema', 'contacto'].forEach((id) => { const s = document.getElementById(id); if (s) so.observe(s); });
}

// preguntas frecuentes (acordeón)
$$('.faq-item').forEach((item) => {
  const q = $('.faq-q', item);
  q.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    q.setAttribute('aria-expanded', String(open));
  });
});

// formulario de contacto (validación en el navegador; aún no envía datos)
$$('form[data-contact]').forEach((form) => {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = (f) => {
    const input = $('input, select', f);
    const v = input.value.trim();
    let ok = v !== '';
    if (ok && input.type === 'email') ok = email.test(v);
    if (ok && input.type === 'tel') ok = v.replace(/\D/g, '').length >= 7;
    return ok;
  };
  const check = (f) => {
    const ok = valid(f);
    f.classList.toggle('err', !ok);
    return ok;
  };
  const fields = $$('.field', form);

  // ruta del pedido: el camión avanza con cada dato válido y llega al enviar
  const trk = $('[data-track]');
  let done = 0;
  const sync = (sent) => {
    const n = fields.filter(valid).length;
    if (!trk) return;
    if (n > done) { trk.classList.remove('bump'); void trk.offsetWidth; trk.classList.add('bump'); }
    done = n;
    trk.style.setProperty('--p', sent ? 1 : n / fields.length);
    trk.classList.toggle('arrived', !!sent);
    const sel = $('#f-tipo', form);
    const name = sel && sel.value ? sel.value.split(' / ')[0].trim() : '';
    trk.classList.toggle('has-name', name !== '');
    $('[data-trk-name]', trk).textContent = name ? name + ' · Magallanes' : '';
    const es = ['Ya salió de Santiago.', 'Pasando por Puerto Montt.', 'Casi en Magallanes.', 'Llegó. Envía el mensaje.'];
    const en = ['Left Santiago.', 'Passing Puerto Montt.', 'Almost in Magallanes.', 'Arrived. Send the message.'];
    trk.classList.toggle('started', n > 0 || !!sent);
    $('[data-trk-es]', trk).textContent = sent ? 'Mensaje en ruta.' : es[Math.max(n - 1, 0)];
    $('[data-trk-en]', trk).textContent = sent ? 'Message on its way.' : en[Math.max(n - 1, 0)];
  };
  fields.forEach((f) => {
    const input = $('input, select', f);
    input.addEventListener('blur', () => { if (input.value) check(f); });
    input.addEventListener('input', () => { if (f.classList.contains('err')) check(f); sync(); });
    input.addEventListener('change', () => sync());
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = fields.filter((f) => !check(f));
    if (bad.length) { $('input, select', bad[0]).focus(); return; }
    form.classList.add('sent');
    sync(true);
  });
  $$('[data-again]', form).forEach((b) => b.addEventListener('click', () => { form.reset(); form.classList.remove('sent'); sync(); }));
});

// parallax suave de la cordillera del hero con el puntero
if (!reduce && matchMedia('(hover: hover)').matches) {
  const z = $('[data-zone]');
  if (z) {
    z.addEventListener('pointermove', (e) => {
      const r = z.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      z.style.setProperty('--mx', mx.toFixed(3));
    });
  }
}
if (reduce) $$('svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());
