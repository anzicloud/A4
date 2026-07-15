const CACHE_NAME = 'a4-layout-tool-local-v2'; // 更新缓存版本号
const ASSETS_TO_CACHE = [
  '/',
  '/A4/index.html',
  '/A4/manifest.json',
  '/A4/libs/jspdf.umd.min.js' // ✅ 缓存本地库
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存核心资源...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截：优先返回缓存内容（Cache First 策略）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到，直接返回
        if (response) {
          return response;
        }
        // 否则尝试从网络获取（主要用于处理图片上传等动态请求）
        return fetch(event.request);
      })
  );
});
