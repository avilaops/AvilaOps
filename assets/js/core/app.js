/* ========================================
   AVILAOPS CORE APP LAYER
   Handles locale persistence and global events
   ======================================== */

(function () {
    const SUPPORTED_LOCALES = ["pt-BR", "en-US", "es-ES", "uk-UA", "ru-RU"];
    const DEFAULT_LOCALE = "pt-BR";

    const normaliseLocale = (value) => {
        if (!value) return DEFAULT_LOCALE;
        if (SUPPORTED_LOCALES.includes(value)) return value;

        const short = value.split("-")[0];
        const match = SUPPORTED_LOCALES.find((locale) => locale.startsWith(short));
        return match || DEFAULT_LOCALE;
    };

    const applyLocale = (locale) => {
        const target = normaliseLocale(locale);
        document.documentElement.lang = target;
        localStorage.setItem("lang", target);

        document.querySelectorAll('[data-lang-select]').forEach((select) => {
            if (select.value !== target) {
                select.value = target;
            }
        });

        document.dispatchEvent(new CustomEvent("avila:languagechange", {
            detail: { locale: target }
        }));
    };

    const initialiseLocaleControls = () => {
        document.querySelectorAll('[data-lang-select]').forEach((select) => {
            select.addEventListener('change', (event) => {
                applyLocale(event.target.value);
            });
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const stored = localStorage.getItem("lang") || navigator.language;
        applyLocale(stored);
        initialiseLocaleControls();
    });

    window.AvilaApp = {
        getCurrentLocale: () => document.documentElement.lang || DEFAULT_LOCALE,
        setLocale: applyLocale,
        supportedLocales: [...SUPPORTED_LOCALES]
    };
})();
