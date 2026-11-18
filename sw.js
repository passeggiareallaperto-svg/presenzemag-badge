/* Badge PresenzeMag: tiene la pagina salvata sul telefono, così il badge funziona anche senza internet.
   Quando c'è internet scarica in silenzio la versione nuova, che si vede alla riapertura dopo.
   Cambiare VERSIONE a ogni aggiornamento della pagina. */
var VERSIONE = "badge-1.0";
var FILE = ["./", "index.html", "manifest.webmanifest", "icona-192.png", "icona-512.png", "icona-180.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSIONE).then(function (c) { return c.addAll(FILE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSIONE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSIONE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (salvata) {
      var rete = fetch(e.request).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(function () { return salvata; });
      return salvata || rete;
    });
  }));
});
