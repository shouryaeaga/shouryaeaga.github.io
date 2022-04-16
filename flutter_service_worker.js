'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"main.dart.js": "ad5bb9f9beb8fb490f06c668c4dfd68d",
"version.json": "cc1fa9cce5af273c0909d105387fee89",
"assets/assets/fonts/Montserrat-Light.ttf": "a17f43cc60643d965636985afc00a221",
"assets/assets/fonts/Karla-Medium.ttf": "fc3c77ce1e2e821dc52aaeaa8e03f27e",
"assets/packages/community_material_icon/fonts/materialdesignicons-webfont.ttf": "174c02fc4609e8fc4389f5d21f16a296",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/AssetManifest.json": "192a8a267d468a293de982c819fc3206",
"assets/FontManifest.json": "1b1c5f8023e5663ecc2e21cec93e5a5e",
"assets/NOTICES": "3af9ddd193a73ec35ed1f3978b2557d8",
"index.html": "f6070b151e961afb6e1afcaf63ea6403",
"/": "f6070b151e961afb6e1afcaf63ea6403",
"manifest.json": "a67989697c366cf4f821bde4733a6ca8",
"icons/android-icon-36x36.png": "53ccc8d18813e9b75711b7178124ebbc",
"icons/android-icon-48x48.png": "43f47ce9fdd22224fea8590882f3e0c0",
"icons/android-icon-72x72.png": "101067832960eb3e501ed5bc73cd3e29",
"icons/android-icon-96x96.png": "f5c1efec0d6c0edd79df38767985c276",
"icons/android-icon-144x144.png": "dae5af138864240bb9469a0b2792de9a",
"icons/android-icon-192x192.png": "26a2fb2634dacce9b0df31ad4af0b651",
"icons/apple-icon.png": "b4af914e59903862d8c705bba5914506",
"icons/apple-icon-57x57.png": "0ad968bdd36cbb3949e4b0d9bbfbaad1",
"icons/apple-icon-60x60.png": "54e896bac5cfbb6830c8fba5af733ccc",
"icons/apple-icon-72x72.png": "101067832960eb3e501ed5bc73cd3e29",
"icons/apple-icon-76x76.png": "3a411aa1bb14c48d0cd3a871bd396793",
"icons/apple-icon-114x114.png": "c6fd8efbbd35505471c18cab3207fffd",
"icons/apple-icon-120x120.png": "1fcab1ebb61f7ef8361ab044a76bccf7",
"icons/apple-icon-144x144.png": "dae5af138864240bb9469a0b2792de9a",
"icons/apple-icon-152x152.png": "faebb6c6d2038359dd024d6f2d74570d",
"icons/apple-icon-180x180.png": "565c833b41bdb8611c9f036284f2a2e7",
"icons/apple-icon-precomposed.png": "b4af914e59903862d8c705bba5914506",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-32x32.png": "fc8e4483e0388d2102008557cdcab748",
"icons/favicon-96x96.png": "61d4906d0abeba20e23551986f154d84",
"icons/manifest.json": "91aad24878ac8ea2a36c5613d4cb4a6a",
"icons/ms-icon-70x70.png": "6fa64042b484a4fcf750f73cc78f0942",
"icons/ms-icon-144x144.png": "dae5af138864240bb9469a0b2792de9a",
"icons/ms-icon-150x150.png": "9c7327cb4a3f7591e597705c23833de7",
"icons/ms-icon-310x310.png": "31e7455391d165da3fa3bd0c1570e61e",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"favicon.ico": "985f385506479952e6c0cb2f00d0447d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
