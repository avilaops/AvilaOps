/* ========================================
   AVILAOPS THEME CONTROLLER
   Manages light/dark toggling when controls are available
   ======================================== */

(function () {
    const THEME_KEY = "theme";
    const DEFAULT_THEME = "dark";

    const applyTheme = (theme) => {
        const target = theme === "light" ? "light" : "dark";
        document.body.setAttribute('data-theme', target);
        localStorage.setItem(THEME_KEY, target);

        document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
            button.textContent = target === 'dark' ? '🌗' : '🌞';
        });
    };

    const toggleTheme = () => {
        const current = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        applyTheme(current === 'dark' ? 'light' : 'dark');
    };

    document.addEventListener('DOMContentLoaded', () => {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        if (!toggles.length) {
            return;
        }

        applyTheme(localStorage.getItem(THEME_KEY) || DEFAULT_THEME);
        toggles.forEach((button) => {
            button.addEventListener('click', toggleTheme);
        });
    });

    window.AvilaTheme = {
        apply: applyTheme,
        toggle: toggleTheme,
        current: () => localStorage.getItem(THEME_KEY) || DEFAULT_THEME
    };
})();
