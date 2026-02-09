// ====================================
// Main JavaScript File
// ====================================

console.log('main.js loaded and executing');

// ====================================
// Dynamic Copyright Year
// ====================================

// Function to set the copyright year
function setCopyrightYear() {
    console.log('setCopyrightYear function called');
    const currentYearElement = document.getElementById('current-year');
    console.log('currentYearElement:', currentYearElement);
    if (currentYearElement) {
        const year = new Date().getFullYear();
        console.log('Setting year to:', year);
        currentYearElement.textContent = year;
        console.log('Year set successfully');
    } else {
        console.error('current-year element not found');
    }
}

// Set the current year dynamically in footer after components are loaded
document.addEventListener('componentsLoaded', function() {
    console.log('componentsLoaded event fired');
    setCopyrightYear();
    initializeCarousel();

    // Simple Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!e.target.closest('.nav-wrapper') && !e.target.closest('.mobile-menu-toggle')) {
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Initialize Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');

            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0';
                    }
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                // Temporarily set max-height to allow calculation of scrollHeight
                content.style.maxHeight = 'none';
                const scrollHeight = content.scrollHeight;
                content.style.maxHeight = '0';

                // Use setTimeout to ensure the transition works
                setTimeout(() => {
                    content.style.maxHeight = scrollHeight + 'px';
                }, 10);
            }
        });
    });

    // Initialize Registration Modal (only on workshop page)
    initializeRegistrationModal();

    // Auto-open first accordion item
    if (accordionHeaders.length > 0) {
        setTimeout(() => {
            accordionHeaders[0].click();
        }, 500);
    }

    // Smooth Scroll for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Animate on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.about-card, .sermon-card, .connected-card, .event-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') &&
            !e.target.closest('.nav-menu') &&
            !e.target.closest('.mobile-menu-toggle')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Form Validation (if forms exist)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Set active nav link based on current page
    const currentLocation = location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentLocation) {
            link.classList.add('active');
        }
    });

    // Lazy Loading Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Also try to set it immediately in case components are already loaded
console.log('Checking if components are already loaded...');
if (document.getElementById('header-placeholder') &&
    document.getElementById('footer-placeholder') &&
    !document.getElementById('header-placeholder').innerHTML.includes('placeholder') &&
    !document.getElementById('footer-placeholder').innerHTML.includes('placeholder')) {
    console.log('Components appear to be already loaded, setting copyright year');
    setCopyrightYear();
}

// ====================================
// Registration Modal Functionality
// ====================================

function initializeRegistrationModal() {
    console.log('Initializing registration modal...');

    // Only initialize on pages with the modal
    const modal = document.getElementById('registration-modal');
    if (!modal) {
        console.log('Registration modal not found on this page');
        return;
    }

    const registrationButtons = document.querySelectorAll('.open-registration-modal');
    const floatingCta = document.querySelector('.floating-registration-cta');
    const mobileBanner = document.querySelector('.mobile-registration-banner');
    const closeBtn = modal.querySelector('.registration-modal__close');
    const overlay = modal.querySelector('[data-close-modal]');
    const modalIframe = document.getElementById('registration-modal-iframe');
    const modalSpinner = document.getElementById('registration-modal-spinner');
    let formLoaded = false;

    // Show floating CTA and mobile banner after page load
    setTimeout(() => {
        if (floatingCta) {
            floatingCta.style.display = 'block';
        }

        if (mobileBanner) {
            mobileBanner.style.display = 'block';
        }
    }, 1000);

    function setBodyScroll(disable) {
        if (disable) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }

    function showSpinner() {
        if (modalSpinner) {
            modalSpinner.classList.remove('is-hidden');
        }

        if (modalIframe) {
            modalIframe.classList.add('is-hidden');
        }
    }

    function hideSpinner() {
        if (modalSpinner) {
            modalSpinner.classList.add('is-hidden');
        }

        if (modalIframe) {
            modalIframe.classList.remove('is-hidden');
        }
    }

    function openModal(event) {
        if (event) {
            event.preventDefault();
        }

        if (modal.classList.contains('is-visible')) {
            return;
        }

        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        setBodyScroll(true);

        if (!formLoaded) {
            showSpinner();
        } else {
            hideSpinner();
        }

        if (modalIframe && !modalIframe.src) {
            modalIframe.src = modalIframe.dataset.src;
        }
    }

    function closeModal() {
        if (!modal.classList.contains('is-visible')) {
            return;
        }

        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        setBodyScroll(false);
    }

    // Event listeners
    registrationButtons.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    if (modalIframe) {
        modalIframe.addEventListener('load', () => {
            formLoaded = true;
            hideSpinner();
        });
    }

    console.log('Registration modal initialized successfully');
}

// ====================================
// Hero Carousel Functionality
// ====================================

function initializeCarousel() {
    console.log('Initializing carousel...');
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) {
        console.log('Carousel element not found');
        return;
    }

    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    console.log('Found elements:', { slides: slides.length, indicators: indicators.length, prevBtn: !!prevBtn, nextBtn: !!nextBtn });

    let currentSlide = 0;
    let slideInterval;

    // Initialize carousel
    function init() {
        showSlide(currentSlide);
        startAutoSlide();
    }

    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // Show current slide
        slides[index].classList.add('active');
        currentSlide = index;
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Go to specific slide
    function goToSlide(index) {
        showSlide(index);
    }

    // Start auto slide
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop auto slide
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    }

    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide
        });
    });

    // Pause auto slide on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });

    // Initialize
    init();
    console.log('Carousel initialized successfully');
}