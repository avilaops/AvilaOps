/* ========================================
   AVILAOPS I18N ENGINE
   Lightweight JSON loader with caching
   ======================================== */

(function () {
    const cache = new Map();
    const DEFAULT_LOCALE = "pt-BR";

    const buildKey = (namespace, locale) => `${namespace}:${locale}`;

    const fetchLocale = async (namespace, locale) => {
        const normalisedLocale = locale || DEFAULT_LOCALE;
        const key = buildKey(namespace, normalisedLocale);
        if (cache.has(key)) {
            return cache.get(key);
        }

        const url = `/i18n/${namespace}.${normalisedLocale}.json`;
        const response = await fetch(url);

        if (!response.ok) {
            if (normalisedLocale !== DEFAULT_LOCALE) {
                return fetchLocale(namespace, DEFAULT_LOCALE);
            }
            throw new Error(`i18n: failed loading ${url}`);
        }

        const json = await response.json();
        cache.set(key, json);
        return json;
    };

    const applyToDom = async (namespace, locale, root = document) => {
        const dictionary = await fetchLocale(namespace, locale);
        root.querySelectorAll('[data-i18n]').forEach((element) => {
            const token = element.getAttribute('data-i18n');
            const value = dictionary[token];
            if (typeof value === 'string') {
                element.innerHTML = value;
            }
        });
    };

    window.AvilaI18n = {
        load: fetchLocale,
        applyToDom,
        clearCache: () => cache.clear()
    };
})();
