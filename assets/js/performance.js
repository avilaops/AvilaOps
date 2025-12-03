/* ========================================
   PERFORMANCE OPTIMIZATION
   Lazy loading, preload, image optimization
   ======================================== */

// ========================================
// LAZY LOADING IMAGES
// ========================================

const LazyLoad = {
    init: () => {
        // Native lazy loading for modern browsers
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            if ('loading' in HTMLImageElement.prototype) {
                img.src = img.dataset.src || img.src;
                img.loading = 'lazy';
            } else {
                // Fallback to Intersection Observer
                LazyLoad.observeImage(img);
            }
        });

        // Lazy load background images
        document.querySelectorAll('[data-bg]').forEach(element => {
            LazyLoad.observeBackground(element);
        });

        console.log('🚀 Lazy loading initialized');
    },

    observeImage: (img) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.classList.add('loaded');
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '50px'
        });

        observer.observe(img);
    },

    observeBackground: (element) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.backgroundImage = `url(${el.dataset.bg})`;
                    el.classList.add('loaded');
                    observer.unobserve(el);
                }
            });
        }, {
            rootMargin: '50px'
        });

        observer.observe(element);
    }
};

// ========================================
// LAZY LOAD SECTIONS
// ========================================

const LazySections = {
    init: () => {
        document.querySelectorAll('[data-lazy-section]').forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        section.classList.add('section-loaded');
                        observer.unobserve(section);
                    }
                });
            }, {
                rootMargin: '100px'
            });

            observer.observe(section);
        });
    }
};

// ========================================
// PRELOAD CRITICAL RESOURCES
// ========================================

const Preload = {
    // Preload critical fonts
    fonts: (fonts = []) => {
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = font;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    },

    // Preload critical CSS
    css: (stylesheets = []) => {
        stylesheets.forEach(css => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = css;
            document.head.appendChild(link);

            // Load stylesheet
            setTimeout(() => {
                link.rel = 'stylesheet';
            }, 0);
        });
    },

    // Preload images
    images: (images = []) => {
        images.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    },

    // Prefetch next page
    nextPage: (url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    },

    // DNS prefetch for external domains
    dns: (domains = []) => {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }
};

// ========================================
// IMAGE OPTIMIZATION
// ========================================

const ImageOptimizer = {
    // Use modern image formats (WebP, AVIF)
    supportsWebP: null,
    supportsAVIF: null,

    checkSupport: async () => {
        // Check WebP support
        const webpTest = new Image();
        webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
        ImageOptimizer.supportsWebP = await new Promise(resolve => {
            webpTest.onload = webpTest.onerror = () => resolve(webpTest.height === 1);
        });

        // Check AVIF support
        const avifTest = new Image();
        avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        ImageOptimizer.supportsAVIF = await new Promise(resolve => {
            avifTest.onload = avifTest.onerror = () => resolve(avifTest.height === 1);
        });
    },

    // Get best image format
    getBestFormat: () => {
        if (ImageOptimizer.supportsAVIF) return 'avif';
        if (ImageOptimizer.supportsWebP) return 'webp';
        return 'jpg';
    },

    // Replace image sources with optimized versions
    optimize: () => {
        const format = ImageOptimizer.getBestFormat();

        document.querySelectorAll('img[data-optimize]').forEach(img => {
            const originalSrc = img.src;
            const optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);

            // Test if optimized version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = optimizedSrc;
            };
            testImg.src = optimizedSrc;
        });
    }
};

// ========================================
// CODE SPLITTING & DYNAMIC IMPORTS
// ========================================

const DynamicImport = {
    // Load script only when needed
    loadScript: (src, defer = true) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = defer;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    // Load module on interaction
    onInteraction: (element, modulePath) => {
        const events = ['mousedown', 'touchstart', 'keydown'];

        const load = () => {
            events.forEach(event => {
                element.removeEventListener(event, load);
            });

            import(modulePath).then(module => {
                module.default();
            });
        };

        events.forEach(event => {
            element.addEventListener(event, load, { once: true, passive: true });
        });
    }
};

// ========================================
// RESOURCE HINTS
// ========================================

const ResourceHints = {
    init: () => {
        // Preconnect to critical domains
        Preload.dns([
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://plausible.io'
        ]);

        // Prefetch next likely pages
        const links = document.querySelectorAll('a[href^="/"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                Preload.nextPage(link.href);
            }, { once: true });
        });
    }
};

// ========================================
// DEBOUNCE & THROTTLE UTILITIES
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// REQUEST IDLE CALLBACK POLYFILL
// ========================================

window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    const start = Date.now();
    return setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        });
    }, 1);
};

// ========================================
// INITIALIZE OPTIMIZATIONS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Run non-critical tasks on idle
    requestIdleCallback(() => {
        LazyLoad.init();
        LazySections.init();
        ResourceHints.init();
        ImageOptimizer.checkSupport().then(() => {
            ImageOptimizer.optimize();
        });
    });

    console.log('⚡ Performance optimizations initialized');
});

// Export for global use
window.LazyLoad = LazyLoad;
window.Preload = Preload;
window.DynamicImport = DynamicImport;
window.debounce = debounce;
window.throttle = throttle;
