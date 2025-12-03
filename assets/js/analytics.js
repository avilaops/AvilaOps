/* ========================================
   ANALYTICS & TRACKING
   Privacy-focused analytics with Plausible
   ======================================== */

// Plausible Analytics Integration
// Add to <head>: <script defer data-domain="avilaops.com" src="https://plausible.io/js/script.js"></script>

// Custom Events Tracking
const Analytics = {
    // Track custom events
    trackEvent: (eventName, props = {}) => {
        if (window.plausible) {
            window.plausible(eventName, { props });
        }
    },

    // Track pageviews (SPA)
    trackPageview: (url = null) => {
        if (window.plausible) {
            window.plausible('pageview', { u: url || window.location.href });
        }
    },

    // Track CTA clicks
    trackCTA: (ctaName, location) => {
        Analytics.trackEvent('CTA Click', {
            name: ctaName,
            location: location
        });
    },

    // Track product views
    trackProductView: (productName) => {
        Analytics.trackEvent('Product View', {
            product: productName
        });
    },

    // Track form submissions
    trackFormSubmit: (formName, success = true) => {
        Analytics.trackEvent('Form Submit', {
            form: formName,
            success: success ? 'true' : 'false'
        });
    },

    // Track demo requests
    trackDemoRequest: (productName) => {
        Analytics.trackEvent('Demo Request', {
            product: productName
        });
    },

    // Track pricing tier selection
    trackPricingSelect: (tier) => {
        Analytics.trackEvent('Pricing Tier Select', {
            tier: tier
        });
    },

    // Track scroll depth
    trackScrollDepth: (percentage) => {
        Analytics.trackEvent('Scroll Depth', {
            percentage: percentage.toString()
        });
    },

    // Track video plays
    trackVideoPlay: (videoName) => {
        Analytics.trackEvent('Video Play', {
            video: videoName
        });
    },

    // Track downloads
    trackDownload: (fileName) => {
        Analytics.trackEvent('Download', {
            file: fileName
        });
    },

    // Track external links
    trackOutboundLink: (url) => {
        Analytics.trackEvent('Outbound Link', {
            url: url
        });
    }
};

// ========================================
// AUTO-TRACKING SETUP
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Track all CTA buttons
    document.querySelectorAll('[data-cta]').forEach(btn => {
        btn.addEventListener('click', () => {
            const ctaName = btn.getAttribute('data-cta');
            const location = btn.closest('section')?.id || 'unknown';
            Analytics.trackCTA(ctaName, location);
        });
    });

    // Track form submissions
    document.querySelectorAll('form[data-track]').forEach(form => {
        form.addEventListener('submit', (e) => {
            const formName = form.getAttribute('data-track');
            Analytics.trackFormSubmit(formName);
        });
    });

    // Track outbound links
    document.querySelectorAll('a[href^="http"]:not([href*="avilaops.com"])').forEach(link => {
        link.addEventListener('click', () => {
            Analytics.trackOutboundLink(link.href);
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && maxScroll < milestone) {
                maxScroll = milestone;
                Analytics.trackScrollDepth(milestone);
            }
        });
    });

    // Track time on page
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 30;

        if (timeOnPage === 30) {
            Analytics.trackEvent('Time on Page', { seconds: '30' });
        } else if (timeOnPage === 60) {
            Analytics.trackEvent('Time on Page', { seconds: '60' });
        } else if (timeOnPage === 180) {
            Analytics.trackEvent('Time on Page', { seconds: '180' });
            clearInterval(timeInterval);
        }
    }, 30000);

    console.log('📊 Analytics tracking initialized');
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

const Performance = {
    // Track page load time
    trackPageLoad: () => {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            Analytics.trackEvent('Page Load Time', {
                milliseconds: loadTime.toString()
            });
        });
    },

    // Track Core Web Vitals
    trackWebVitals: () => {
        // LCP - Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            Analytics.trackEvent('LCP', {
                milliseconds: Math.round(lastEntry.renderTime || lastEntry.loadTime).toString()
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID - First Input Delay
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                Analytics.trackEvent('FID', {
                    milliseconds: Math.round(entry.processingStart - entry.startTime).toString()
                });
            });
        }).observe({ entryTypes: ['first-input'] });

        // CLS - Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });

        window.addEventListener('beforeunload', () => {
            Analytics.trackEvent('CLS', {
                score: clsValue.toFixed(3)
            });
        });
    }
};

// Initialize performance monitoring
Performance.trackPageLoad();
if ('PerformanceObserver' in window) {
    Performance.trackWebVitals();
}

// ========================================
// ERROR TRACKING
// ========================================

window.addEventListener('error', (e) => {
    Analytics.trackEvent('JavaScript Error', {
        message: e.message,
        file: e.filename,
        line: e.lineno.toString()
    });
});

window.addEventListener('unhandledrejection', (e) => {
    Analytics.trackEvent('Unhandled Promise Rejection', {
        reason: e.reason?.message || 'Unknown'
    });
});

// Export for global use
window.Analytics = Analytics;
window.Performance = Performance;
