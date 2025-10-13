/**
 * This script enhances the portfolio with several animations and interactive effects.
 * To improve performance, it uses throttling for scroll events.
 * The code is structured into modules for better readability and maintainability.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    
    /**
     * Throttles a function to limit its execution to once every specified time limit.
     * @param {Function} func The function to throttle.
     * @param {number} limit The time limit in milliseconds.
     * @returns {Function} The throttled function.
     */
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // --- INITIALIZATION ---

    const isDesktop = window.matchMedia("(min-width: 901px)").matches;

    setupPreloader();
    setupTextAnimations();
    setupNavigation(isDesktop);
    setupScrollHandling(throttle, isDesktop);
    if (isDesktop) {
        setupDesktopEffects();
    }
});


/**
 * Handles the preloader and the initial hero title animation.
 */
function setupPreloader() {
    const preloader = document.querySelector('.preloader');
    const heroTitle = document.querySelector('.text-shuffle');
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
        preloader?.classList.add('hidden');
        document.body.classList.remove('loading');
        if (heroTitle) {
            textShuffleEffect(heroTitle);
        }
    });
}

/**
 * Sets up all text-related animations.
 */
function setupTextAnimations() {
    // Hero title shuffle effect
    window.textShuffleEffect = (element) => {
        const originalText = element.dataset.text;
        if (!originalText) return;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
        let interval = null;
        let iteration = 0;

        element.textContent = "";

        interval = setInterval(() => {
            element.textContent = originalText.split("")
                .map((letter, index) => (index < iteration) ? originalText[index] : letters[Math.floor(Math.random() * letters.length)])
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 40);
    };

    // Title character animation for section headings
    document.querySelectorAll('.projects-title-section h2, .skills-content h2, .about-contact-content h2').forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'title-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--char-delay', `${index * 0.05}s`);
            title.appendChild(span);
        });
    });
}

/**
 * Sets up mobile and desktop navigation functionality.
 * @param {boolean} isDesktop Flag for desktop-specific logic.
 */
function setupNavigation(isDesktop) {
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mainNavLinks = document.querySelectorAll('.main-nav a');
    const activePill = document.querySelector('.main-nav .active-pill');

    // Mobile navigation toggle
    if (hamburgerButton && mobileNav) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // Desktop navigation click handling
    mainNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection?.scrollIntoView({ behavior: 'smooth' });

            // Instantly move the active pill for better perceived performance
            if (isDesktop && activePill) {
                activePill.style.width = `${this.offsetWidth}px`;
                activePill.style.left = `${this.parentElement.offsetLeft}px`;
            }
        });
    });
}

/**
 * Handles all scroll-triggered animations and behaviors.
 * @param {Function} throttle The throttle utility function.
 * @param {boolean} isDesktop Flag for desktop-specific logic.
 */
function setupScrollHandling(throttle, isDesktop) {
    const sections = document.querySelectorAll('section');
    const toolbar = document.querySelector('.section-indicator');
    const indicatorLinks = document.querySelectorAll('.main-nav a');
    const activePill = document.querySelector('.main-nav .active-pill');
    const sectionsWithId = Array.from(document.querySelectorAll('section[id]'));
    let lastScrollY = window.scrollY;

    // Use IntersectionObserver for animations that trigger when an element is in view.
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => sectionObserver.observe(section));

    // The main scroll handler function, which will be throttled.
    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // Hide/show toolbar on scroll
        if (toolbar) {
            if (scrollPosition > lastScrollY && scrollPosition > 100) {
                toolbar.classList.add('hidden');
            } else {
                toolbar.classList.remove('hidden');
            }
            lastScrollY = scrollPosition <= 0 ? 0 : scrollPosition;
        }

        // Update active navigation link based on scroll position
        let currentSectionId = '';
        sectionsWithId.forEach(section => {
            if (scrollPosition >= section.offsetTop - window.innerHeight / 2) {
                currentSectionId = section.id;
            }
        });

        indicatorLinks.forEach(link => {
            const isLinkActive = link.getAttribute('href') === `#${currentSectionId}`;
            link.classList.toggle('active', isLinkActive);

            // Move the active pill during scroll
            if (isLinkActive && isDesktop && activePill) {
                activePill.style.width = `${link.offsetWidth}px`;
                activePill.style.left = `${link.parentElement.offsetLeft}px`;
            }
        });
    };

    const throttledScrollHandler = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Initial call to set active states correctly on page load.
    setTimeout(handleScroll, 100);
}

/**
 * Sets up effects that are only active on desktop.
 */
function setupDesktopEffects() {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.querySelectorAll('a, button, .skill-card, .project-visual').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }

    // Aurora background effect
    document.addEventListener('mousemove', e => {
        document.body.style.setProperty('--x', `${e.clientX}px`);
        document.body.style.setProperty('--y', `${e.clientY}px`);
    });

    // Magnetic elements effect
    document.querySelectorAll('.section-indicator a, .social-links a').forEach(elem => {
        elem.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            this.style.transition = 'transform 0.1s linear';
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.4}px)`;
        });
        elem.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease-out';
            this.style.transform = 'translate(0,0)';
        });
    });
}