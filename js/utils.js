// js/utils.js - Utility Functions and Helpers

// Utility functions module
(function(window) {
    'use strict';
    
    // Create namespace if not exists
    window.IMI = window.IMI || {};
    window.IMI.utils = window.IMI.utils || {};
    
    // Debounce function - delays execution until after wait milliseconds
    window.IMI.utils.debounce = function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    };
    
    // Throttle function - limits execution to once per limit milliseconds
    window.IMI.utils.throttle = function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    // Show notification
    window.IMI.utils.showNotification = function(message, type = 'info', duration = 3000) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Add icon based on type
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;
        
        // Add styles if not already in stylesheet
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    opacity: 0;
                    transform: translateX(400px);
                    transition: all 0.3s ease;
                    max-width: 400px;
                    border-left: 4px solid;
                }
                
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left-color: #4caf50;
                    background: #f1f8f4;
                }
                
                .notification-error {
                    border-left-color: #f44336;
                    background: #fef1f0;
                }
                
                .notification-warning {
                    border-left-color: #ff9800;
                    background: #fff8e1;
                }
                
                .notification-info {
                    border-left-color: #042847;
                    background: #f0f4ff;
                }
                
                .notification-icon {
                    font-size: 20px;
                    font-weight: bold;
                }
                
                .notification-success .notification-icon { color: #4caf50; }
                .notification-error .notification-icon { color: #f44336; }
                .notification-warning .notification-icon { color: #ff9800; }
                .notification-info .notification-icon { color: #042847; }
                
                .notification-message {
                    flex: 1;
                    color: #231f20;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                @media (max-width: 640px) {
                    .notification {
                        top: auto;
                        bottom: 20px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        return notification;
    };
    
    // Format date
    window.IMI.utils.formatDate = function(date, format = 'short') {
        const d = new Date(date);
        
        const formats = {
            'short': { month: 'short', day: 'numeric' },
            'medium': { month: 'short', day: 'numeric', year: 'numeric' },
            'long': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
            'time': { hour: '2-digit', minute: '2-digit' },
            'datetime': { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        };
        
        return d.toLocaleDateString('en-US', formats[format] || formats.short);
    };
    
    // Format number with commas
    window.IMI.utils.formatNumber = function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // Format time duration
    window.IMI.utils.formatDuration = function(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) {
            return `${mins}m`;
        } else if (mins === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${mins}m`;
        }
    };
    
    // Get relative time
    window.IMI.utils.getRelativeTime = function(date) {
        const now = new Date();
        const then = new Date(date);
        const diff = now - then;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    };
    
    // Validate email
    window.IMI.utils.validateEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Validate phone
    window.IMI.utils.validatePhone = function(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };
    
    // Generate unique ID
    window.IMI.utils.generateId = function(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    
    // Local storage helpers
    window.IMI.utils.storage = {
        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error writing to localStorage:', e);
                return false;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing localStorage:', e);
                return false;
            }
        }
    };
    
    // Session storage helpers
    window.IMI.utils.session = {
        get: function(key) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from sessionStorage:', e);
                return null;
            }
        },
        
        set: function(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error writing to sessionStorage:', e);
                return false;
            }
        },
        
        remove: function(key) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from sessionStorage:', e);
                return false;
            }
        }
    };
    
    // Cookie helpers
    window.IMI.utils.cookie = {
        set: function(name, value, days = 7) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
        },
        
        get: function(name) {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        
        remove: function(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
    };
    
    // API request helper
    window.IMI.utils.apiRequest = async function(endpoint, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        
        const config = { ...defaultOptions, ...options };
        
        // Add auth token if exists
        const token = window.IMI.utils.storage.get('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(`${window.IMI.config.API_BASE_URL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Request failed:', error);
            return { success: false, error: error.message };
        }
    };
    
    // Export CSV
    window.IMI.utils.exportCSV = function(data, filename = 'export.csv') {
        if (!data || !data.length) {
            window.IMI.utils.showNotification('No data to export', 'warning');
            return;
        }
        
        // Get headers
        const headers = Object.keys(data[0]);
        
        // Build CSV content
        let csv = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                const escaped = value.toString().replace(/"/g, '""');
                return escaped.includes(',') ? `"${escaped}"` : escaped;
            });
            csv += values.join(',') + '\n';
        });
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        window.IMI.utils.showNotification('CSV exported successfully', 'success');
    };
    
    // Deep clone object
    window.IMI.utils.deepClone = function(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => window.IMI.utils.deepClone(item));
        if (obj instanceof Object) {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = window.IMI.utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    };
    
    // Check if element is in viewport
    window.IMI.utils.isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Smooth scroll to element
    window.IMI.utils.scrollToElement = function(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };
    
})(window);