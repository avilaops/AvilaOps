/* ========================================
   DEEP LEARNING STUDIO PAGE LOGIC
   Handles i18n updates using the global AvilaI18n engine
   ======================================== */

(function () {
    const NAMESPACE = "deep-learning-studio";

    const applyCurrentLocale = (locale) => {
        if (!window.AvilaI18n) {
            console.warn('AvilaI18n not available');
            return;
        }
        window.AvilaI18n.applyToDom(NAMESPACE, locale).catch((error) => {
            console.error('Failed to apply translations', error);
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const initialLocale = (window.AvilaApp?.getCurrentLocale()) || document.documentElement.lang;
        applyCurrentLocale(initialLocale);
    });

    document.addEventListener('avila:languagechange', (event) => {
        if (!event.detail?.locale) return;
        applyCurrentLocale(event.detail.locale);
    });
})();
