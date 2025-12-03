/* ========================================
   GSAP ANIMATIONS
   Scroll-triggered animations, parallax, stagger effects
   ======================================== */

// Import GSAP via CDN (add to HTML):
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP não carregado. Animações desabilitadas.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ========================================
    // HERO ANIMATIONS
    // ========================================

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
        .from('.hero-badge', {
            opacity: 0,
            y: 30,
            duration: 0.8
        })
        .from('.hero-title', {
            opacity: 0,
            y: 50,
            duration: 1,
            scale: 0.9
        }, '-=0.4')
        .from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8
        }, '-=0.6')
        .from('.hero-buttons > *', {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6
        }, '-=0.4');

    // ========================================
    // SCROLL FADE-IN ANIMATIONS
    // ========================================

    gsap.utils.toArray('.product-card, .feature-card, .pricing-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // ========================================
    // SECTION TITLES
    // ========================================

    gsap.utils.toArray('.section-title, .category-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // ========================================
    // STATS COUNTER ANIMATION
    // ========================================

    gsap.utils.toArray('[data-counter]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: duration,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            },
            once: true
        });
    });

    // ========================================
    // PARALLAX EFFECTS
    // ========================================

    gsap.utils.toArray('.parallax').forEach(element => {
        gsap.to(element, {
            y: () => element.offsetHeight * 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // ========================================
    // STAGGER LIST ANIMATIONS
    // ========================================

    gsap.utils.toArray('.product-features, .pricing-features').forEach(list => {
        const items = list.querySelectorAll('li');

        gsap.from(items, {
            scrollTrigger: {
                trigger: list,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // ========================================
    // BUTTON HOVER EFFECTS (GSAP)
    // ========================================

    document.querySelectorAll('.btn-primary, .cta-button, .primary-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ========================================
    // CARD TILT EFFECT (3D)
    // ========================================

    document.querySelectorAll('.product-card, .feature-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // ========================================
    // SMOOTH SCROLL TO ANCHOR
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // ========================================
    // LOGO ENTRANCE ANIMATION
    // ========================================

    gsap.from('.logo', {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out'
    });

    // ========================================
    // NAV LINKS STAGGER
    // ========================================

    gsap.from('.nav-links li', {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.3
    });

    // ========================================
    // TESTIMONIAL CARDS ROTATION
    // ========================================

    const testimonials = gsap.utils.toArray('[data-testimonial]');
    if (testimonials.length > 0) {
        testimonials.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                rotationY: 90,
                duration: 1,
                delay: index * 0.2,
                ease: 'power3.out',
                transformOrigin: 'left center'
            });
        });
    }

    // ========================================
    // PROGRESS BARS ANIMATION
    // ========================================

    gsap.utils.toArray('[data-progress]').forEach(bar => {
        const progress = bar.getAttribute('data-progress');

        ScrollTrigger.create({
            trigger: bar,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(bar, {
                    width: progress + '%',
                    duration: 1.5,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });

    // ========================================
    // REVEAL ANIMATION ON SCROLL
    // ========================================

    gsap.utils.toArray('.reveal').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // ========================================
    // HEADER SCROLL BEHAVIOR
    // ========================================

    let lastScroll = 0;
    const header = document.querySelector('header');

    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
            const currentScroll = self.scroll();

            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                gsap.to(header, {
                    y: -100,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                // Scrolling up
                gsap.to(header, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            lastScroll = currentScroll;
        }
    });

    console.log('✨ GSAP animations initialized');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function animateOnView(selector, animation = {}) {
    gsap.utils.toArray(selector).forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            ...animation
        });
    });
}

// Export for use in other scripts
window.avilaAnimations = {
    animateOnView
};
