/* ========================================
   MOBILE NAVIGATION
   Hamburger menu and mobile-friendly navigation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Create mobile menu toggle button if it doesn't exist
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks && window.innerWidth <= 768) {
        initMobileMenu();
    }

    // Reinitialize on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            initMobileMenu();
        } else {
            removeMobileMenu();
        }
    });
});

function initMobileMenu() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (!nav || !navLinks) return;

    // Check if hamburger already exists
    if (document.querySelector('.mobile-menu-toggle')) return;

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'mobile-menu-toggle';
    hamburger.setAttribute('aria-label', 'Toggle mobile menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;

    // Insert hamburger before nav-links
    nav.insertBefore(hamburger, navLinks);

    // Add mobile menu class to nav-links
    navLinks.classList.add('mobile-menu');

    // Toggle menu on click
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-menu-open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-menu-open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navLinks.classList.contains('mobile-menu-open')) {
            navLinks.classList.remove('mobile-menu-open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

function removeMobileMenu() {
    const hamburger = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.remove();
    }

    if (navLinks) {
        navLinks.classList.remove('mobile-menu', 'mobile-menu-open');
        document.body.style.overflow = '';
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MobileNav = {
        init: initMobileMenu,
        remove: removeMobileMenu
    };
}
