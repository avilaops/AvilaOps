// Newsletter Modal Component
// Desenvolvido por: Nicolas Avila

class NewsletterModal {
    constructor() {
        this.modal = null;
        this.hasShown = false;
        this.init();
    }

    init() {
        // Check if user has already subscribed or closed modal
        const hasSubscribed = localStorage.getItem('newsletter_subscribed');
        const lastClosed = localStorage.getItem('newsletter_closed');
        
        if (hasSubscribed) return;
        
        // Show modal after 10 seconds or on exit intent
        setTimeout(() => this.showModal(), 10000);
        
        // Exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !this.hasShown) {
                this.showModal();
            }
        });
        
        this.createModal();
    }

    createModal() {
        const modalHTML = `
            <div id="newsletter-modal" class="newsletter-modal" style="display: none;">
                <div class="newsletter-overlay"></div>
                <div class="newsletter-content">
                    <button class="newsletter-close" onclick="newsletterModal.closeModal()">✕</button>
                    
                    <div class="newsletter-icon">📬</div>
                    
                    <h2 class="newsletter-title">
                        Fique por dentro das novidades
                    </h2>
                    
                    <p class="newsletter-description">
                        Receba artigos técnicos, cases de sucesso e atualizações 
                        exclusivas da Plataforma ARXIS direto no seu email.
                    </p>

                    <form id="newsletter-form" class="newsletter-form">
                        <input 
                            type="email" 
                            id="newsletter-email" 
                            placeholder="seu@email.com" 
                            required
                            class="newsletter-input"
                        />
                        <button type="submit" class="newsletter-submit">
                            Inscrever-se
                        </button>
                    </form>

                    <div class="newsletter-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">✓</span>
                            <span>Tutoriais exclusivos</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">✓</span>
                            <span>Cases de uso reais</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">✓</span>
                            <span>Early access a features</span>
                        </div>
                    </div>

                    <p class="newsletter-privacy">
                        🔒 Seus dados estão seguros. Sem spam. Cancele quando quiser.
                    </p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener to form
        document.getElementById('newsletter-form').addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });
    }

    showModal() {
        if (this.hasShown) return;
        
        const lastClosed = localStorage.getItem('newsletter_closed');
        const now = Date.now();
        
        // Don't show if closed in last 24 hours
        if (lastClosed && (now - parseInt(lastClosed)) < 24 * 60 * 60 * 1000) {
            return;
        }
        
        const modal = document.getElementById('newsletter-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.hasShown = true;
            
            // Analytics tracking
            this.trackEvent('newsletter_modal_shown');
        }
    }

    closeModal() {
        const modal = document.getElementById('newsletter-modal');
        if (modal) {
            modal.style.display = 'none';
            localStorage.setItem('newsletter_closed', Date.now().toString());
            
            // Analytics tracking
            this.trackEvent('newsletter_modal_closed');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        const submitBtn = e.target.querySelector('.newsletter-submit');
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inscrevendo...';
        
        try {
            // TODO: Replace with your actual API endpoint
            // await fetch('/api/newsletter/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success
            localStorage.setItem('newsletter_subscribed', 'true');
            this.showSuccess();
            
            // Analytics tracking
            this.trackEvent('newsletter_subscribed', { email });
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Tentar novamente';
            alert('Erro ao inscrever. Por favor, tente novamente.');
        }
    }

    showSuccess() {
        const content = document.querySelector('.newsletter-content');
        content.innerHTML = `
            <div class="newsletter-success">
                <div class="success-icon">✓</div>
                <h2>Inscrição confirmada!</h2>
                <p>
                    Obrigado por se inscrever! Você receberá nossos 
                    melhores conteúdos diretamente no seu email.
                </p>
                <button class="newsletter-submit" onclick="newsletterModal.closeModal()">
                    Fechar
                </button>
            </div>
        `;
        
        // Auto close after 3 seconds
        setTimeout(() => this.closeModal(), 3000);
    }

    trackEvent(eventName, data = {}) {
        // Track with your analytics service
        if (window.trackEvent) {
            window.trackEvent(eventName, data);
        }
        console.log('Newsletter Event:', eventName, data);
    }
}

// Initialize newsletter modal
let newsletterModal;
document.addEventListener('DOMContentLoaded', () => {
    newsletterModal = new NewsletterModal();
});
