/**
 * Application Configuration
 * Auto-generated from .env file - DO NOT EDIT DIRECTLY
 * Generated on: 2026-01-28T17:51:14.705Z
 */

// Asset version for cache busting
const ASSET_VERSION = '1.0.23';

// Export for use in other scripts
window.APP_CONFIG = {
    ASSET_VERSION: ASSET_VERSION
};

// Also set the legacy window.ASSET_VERSION for backward compatibility
window.ASSET_VERSION = ASSET_VERSION;

function applyCacheBusting() {
    const version = ASSET_VERSION;
    const selector = 'link[href*="?v="], script[src*="?v="], img[src*="?v="]';
    document.querySelectorAll(selector).forEach((el) => {
        const attr = el.tagName === 'LINK' ? 'href' : 'src';
        const rawValue = el.getAttribute(attr);
        if (!rawValue) {
            return;
        }

        const url = new URL(rawValue, window.location.href);
        if (!url.searchParams.has('v')) {
            return;
        }

        url.searchParams.set('v', version);
        const updatedValue = `${url.pathname}${url.search}`;
        el.setAttribute(attr, updatedValue);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCacheBusting);
} else {
    applyCacheBusting();
}

function startAutoReload() {
    const checkIntervalMs = 60000;
    const currentVersion = ASSET_VERSION;

    setInterval(async () => {
        try {
            const response = await fetch(`assets/js/config.js?v=${Date.now()}`);
            const text = await response.text();
            const match = text.match(/ASSET_VERSION\s*=\s*'([^']+)'/);
            if (match && match[1] && match[1] !== currentVersion) {
                window.location.reload();
            }
        } catch (error) {
            console.warn('Auto-reload check failed:', error);
        }
    }, checkIntervalMs);
}

startAutoReload();

console.log('Config loaded - Asset version:', ASSET_VERSION);
