// js/toast.js - Universal Toast Notification System

// Toast configuration
const TOAST_CONFIG = {
    duration: 3000,
    maxToasts: 5,
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left
    animationDuration: 300
};

// Toast container
let toastContainer = null;

// Initialize toast system
function initializeToastSystem() {
    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = `toast-container toast-${TOAST_CONFIG.position}`;
        document.body.appendChild(toastContainer);
    }
}

// Main toast function
function showToast(message, type = 'info', options = {}) {
    // Initialize container if needed
    initializeToastSystem();

    // Configuration with defaults
    const config = {
        duration: options.duration || TOAST_CONFIG.duration,
        closable: options.closable !== false, // Default to true
        icon: options.icon || getDefaultIcon(type),
        title: options.title || null
    };

    // Limit number of toasts
    const existingToasts = toastContainer.children;
    if (existingToasts.length >= TOAST_CONFIG.maxToasts) {
        existingToasts[0].remove();
    }

    // Create toast element
    const toast = createToastElement(message, type, config);

    // Add toast with animation
    toastContainer.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto-remove after duration
    const autoRemoveTimer = setTimeout(() => {
        removeToast(toast);
    }, config.duration);

    // Store timer on element for potential cancellation
    toast._autoRemoveTimer = autoRemoveTimer;

    return toast;
}

// Create toast element
function createToastElement(message, type, config) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = config.icon ? `<span class="toast-icon">${config.icon}</span>` : '';
    const title = config.title ? `<div class="toast-title">${config.title}</div>` : '';
    const closeButton = config.closable ? '<button class="toast-close" aria-label="Close">&times;</button>' : '';

    toast.innerHTML = `
        <div class="toast-content">
            ${icon}
            <div class="toast-text">
                ${title}
                <div class="toast-message">${message}</div>
            </div>
            ${closeButton}
        </div>
    `;

    // Add close functionality
    if (config.closable) {
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));
    }

    // Add click to dismiss
    toast.addEventListener('click', () => removeToast(toast));

    return toast;
}

// Remove toast with animation
function removeToast(toast) {
    if (!toast || !toast.parentElement) return;

    // Clear auto-remove timer
    if (toast._autoRemoveTimer) {
        clearTimeout(toast._autoRemoveTimer);
    }

    // Add exit animation
    toast.classList.add('toast-hide');

    // Remove from DOM after animation
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, TOAST_CONFIG.animationDuration);
}

// Get default icon for toast type
function getDefaultIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
    };
    return icons[type] || icons.info;
}

// Convenience methods for different toast types
const Toast = {
    success: (message, options = {}) => showToast(message, 'success', options),
    error: (message, options = {}) => showToast(message, 'error', options),
    warning: (message, options = {}) => showToast(message, 'warning', options),
    info: (message, options = {}) => showToast(message, 'info', options),
    loading: (message, options = {}) => showToast(message, 'loading', { ...options, duration: 10000 }),

    // Special methods
    custom: (message, type, options) => showToast(message, type, options),
    clear: () => {
        if (toastContainer) {
            toastContainer.innerHTML = '';
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeToastSystem);

// Export for global use
window.Toast = Toast;
window.showToast = showToast;

// Legacy compatibility - update the main IMI utils function
if (window.IMI && window.IMI.utils) {
    window.IMI.utils.showNotification = (message, type = 'info') => {
        return showToast(message, type);
    };
}

// Also provide the function as a global for pages that use it directly
window.showNotification = (message, type = 'info') => {
    return showToast(message, type);
};