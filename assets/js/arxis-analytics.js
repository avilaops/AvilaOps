/**
 * ARXIS Analytics - Sistema próprio de analytics
 * Substitui Google Analytics e Plausible
 * Powered by avx-telemetry + avx-observability + avxDB
 *
 * @author AvilaOps
 * @version 1.0.0
 * @license MIT
 */

(function() {
    'use strict';

    // Configuração
    const config = {
        endpoint: 'https://analytics.avilaops.com/api/v1/events',
        apiKey: 'avx-analytics-key', // Será configurado via env
        batchSize: 10,
        flushInterval: 5000, // 5 segundos
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
    };

    // Estado da sessão
    let sessionId = null;
    let userId = null;
    let eventQueue = [];
    let pageLoadTime = performance.now();

    /**
     * Inicializa o analytics
     */
    function init() {
        sessionId = getOrCreateSession();
        userId = getOrCreateUserId();

        // Track page view
        trackPageView();

        // Listeners automáticos
        setupAutoTracking();

        // Flush periódico
        setInterval(flushEvents, config.flushInterval);

        // Flush antes de sair
        window.addEventListener('beforeunload', () => {
            flushEvents(true); // sync
        });

        console.log('🚀 ARXIS Analytics initialized');
    }

    /**
     * Gera ou recupera session ID
     */
    function getOrCreateSession() {
        const key = 'arxis_session';
        let session = sessionStorage.getItem(key);

        if (!session) {
            session = generateId();
            sessionStorage.setItem(key, session);
        }

        return session;
    }

    /**
     * Gera ou recupera user ID (anônimo)
     */
    function getOrCreateUserId() {
        const key = 'arxis_user';
        let user = localStorage.getItem(key);

        if (!user) {
            user = generateId();
            localStorage.setItem(key, user);
        }

        return user;
    }

    /**
     * Gera ID único
     */
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Coleta metadados do evento
     */
    function getEventMetadata() {
        return {
            // Contexto
            session_id: sessionId,
            user_id: userId,
            timestamp: new Date().toISOString(),

            // Página
            url: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer || null,
            title: document.title,

            // Device
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,

            // Performance
            load_time: performance.now() - pageLoadTime,
            connection: navigator.connection ? {
                type: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
            } : null,
        };
    }

    /**
     * Track evento customizado
     */
    function track(eventName, properties = {}) {
        const event = {
            event: eventName,
            properties: {
                ...properties,
                ...getEventMetadata(),
            },
        };

        eventQueue.push(event);

        // Flush se atingir batch size
        if (eventQueue.length >= config.batchSize) {
            flushEvents();
        }
    }

    /**
     * Track page view
     */
    function trackPageView() {
        track('page_view', {
            page_type: detectPageType(),
        });
    }

    /**
     * Detecta tipo de página
     */
    function detectPageType() {
        const path = window.location.pathname;

        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('produto')) return 'product';
        if (path.includes('suite')) return 'suite';
        if (path.includes('contato')) return 'contact';

        return 'other';
    }

    /**
     * Setup tracking automático
     */
    function setupAutoTracking() {
        // Clicks em links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                track('click', {
                    element: 'link',
                    text: link.textContent.trim(),
                    href: link.href,
                    target: link.target,
                });
            }
        });

        // Clicks em botões
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .cta-button');
            if (button) {
                track('click', {
                    element: 'button',
                    text: button.textContent.trim(),
                    class: button.className,
                });
            }
        });

        // Scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                track('scroll', {
                    depth: scrollPercent,
                });
            }
        });

        // Tempo na página (a cada 30s)
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 30;
            track('time_on_page', {
                seconds: timeOnPage,
            });
        }, 30000);

        // Visibilidade
        document.addEventListener('visibilitychange', () => {
            track(document.hidden ? 'page_hidden' : 'page_visible');
        });

        // Erros JavaScript
        window.addEventListener('error', (e) => {
            track('js_error', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
            });
        });
    }

    /**
     * Envia eventos para o backend
     */
    async function flushEvents(sync = false) {
        if (eventQueue.length === 0) return;

        const events = [...eventQueue];
        eventQueue = [];

        const payload = {
            events,
            batch_id: generateId(),
        };

        if (sync) {
            // Sync request (beforeunload)
            navigator.sendBeacon(
                config.endpoint + '/batch',
                JSON.stringify(payload)
            );
        } else {
            // Async request
            try {
                const response = await fetch(config.endpoint + '/batch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': config.apiKey,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    console.error('ARXIS Analytics: Failed to send events', response.status);
                }
            } catch (error) {
                console.error('ARXIS Analytics: Network error', error);
                // Re-adiciona eventos na fila
                eventQueue.unshift(...events);
            }
        }
    }

    /**
     * API pública
     */
    window.arxisAnalytics = {
        track,
        trackPageView,
        getUserId: () => userId,
        getSessionId: () => sessionId,
        flush: () => flushEvents(),
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
