// Chat Widget Component
// Desenvolvido por: Nicolas Avila

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    createWidget() {
        const widgetHTML = `
            <div id="chat-widget" class="chat-widget">
                <button class="chat-button" id="chat-toggle">
                    <span class="chat-icon">💬</span>
                    <span class="chat-notification" style="display: none;">1</span>
                </button>

                <div class="chat-window" id="chat-window" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="chat-avatar">🤖</div>
                            <div>
                                <div class="chat-agent-name">ARXIS Assistant</div>
                                <div class="chat-status">
                                    <span class="status-dot"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button class="chat-minimize" id="chat-minimize">−</button>
                    </div>

                    <div class="chat-messages" id="chat-messages"></div>

                    <div class="chat-quick-actions" id="quick-actions">
                        <button class="quick-action" data-action="trial">
                            🎁 Iniciar Trial
                        </button>
                        <button class="quick-action" data-action="pricing">
                            💰 Ver Preços
                        </button>
                        <button class="quick-action" data-action="docs">
                            📚 Documentação
                        </button>
                        <button class="quick-action" data-action="support">
                            🆘 Suporte Técnico
                        </button>
                    </div>

                    <form class="chat-input-form" id="chat-form">
                        <input 
                            type="text" 
                            class="chat-input" 
                            id="chat-input"
                            placeholder="Digite sua mensagem..."
                            autocomplete="off"
                        />
                        <button type="submit" class="chat-send">
                            <span class="iconoir-send-diagonal"></span>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    setupEventListeners() {
        document.getElementById('chat-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('chat-minimize').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('chat-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chat-window');
        const button = document.getElementById('chat-toggle');
        const notification = document.querySelector('.chat-notification');

        if (this.isOpen) {
            window.style.display = 'flex';
            button.classList.add('active');
            notification.style.display = 'none';
            
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 300);

            this.trackEvent('chat_opened');
        } else {
            window.style.display = 'none';
            button.classList.remove('active');
            this.trackEvent('chat_closed');
        }
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage(
                'Olá! 👋 Sou o assistente da Plataforma ARXIS. Como posso ajudar você hoje?'
            );
            this.showNotification();
        }, 3000);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        document.getElementById('quick-actions').style.display = 'none';

        setTimeout(() => {
            this.handleBotResponse(message);
        }, 800);

        this.trackEvent('chat_message_sent', { message });
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="chat-message user-message">
                <div class="message-content">${this.escapeHTML(message)}</div>
                <div class="message-time">${this.getTime()}</div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="chat-message bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-bubble">
                    <div class="message-content">${message}</div>
                    <div class="message-time">${this.getTime()}</div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    handleBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';

        if (lowerMessage.includes('preço') || lowerMessage.includes('custo')) {
            response = `Temos planos a partir de $299/mês! 💰<br><br>
                       Quer ver todos os planos? 
                       <a href="pricing.html" target="_blank">Clique aqui</a>`;
        } 
        else if (lowerMessage.includes('trial') || lowerMessage.includes('teste')) {
            response = `Ótimo! Oferecemos 14 dias de trial gratuito! 🎁<br><br>
                       <a href="trial-signup.html" target="_blank">Iniciar trial agora →</a>`;
        }
        else if (lowerMessage.includes('doc') || lowerMessage.includes('documentação')) {
            response = `Nossa documentação está completa com exemplos de código! 📚<br><br>
                       <a href="docs.html" target="_blank">Ver documentação →</a>`;
        }
        else if (lowerMessage.includes('suporte') || lowerMessage.includes('ajuda')) {
            response = `Posso te ajudar de várias formas:<br><br>
                       • 📧 Email: support@avilaops.com<br>
                       • 📞 WhatsApp: +55 17 99781-1471<br>
                       • 📚 <a href="docs.html" target="_blank">Documentação</a><br>
                       • 📊 <a href="status.html" target="_blank">Status da plataforma</a>`;
        }
        else {
            response = `Entendo! Para te ajudar melhor, recomendo:<br><br>
                       • Ver nossos <a href="use-cases.html" target="_blank">casos de uso</a><br>
                       • Consultar a <a href="docs.html" target="_blank">documentação</a><br>
                       • Ou falar com nosso time: support@avilaops.com`;
        }

        this.addBotMessage(response);
    }

    handleQuickAction(action) {
        const actions = {
            trial: {
                message: 'Quero iniciar um trial gratuito!',
                response: 'Perfeito! Nosso trial é 100% gratuito por 14 dias. 🎁<br><br><a href="trial-signup.html" target="_blank">Iniciar agora →</a>'
            },
            pricing: {
                message: 'Quais são os preços?',
                response: 'Temos planos para todos os tamanhos de empresa! 💰<br><br><a href="pricing.html" target="_blank">Ver todos os planos →</a>'
            },
            docs: {
                message: 'Preciso da documentação',
                response: 'Temos docs completas com exemplos de código! 📚<br><br><a href="docs.html" target="_blank">Acessar documentação →</a>'
            },
            support: {
                message: 'Preciso de suporte técnico',
                response: 'Nosso time está pronto para ajudar! 🆘<br><br>Email: support@avilaops.com<br>WhatsApp: +55 17 99781-1471'
            }
        };

        const selectedAction = actions[action];
        if (selectedAction) {
            this.addUserMessage(selectedAction.message);
            setTimeout(() => {
                this.addBotMessage(selectedAction.response);
                document.getElementById('quick-actions').style.display = 'none';
            }, 800);

            this.trackEvent('chat_quick_action', { action });
        }
    }

    showNotification() {
        if (!this.isOpen) {
            const notification = document.querySelector('.chat-notification');
            notification.style.display = 'flex';
        }
    }

    scrollToBottom() {
        const messages = document.getElementById('chat-messages');
        messages.scrollTop = messages.scrollHeight;
    }

    getTime() {
        return new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    trackEvent(eventName, data = {}) {
        if (window.trackEvent) {
            window.trackEvent(eventName, data);
        }
        console.log('Chat Event:', eventName, data);
    }
}

// Initialize chat widget
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
