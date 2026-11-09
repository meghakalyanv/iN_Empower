/* iN Empower Team — makes /admin installable as a phone app.
   It does not store anything: every request goes to the internet as normal,
   so the team always sees fresh data. Shows a simple page when offline. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(
    fetch(event.request).catch(() => new Response(
      '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title>' +
      '<body style="font-family:sans-serif;padding:2rem;text-align:center;color:#0F172A"><h2>No internet</h2><p>iN Empower Team needs the internet. Please check your connection and try again.</p></body>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    ))
  )
})
