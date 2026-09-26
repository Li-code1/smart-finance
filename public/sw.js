// Service worker simples e manual do SmartFinance (sem depender de plugins de build).
// Como o Vite já gera nomes de arquivo com hash a cada build, não precisamos de uma
// lista fixa de arquivos: o cache vai se preenchendo conforme o app é usado.

const CACHE_NAME = 'smartfinance-cache-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Leituras ao Supabase: tenta a rede primeiro; se estiver offline, usa o último dado em cache
  if (url.hostname.endsWith('.supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return resposta;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets do próprio app (html/css/js/ícones): usa o cache e atualiza em segundo plano
  event.respondWith(
    caches.match(request).then((emCache) => {
      const buscaNaRede = fetch(request)
        .then((resposta) => {
          if (resposta.ok) {
            const copia = resposta.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          }
          return resposta;
        })
        .catch(() => emCache);
      return emCache || buscaNaRede;
    })
  );
});
