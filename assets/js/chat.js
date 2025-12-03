/* ========================================
   LIVE CHAT WIDGET
   Integration for Intercom/Drift/Custom chat
   ======================================== */

// ========================================
// CHAT WIDGET CONTROLLER
// ========================================

const ChatWidget = {
    provider: null, // 'intercom', 'drift', 'custom'
    initialized: false,

    // Initialize chat provider
    init: (provider = 'custom', config = {}) => {
        ChatWidget.provider = provider;

        switch (provider) {
            case 'intercom':
                ChatWidget.initIntercom(config);
                break;
            case 'drift':
                ChatWidget.initDrift(config);
                break;
            case 'custom':
                ChatWidget.initCustomChat(config);
                break;
            default:
                console.warn('Invalid chat provider');
        }

        ChatWidget.initialized = true;
        console.log(`💬 ${provider} chat initialized`);
    },

    // ========================================
    // INTERCOM INTEGRATION
    // ========================================

    initIntercom: (config) => {
        // Intercom configuration
        window.intercomSettings = {
            app_id: config.appId || 'YOUR_INTERCOM_APP_ID',
            name: config.userName,
            email: config.userEmail,
            created_at: config.userCreatedAt,
            alignment: 'right',
            horizontal_padding: 20,
            vertical_padding: 20,
            ...config.customSettings
        };

        // Load Intercom script
        (function() {
            const w = window;
            const ic = w.Intercom;
            if (typeof ic === "function") {
                ic('reattach_activator');
                ic('update', w.intercomSettings);
            } else {
                const d = document;
                const i = function() {
                    i.c(arguments);
                };
                i.q = [];
                i.c = function(args) {
                    i.q.push(args);
                };
                w.Intercom = i;
                const l = function() {
                    const s = d.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://widget.intercom.io/widget/' + window.intercomSettings.app_id;
                    const x = d.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                };
                if (document.readyState === 'complete') {
                    l();
                } else if (w.attachEvent) {
                    w.attachEvent('onload', l);
                } else {
                    w.addEventListener('load', l, false);
                }
            }
        })();
    },

    // ========================================
    // DRIFT INTEGRATION
    // ========================================

    initDrift: (config) => {
        // Drift configuration
        !function() {
            const t = window.driftt = window.drift = window.driftt || [];
            if (!t.init) {
                if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
                t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
                t.factory = function(e) {
                    return function() {
                        const n = Array.prototype.slice.call(arguments);
                        return n.unshift(e), t.push(n), t;
                    };
                }, t.methods.forEach(function(e) {
                    t[e] = t.factory(e);
                }), t.load = function(t) {
                    const e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
                    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
                    const i = document.getElementsByTagName("script")[0];
                    i.parentNode.insertBefore(o, i);
                };
            }
        }();
        drift.SNIPPET_VERSION = '0.3.1';
        drift.load(config.driftId || 'YOUR_DRIFT_ID');

        // Configure Drift
        if (config.userName || config.userEmail) {
            drift.identify(config.userEmail, {
                name: config.userName,
                email: config.userEmail
            });
        }
    },

    // ========================================
    // CUSTOM CHAT WIDGET
    // ========================================

    initCustomChat: (config) => {
        // Create custom chat widget
        const chatContainer = document.createElement('div');
        chatContainer.id = 'custom-chat-widget';
        chatContainer.innerHTML = `
            <button id="chat-toggle" class="chat-toggle" aria-label="Abrir chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.5 16L10.5 12L14.5 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="chat-badge">1</span>
            </button>

            <div id="chat-window" class="chat-window hidden">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <h3>💬 Fale Conosco</h3>
                        <p class="chat-status">
                            <span class="status-dot"></span> Online
                        </p>
                    </div>
                    <button id="chat-close" class="chat-close" aria-label="Fechar chat">×</button>
                </div>

                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message bot">
                        <div class="message-content">
                            <p>Olá! 👋 Como posso ajudar você hoje?</p>
                            <span class="message-time">agora</span>
                        </div>
                    </div>
                </div>

                <div class="chat-quick-actions">
                    <button class="quick-action" data-message="Quero conhecer os produtos">
                        🚀 Ver produtos
                    </button>
                    <button class="quick-action" data-message="Preciso de suporte técnico">
                        🛠️ Suporte
                    </button>
                    <button class="quick-action" data-message="Quero falar com vendas">
                        💼 Vendas
                    </button>
                </div>

                <form class="chat-input-form" id="chat-form">
                    <input
                        type="text"
                        id="chat-input"
                        class="chat-input"
                        placeholder="Digite sua mensagem..."
                        autocomplete="off"
                    />
                    <button type="submit" class="chat-send" aria-label="Enviar mensagem">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M18 2L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M18 2L12 18L9 11L2 8L18 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(chatContainer);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #custom-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chat-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #FF6B35, #FDB833);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: transform 0.3s ease;
            }

            [data-theme="dark"] .chat-toggle {
                background: linear-gradient(135deg, #8B5CF6, #C084FC);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            }

            .chat-toggle:hover {
                transform: scale(1.1);
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #EF4444;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 700;
            }

            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 550px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            [data-theme="dark"] .chat-window {
                background: #1a1a1a;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            }

            .chat-window.hidden {
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
            }

            .chat-header {
                background: linear-gradient(135deg, #FF6B35, #FDB833);
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
            }

            [data-theme="dark"] .chat-header {
                background: linear-gradient(135deg, #8B5CF6, #C084FC);
            }

            .chat-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }

            .chat-status {
                font-size: 0.85rem;
                opacity: 0.9;
                margin: 0.25rem 0 0 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .status-dot {
                width: 8px;
                height: 8px;
                background: #10B981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .chat-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
                background: #f9fafb;
            }

            [data-theme="dark"] .chat-messages {
                background: #0a0a0a;
            }

            .chat-message {
                margin-bottom: 1rem;
                display: flex;
            }

            .chat-message.bot {
                justify-content: flex-start;
            }

            .chat-message.user {
                justify-content: flex-end;
            }

            .message-content {
                max-width: 80%;
                padding: 0.75rem 1rem;
                border-radius: 12px;
            }

            .chat-message.bot .message-content {
                background: white;
                color: #1a1a1a;
            }

            [data-theme="dark"] .chat-message.bot .message-content {
                background: #2a2a2a;
                color: #ffffff;
            }

            .chat-message.user .message-content {
                background: linear-gradient(135deg, #FF6B35, #FDB833);
                color: white;
            }

            [data-theme="dark"] .chat-message.user .message-content {
                background: linear-gradient(135deg, #8B5CF6, #C084FC);
            }

            .message-time {
                font-size: 0.7rem;
                opacity: 0.6;
                display: block;
                margin-top: 0.25rem;
            }

            .chat-quick-actions {
                padding: 0.75rem 1rem;
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                background: #f9fafb;
                border-top: 1px solid #e5e7eb;
            }

            [data-theme="dark"] .chat-quick-actions {
                background: #0a0a0a;
                border-top-color: #2a2a2a;
            }

            .quick-action {
                padding: 0.5rem 0.75rem;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                background: white;
                color: #666;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            [data-theme="dark"] .quick-action {
                background: #1a1a1a;
                border-color: #2a2a2a;
                color: #a1a1aa;
            }

            .quick-action:hover {
                background: #FF6B35;
                color: white;
                border-color: #FF6B35;
            }

            [data-theme="dark"] .quick-action:hover {
                background: #8B5CF6;
                border-color: #8B5CF6;
            }

            .chat-input-form {
                display: flex;
                padding: 1rem;
                gap: 0.5rem;
                border-top: 1px solid #e5e7eb;
                background: white;
            }

            [data-theme="dark"] .chat-input-form {
                background: #1a1a1a;
                border-top-color: #2a2a2a;
            }

            .chat-input {
                flex: 1;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.95rem;
                outline: none;
            }

            [data-theme="dark"] .chat-input {
                background: #2a2a2a;
                border-color: #3f3f46;
                color: white;
            }

            .chat-input:focus {
                border-color: #FF6B35;
            }

            [data-theme="dark"] .chat-input:focus {
                border-color: #8B5CF6;
            }

            .chat-send {
                width: 44px;
                height: 44px;
                border-radius: 8px;
                background: linear-gradient(135deg, #FF6B35, #FDB833);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s;
            }

            [data-theme="dark"] .chat-send {
                background: linear-gradient(135deg, #8B5CF6, #C084FC);
            }

            .chat-send:hover {
                transform: scale(1.05);
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);

        // Setup event listeners
        ChatWidget.setupCustomChatEvents();
    },

    // Setup custom chat events
    setupCustomChatEvents: () => {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const window = document.getElementById('chat-window');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');

        // Toggle chat
        toggle?.addEventListener('click', () => {
            window?.classList.toggle('hidden');
            if (!window?.classList.contains('hidden')) {
                input?.focus();
                document.querySelector('.chat-badge')?.remove();
            }
        });

        // Close chat
        close?.addEventListener('click', () => {
            window?.classList.add('hidden');
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                ChatWidget.sendMessage(message);
            });
        });

        // Send message
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = input?.value.trim();
            if (message) {
                ChatWidget.sendMessage(message);
                input.value = '';
            }
        });
    },

    // Send message
    sendMessage: (text) => {
        const messages = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        messages?.appendChild(userMsg);
        messages?.scrollTo(0, messages.scrollHeight);

        // Simulate bot response
        setTimeout(() => {
            ChatWidget.addBotMessage('Obrigado pela sua mensagem! Nossa equipe responderá em breve. 🚀');
        }, 1000);

        // Track event
        if (window.Analytics) {
            window.Analytics.trackEvent('Chat Message', { message: text });
        }
    },

    // Add bot message
    addBotMessage: (text) => {
        const messages = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        messages?.appendChild(botMsg);
        messages?.scrollTo(0, messages.scrollHeight);
    },

    // Show chat
    show: () => {
        document.getElementById('chat-window')?.classList.remove('hidden');
    },

    // Hide chat
    hide: () => {
        document.getElementById('chat-window')?.classList.add('hidden');
    },

    // Send message programmatically
    message: (text) => {
        if (ChatWidget.provider === 'intercom' && window.Intercom) {
            window.Intercom('showNewMessage', text);
        } else if (ChatWidget.provider === 'drift' && window.drift) {
            window.drift.api.startInteraction({ goToConversation: true });
        } else {
            ChatWidget.addBotMessage(text);
        }
    }
};

// ========================================
// AUTO-INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with custom chat by default
    // Change to 'intercom' or 'drift' when ready
    ChatWidget.init('custom', {
        // Intercom config
        // appId: 'YOUR_INTERCOM_APP_ID',

        // Drift config
        // driftId: 'YOUR_DRIFT_ID',

        // User info (if available)
        // userName: 'John Doe',
        // userEmail: 'john@example.com'
    });
});

// Export for global use
window.ChatWidget = ChatWidget;
