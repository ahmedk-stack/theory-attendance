const CACHE='qr-theory-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png',
'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js',
'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
const same=new URL(e.request.url).origin===self.location.origin;
if(same){e.respondWith(fetch(e.request).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return res;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));return;}
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return res;})));});
