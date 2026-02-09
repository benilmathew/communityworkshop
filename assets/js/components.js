/**
 * Component Loader
 * Loads header and footer components into pages
 */

console.log('components.js loaded successfully');

// Google Analytics - Replace 'GA_MEASUREMENT_ID' with your actual tracking ID
async function loadComponent(elementId, componentPath) {
    try {
        // Add cache busting to prevent loading cached versions
        const cacheBustUrl = `${componentPath}?v=${Date.now()}`;
        const response = await fetch(cacheBustUrl);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function initializeGoogleAnalytics() {
    // Check if user has consented to cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent !== 'accepted') {
        return; // Don't load GA if not consented
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-62PVJWW6H9';
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-62PVJWW6H9');
    `;
    document.head.appendChild(script2);
}

// Cookie Consent Banner
function createCookieConsentBanner() {
    // Check if user has already made a choice
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    // Create banner element
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            z-index: 10000;
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            line-height: 1.5;
        ">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 300px;">
                    <strong>Cookie Preferences</strong><br>
                    We use cookies to analyze site traffic and improve your experience. By continuing to use our site, you consent to our use of cookies.
                </div>
                <div style="display: flex; gap: 10px; flex-shrink: 0;">
                    <button id="accept-cookies" style="
                        background: #2c5f8d;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: 500;
                    ">Accept</button>
                    <button id="reject-cookies" style="
                        background: transparent;
                        color: white;
                        border: 1px solid #ccc;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Reject</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    // Handle accept button
    document.getElementById('accept-cookies').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.remove();
        initializeGoogleAnalytics(); // Load GA now that consent is given
    });

    // Handle reject button
    document.getElementById('reject-cookies').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'rejected');
        banner.remove();
    });
}

// Show cookie settings modal
function showCookieSettings() {
    // Create settings modal
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Arial', sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        text-align: center;
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c3e50; font-size: 24px;">Cookie Preferences</h3>
        <p style="margin-bottom: 25px; color: #666; line-height: 1.6;">
            We use cookies to enhance your browsing experience and analyze site traffic. 
            You can accept or reject these cookies at any time.
        </p>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button id="accept-cookies-btn" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s;
            ">Accept Cookies</button>
            <button id="reject-cookies-btn" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s;
            ">Reject Cookies</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Handle accept button
    document.getElementById('accept-cookies-btn').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        modal.remove();
        // Reload Google Analytics if it wasn't loaded
        if (!window.gtag) {
            initializeGoogleAnalytics();
        }
        alert('Cookie preferences saved! Analytics tracking is now enabled.');
    });

    // Handle reject button
    document.getElementById('reject-cookies-btn').addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'rejected');
        modal.remove();
        alert('Cookie preferences saved! Analytics tracking is disabled.');
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Load component from file
async function loadComponent(elementId, componentPath) {
    try {
        console.log(`Loading component: ${componentPath} into ${elementId}`);
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        const html = await response.text();
        console.log(`Loaded ${componentPath}, HTML length: ${html.length}`);
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Google Analytics (only if consented)
    initializeGoogleAnalytics();
    
    // Show cookie consent banner if needed
    createCookieConsentBanner();
    
    // Determine the correct path based on current location
    const isRootPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const pathPrefix = isRootPage ? '' : '../';
    
    // Load header and footer
    await loadComponent('header-placeholder', `${pathPrefix}components/header.html`);
    await loadComponent('footer-placeholder', `${pathPrefix}components/footer.html`);
    
    // Dispatch event to notify that components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
    
    // Update active nav link after header is loaded
    updateActiveNavLink();
    
    // Initialize carousel after components are loaded (only on homepage)
    if (isRootPage) {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
            if (typeof initializeCarousel === 'function') {
                initializeCarousel();
            }
        }, 100);
    }
    
    // Handle cookie settings link
    setTimeout(() => {
        const cookieLink = document.getElementById('cookie-settings-link');
        if (cookieLink) {
            cookieLink.addEventListener('click', function(e) {
                e.preventDefault();
                showCookieSettings();
            });
        }
    }, 100); // Small delay to ensure footer is loaded
});
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active'); // Remove active from all links first
        
        // Check if it's the homepage
        if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('index.html')) {
            if (linkPath.includes('index.html')) {
                link.classList.add('active');
            }
        } 
        // Check for other pages - match the exact page name
        else if (linkPath && linkPath !== '/index.html' && currentPath.includes(linkPath)) {
            link.classList.add('active');
        }
    });
}
