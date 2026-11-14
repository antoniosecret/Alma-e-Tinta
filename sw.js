/* Alma & Tinta — guarda o site no aparelho para abrir sem internet.
   Os livros em si (texto e PDF) ficam no IndexedDB, guardados pela própria página. */
const VERSAO = 'v3.8';
const CASCA = 'alma-casca-' + VERSAO;
const EXTRAS = 'alma-extras';
const IMAGENS = 'alma-imagens';
const ARQUIVOS = ['./', './manifest.webmanifest', './favicon-32.png', './favicon-16.png', './icone-192.png', './icone-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CASCA).then(c => Promise.all(ARQUIVOS.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('alma-casca-') && k !== CASCA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function comPrazo(p, ms) { return Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('prazo')), ms))]); }

async function limitar(nome, max) {
  const c = await caches.open(nome); const ks = await c.keys();
  for (let i = 0; i < ks.length - max; i++) await c.delete(ks[i]);
}

/* Página: tenta a internet primeiro (para receber as atualizações); sem internet, usa a cópia guardada. */
async function pagina(req) {
  const c = await caches.open(CASCA);
  try {
    const r = await comPrazo(fetch(req), 6000);
    if (r && r.ok) c.put('./', r.clone());
    return r;
  } catch (e) {
    return (await c.match('./')) || (await c.match(req, { ignoreSearch: true })) || new Response('<h1 style="font-family:serif;text-align:center;margin-top:30vh">Sem internet</h1><p style="text-align:center">Abra o Alma &amp; Tinta uma vez com internet para que ele fique guardado no aparelho.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

/* Usa o que já tem guardado e atualiza por trás. */
async function guardadoEAtualiza(req, nome, max) {
  const c = await caches.open(nome);
  const tem = await c.match(req);
  const rede = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) { c.put(req, r.clone()); if (max) limitar(nome, max); } return r; }).catch(() => null);
  return tem || (await rede) || Response.error();
}

/* Arquivos que nunca mudam (fontes, PDF.js): guardado primeiro. */
async function guardadoPrimeiro(req, nome) {
  const c = await caches.open(nome);
  const tem = await c.match(req);
  if (tem) return tem;
  const r = await fetch(req);
  if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
  return r;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' && url.origin === location.origin) { e.respondWith(pagina(req)); return; }
  if (url.origin === location.origin) { e.respondWith(guardadoEAtualiza(req, CASCA)); return; }
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdnjs.cloudflare.com') { e.respondWith(guardadoPrimeiro(req, EXTRAS)); return; }
  if (url.hostname === 'fonts.googleapis.com') { e.respondWith(guardadoEAtualiza(req, EXTRAS)); return; }
  if ((url.hostname === 'drive.google.com' && url.pathname.startsWith('/thumbnail')) || url.hostname.endsWith('googleusercontent.com')) {
    if (req.destination === 'image') { e.respondWith(guardadoEAtualiza(req, IMAGENS, 80)); return; }
  }
});
