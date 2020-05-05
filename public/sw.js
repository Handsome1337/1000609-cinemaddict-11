const CACHE_PREFIX = `cinemaddict-handsome1337-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `/images/emoji/angry.png`,
            `/images/emoji/puke.png`,
            `/images/emoji/sleeping.png`,
            `/images/emoji/smile.png`,
            `/images/icons/icon-favorite-active.svg`,
            `/images/icons/icon-favorite.svg`,
            `/images/icons/icon-watched-active.svg`,
            `/images/icons/icon-watched.svg`,
            `/images/icons/icon-watchlist-active.svg`,
            `/images/icons/icon-watchlist.svg`,
            `/images/posters/made-for-each-other.png`,
            `/images/posters/popeye-meets-sinbad.png`,
            `/images/posters/sagebrush-trail.jpg`,
            `/images/posters/santa-claus-conquers-the-martians.jpg`,
            `/images/posters/the-dance-of-life.jpg`,
            `/images/posters/the-great-flamarion.jpg`,
            `/images/posters/the-man-with-the-golden-arm.jpg`,
            `/images/background.png`,
            `/images/bitmap.png`,
            `/images/bitmap@2x.png`,
            `/images/bitmap@3x.png`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      /* Получает все названия кэшей */
      caches.keys()
        .then(
            /* Перебирает их и составляет набор промисов на удаление */
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      /* Удаляет только те кэши, которые начинаются с нашего префикса, но не совпадают по версии */
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      /* Остальные не обрабатывает */
                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

const onFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          /* Если в кэше нашёлся ответ на запрос (request), возвращает его (cacheResponse) вместо запроса к серверу */
          if (cacheResponse) {
            return cacheResponse;
          }

          /* Если в кэше не нашёлся ответ, повторно вызывает fetch с тем же запросом (request), и возвращает его */
          return fetch(request)
            .then((response) => {
              /* Если ответа нет, или ответ со статусом отличным от 200 OK, или ответ небезопасного типа (не basic), тогда просто передаёт ответ дальше, никак не обрабатывает */
              if (!response || response.status !== 200 || response.type !== `basic`) {
                return response;
              }

              /* А если ответ удовлетворяет всем условиям, клонирует его */
              const clonedResponse = response.clone();

              /* Копию кладёт в кэш */
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              /* Оригинал передаём дальше */
              return response;
            });
        })
  );
};

self.addEventListener(`fetch`, onFetch);
