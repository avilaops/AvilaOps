/* ========================================
   A/B TESTING FRAMEWORK
   Test multiple CTA variations, layouts, colors
   ======================================== */

const ABTest = {
    // Active tests
    tests: {},

    // User assignment storage
    assignments: {},

    // Initialize A/B testing
    init: () => {
        // Load saved assignments
        const saved = localStorage.getItem('ab_tests');
        if (saved) {
            try {
                ABTest.assignments = JSON.parse(saved);
            } catch (e) {
                ABTest.assignments = {};
            }
        }

        console.log('🧪 A/B Testing initialized');
    },

    // Create a new test
    createTest: (testName, variants, options = {}) => {
        const {
            trafficAllocation = 1.0,  // 0-1, percentage of users to include
            persistent = true,         // Remember user's variant across sessions
            onAssign = null           // Callback when user is assigned
        } = options;

        ABTest.tests[testName] = {
            variants,
            trafficAllocation,
            persistent,
            onAssign
        };

        // Get or assign variant for this user
        const variant = ABTest.getVariant(testName);

        // Track assignment
        if (window.Analytics) {
            Analytics.trackEvent('AB Test Assignment', {
                test: testName,
                variant: variant
            });
        }

        return variant;
    },

    // Get user's variant for a test
    getVariant: (testName) => {
        const test = ABTest.tests[testName];
        if (!test) {
            console.warn(`Test "${testName}" not found`);
            return null;
        }

        // Check if user already has assignment
        if (test.persistent && ABTest.assignments[testName]) {
            return ABTest.assignments[testName];
        }

        // Check traffic allocation
        if (Math.random() > test.trafficAllocation) {
            return null; // User not in test
        }

        // Assign random variant
        const variants = Object.keys(test.variants);
        const variant = variants[Math.floor(Math.random() * variants.length)];

        // Save assignment
        if (test.persistent) {
            ABTest.assignments[testName] = variant;
            localStorage.setItem('ab_tests', JSON.stringify(ABTest.assignments));
        }

        // Call callback
        if (test.onAssign) {
            test.onAssign(variant);
        }

        return variant;
    },

    // Apply variant to element
    applyVariant: (testName, element) => {
        const variant = ABTest.getVariant(testName);
        if (!variant) return;

        const test = ABTest.tests[testName];
        const config = test.variants[variant];

        // Apply text changes
        if (config.text) {
            element.textContent = config.text;
        }

        // Apply HTML changes
        if (config.html) {
            element.innerHTML = config.html;
        }

        // Apply style changes
        if (config.style) {
            Object.assign(element.style, config.style);
        }

        // Apply class changes
        if (config.class) {
            element.className = config.class;
        }

        // Apply attribute changes
        if (config.attributes) {
            Object.entries(config.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        // Mark element as tested
        element.setAttribute('data-ab-test', testName);
        element.setAttribute('data-ab-variant', variant);
    },

    // Track conversion for a test
    trackConversion: (testName, conversionName, value = 1) => {
        const variant = ABTest.getVariant(testName);
        if (!variant) return;

        if (window.Analytics) {
            Analytics.trackEvent('AB Test Conversion', {
                test: testName,
                variant: variant,
                conversion: conversionName,
                value: value.toString()
            });
        }
    },

    // Get statistics for a test
    getStats: (testName) => {
        // This would typically pull from your analytics backend
        // For now, just return the current assignment
        return {
            test: testName,
            variant: ABTest.getVariant(testName),
            assignment: ABTest.assignments[testName] || null
        };
    },

    // Reset test (for development)
    resetTest: (testName) => {
        delete ABTest.assignments[testName];
        localStorage.setItem('ab_tests', JSON.stringify(ABTest.assignments));
    },

    // Reset all tests
    resetAll: () => {
        ABTest.assignments = {};
        localStorage.removeItem('ab_tests');
    }
};

// ========================================
// PREDEFINED TESTS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    ABTest.init();

    // TEST 1: Hero CTA Button Text
    const heroCTATest = ABTest.createTest('hero_cta_text', {
        control: {
            text: '🚀 Teste Grátis por 30 Dias'
        },
        variant_a: {
            text: '✨ Começar Agora - Grátis'
        },
        variant_b: {
            text: '💪 Experimente Sem Compromisso'
        },
        variant_c: {
            text: '🎯 Ative Seu Trial Grátis'
        }
    }, {
        trafficAllocation: 1.0,
        persistent: true
    });

    // Apply to hero CTA
    const heroCTA = document.querySelector('[data-ab="hero-cta"]');
    if (heroCTA) {
        ABTest.applyVariant('hero_cta_text', heroCTA);
    }

    // TEST 2: Pricing Card Colors
    ABTest.createTest('pricing_highlight', {
        control: {
            style: {
                borderColor: '#FF6B35',
                borderWidth: '2px'
            }
        },
        variant_a: {
            style: {
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(253,184,51,0.1))',
                borderColor: '#FF6B35',
                borderWidth: '3px'
            }
        },
        variant_b: {
            style: {
                boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
                transform: 'scale(1.05)'
            }
        }
    });

    // Apply to featured pricing card
    const featuredCard = document.querySelector('[data-ab="pricing-featured"]');
    if (featuredCard) {
        ABTest.applyVariant('pricing_highlight', featuredCard);
    }

    // TEST 3: Social Proof Badge
    ABTest.createTest('social_proof', {
        control: {
            html: '<span>✓</span> <span>Usado por 300+ empresas</span>'
        },
        variant_a: {
            html: '<span>⭐</span> <span>4.9/5 estrelas • 300+ empresas</span>'
        },
        variant_b: {
            html: '<span>🏆</span> <span>Líder de mercado • 300+ clientes</span>'
        },
        variant_c: {
            html: '<span>💎</span> <span>Escolha de empresas Fortune 500</span>'
        }
    });

    // Apply to badge
    const badge = document.querySelector('[data-ab="social-proof"]');
    if (badge) {
        ABTest.applyVariant('social_proof', badge);
    }

    // TEST 4: Pricing Display
    ABTest.createTest('pricing_format', {
        control: {
            html: '<div class="price">$399</div><div class="period">por mês</div>'
        },
        variant_a: {
            html: '<div class="price">$399/mês</div><div class="period">cobrado mensalmente</div>'
        },
        variant_b: {
            html: '<div class="price">Apenas $399</div><div class="period">mensais</div>'
        },
        variant_c: {
            html: '<div class="price">$13.30/dia</div><div class="period">$399 por mês</div>'
        }
    });

    // TEST 5: Feature Presentation
    ABTest.createTest('feature_layout', {
        control: {
            class: 'features-grid grid-3-cols'
        },
        variant_a: {
            class: 'features-grid grid-2-cols feature-cards-large'
        },
        variant_b: {
            class: 'features-list vertical-stack'
        }
    });

    // Setup conversion tracking
    document.querySelectorAll('[data-conversion]').forEach(element => {
        element.addEventListener('click', () => {
            const testName = element.getAttribute('data-ab-test');
            const conversionName = element.getAttribute('data-conversion');

            if (testName && conversionName) {
                ABTest.trackConversion(testName, conversionName);
            }
        });
    });

    console.log('🧪 A/B tests configured:', Object.keys(ABTest.tests));
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Show different content based on variant
function showForVariant(testName, variant, callback) {
    if (ABTest.getVariant(testName) === variant) {
        callback();
    }
}

// Get conversion rate (would typically come from backend)
function getConversionRate(testName) {
    // This is a placeholder - in production, fetch from analytics backend
    return {
        test: testName,
        variants: {
            control: { conversions: 42, visitors: 1000, rate: 4.2 },
            variant_a: { conversions: 58, visitors: 1000, rate: 5.8 },
            variant_b: { conversions: 51, visitors: 1000, rate: 5.1 }
        },
        winner: 'variant_a',
        confidence: 95
    };
}

// ========================================
// EXAMPLE USAGE IN HTML
// ========================================

/*
<!-- Hero CTA with A/B test -->
<button data-ab="hero-cta" data-conversion="cta_click">
    Default Text (will be replaced by variant)
</button>

<!-- Track conversion on form submit -->
<form data-ab-test="hero_cta_text" data-conversion="signup">
    ...
</form>

<!-- Show content only for specific variant -->
<script>
    showForVariant('pricing_format', 'variant_c', () => {
        document.querySelector('.special-offer').style.display = 'block';
    });
</script>

<!-- Manual conversion tracking -->
<button onclick="ABTest.trackConversion('hero_cta_text', 'demo_request')">
    Request Demo
</button>
*/

// Export for global use
window.ABTest = ABTest;
window.showForVariant = showForVariant;
window.getConversionRate = getConversionRate;
