// js/main.js - Main Initialization

// Global configuration
const IMI_CONFIG = {
    API_BASE_URL: '/api', // Update with actual API endpoint
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    AUTO_SAVE_INTERVAL: 2000, // 2 seconds
    COLORS: {
        blue: '#042847',
        yellow: '#ffd502',
        darkGray: '#231f20'
    }
};

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('IMI Student Dashboard v0.2 initializing...');
    
    // Initialize all modules
    initializeNavigation();
    initializeBlueprintChallenge();
    initializeModal();
    initializeCompanies();
    initializeTimeTracking();
    
    // Initialize page-specific modules based on current page
    const currentPage = window.location.hash.slice(1) || 'dashboard';
    if (currentPage === 'profile') {
        setTimeout(() => {
            if (typeof initializeProfile === 'function') {
                initializeProfile();
            }
        }, 100);
    } else if (currentPage === 'notifications') {
        setTimeout(() => {
            if (typeof initializeNotifications === 'function') {
                initializeNotifications();
            }
        }, 100);
    }
    
    // Set up global event listeners
    setupGlobalEventListeners();

    // Load user data
    loadUserData();

    // Start session tracking
    startSessionTracking();

    // Update notification badge count
    updateNotificationBadgeCount();
    
    // Set up redemption handlers for dashboard (after a small delay to ensure DOM is ready)
    setTimeout(() => {
        setupDashboardRedemptionHandlers();
    }, 100);
    
    // Also set up a global click handler as a fallback
    document.addEventListener('click', function(e) {
        // Handle redemption clicks
        if (e.target && e.target.matches('.redemption-item .btn.btn-primary-small')) {
            const btn = e.target;
            if (btn.textContent.trim() === 'Redeem' && !btn.disabled) {
                handleRedemption(btn);
            }
        }
    });
    
    console.log('IMI Student Dashboard ready');
});

// Load user data
function loadUserData() {
    // In production, this would fetch from API
    const userData = {
        name: 'Jane Doe',
        initials: 'JD',
        streak: 12,
        xp: 1850,
        tier: 'Gold',
        totalHours: 324,
        activeProjects: 5,
        companies: 3
    };
    
    // Update UI with user data
    updateUserInterface(userData);
}

// Update user interface with data
function updateUserInterface(userData) {
    // Update profile elements
    const avatars = document.querySelectorAll('.user-avatar, .profile-avatar');
    avatars.forEach(avatar => {
        avatar.textContent = userData.initials;
    });
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.profile-info h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${userData.name.split(' ')[0]}!`;
    }
    
    // Update stats
    updateDashboardStats(userData);
}

// Update dashboard statistics
function updateDashboardStats(data) {
    const statElements = {
        '.stat-value.hours': data.totalHours,
        '.stat-value.projects': data.activeProjects,
        '.stat-value.companies': data.companies,
        '.streak-value': `${data.streak} day streak`,
        '.points-value': `${data.points} pts`,
        '.rank-value': `#${data.rank}`
    };
    
    Object.entries(statElements).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });
}

// Session tracking
let sessionStartTime = Date.now();
let currentPage = 'dashboard';
let sessionTimer = null;

function startSessionTracking() {
    // Track page time
    sessionTimer = setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
        // Update session timer in UI if needed
        updateSessionTime(elapsedMinutes);
    }, 60000); // Update every minute
    
    // Track page changes
    document.addEventListener('pageChange', (event) => {
        logPageTime(currentPage, Date.now() - sessionStartTime);
        currentPage = event.detail.page;
        sessionStartTime = Date.now();
    });
    
    // Track before unload
    window.addEventListener('beforeunload', () => {
        logPageTime(currentPage, Date.now() - sessionStartTime);
    });
}

// Update session time display
function updateSessionTime(minutes) {
    const sessionDisplay = document.getElementById('session-time');
    if (sessionDisplay) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        sessionDisplay.textContent = `${hours}h ${mins}m`;
    }
}

// Log page time for analytics
function logPageTime(page, duration) {
    const seconds = Math.floor(duration / 1000);
    console.log(`Time spent on ${page}: ${seconds} seconds`);
    
    // In production, send to analytics API
    // sendAnalytics('page_time', { page, duration: seconds });
}

// Global event listeners
function setupGlobalEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Click outside handlers
    document.addEventListener('click', handleOutsideClicks);
    
    // Form submissions (exclude profile forms which have their own handlers)
    document.querySelectorAll('form').forEach(form => {
        // Skip profile forms, data room forms, and other forms with specific handlers
        if (!form.id.includes('personal-info-form') &&
            !form.id.includes('social-links-form') &&
            !form.id.includes('edit-data-room-form') &&
            !form.id.includes('create-data-room-form') &&
            !form.id.includes('idea-form') &&
            !form.id.includes('review-form') &&
            !form.id.includes('time-entry-form')) {
            form.addEventListener('submit', handleFormSubmit);
        }
    });
    
    // Auto-save for textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', debounce(autoSave, IMI_CONFIG.AUTO_SAVE_INTERVAL));
    });
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
    }
    
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentWork();
    }
}

// Handle clicks outside of dropdowns/modals
function handleOutsideClicks(e) {
    // Close dropdowns if clicking outside
    const dropdowns = document.querySelectorAll('.dropdown-menu.active');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target) && !e.target.closest('.dropdown-toggle')) {
            dropdown.classList.remove('active');
        }
    });
}

// Handle form submissions
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formId = e.target.id;
    const formData = new FormData(e.target);
    
    console.log(`Form submitted: ${formId}`, Object.fromEntries(formData));
    
    // Show success message
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Changes saved successfully!', 'success');
    }
    
    // In production, send to API
    // submitForm(formId, formData);
}

// Auto-save functionality
function autoSave(e) {
    const element = e.target;
    const content = element.value;
    const id = element.id || element.name;
    
    if (content.length > 0) {
        console.log(`Auto-saving ${id}...`);
        
        // Update status indicator
        const statusElement = element.closest('.section')?.querySelector('.save-status');
        if (statusElement) {
            statusElement.textContent = '✓ Saved';
            statusElement.classList.add('saved');
        }
        
        // In production, save to API
        // saveContent(id, content);
    }
}

// Focus search input
function focusSearch() {
    const searchInput = document.querySelector('.company-search, .search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

// Save current work
function saveCurrentWork() {
    const activeSection = document.querySelector('.page-section.active');
    if (activeSection) {
        const textareas = activeSection.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.value.length > 0) {
                autoSave({ target: textarea });
            }
        });
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('All changes saved!', 'success');
        }
    }
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle redemption action
function handleRedemption(btn) {
    console.log('Handling redemption for button:', btn);
    
    const redemptionItem = btn.closest('.redemption-item');
    if (!redemptionItem) {
        console.error('Could not find redemption item container');
        return;
    }
    
    const itemName = redemptionItem.querySelector('.redemption-title').textContent;
    const costText = redemptionItem.querySelector('.redemption-cost').textContent;
    
    console.log(`Redeeming: ${itemName} for ${costText}`);
    
    if (confirm(`Redeem ${itemName} for ${costText}?`)) {
        console.log('User confirmed redemption');
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification(`Successfully redeemed ${itemName}!`, 'success');
        }
        
        // Parse cost properly
        const costMatch = costText.match(/(\d+)/);
        if (!costMatch) {
            console.error('Could not parse cost from:', costText);
            return;
        }
        const costXP = parseInt(costMatch[1]);
        console.log('Parsed cost:', costXP);
        
        // Update available XP in sidebar
        const xpAvailableElement = document.querySelector('.text-muted.small');
        if (xpAvailableElement && xpAvailableElement.textContent.includes('XP available')) {
            const currentXPMatch = xpAvailableElement.textContent.match(/([\d,]+)/);
            if (currentXPMatch) {
                const currentXP = parseInt(currentXPMatch[1].replace(/,/g, ''));
                const newBalance = currentXP - costXP;
                console.log(`Updating XP: ${currentXP} - ${costXP} = ${newBalance}`);
                // Format with comma if needed
                const formattedBalance = newBalance.toLocaleString();
                xpAvailableElement.textContent = `${formattedBalance} XP available`;
            }
        }
        
        // Update the gamification stats XP display  
        const statMainElements = document.querySelectorAll('.stat-main');
        statMainElements.forEach(el => {
            if (el.textContent.includes('pts')) {
                const currentXPMatch = el.textContent.match(/([\d,]+)/);
                if (currentXPMatch) {
                    const currentXP = parseInt(currentXPMatch[1].replace(/,/g, ''));
                    const newBalance = currentXP - costXP;
                    console.log(`Updating stat display: ${currentXP} - ${costXP} = ${newBalance}`);
                    // Format with comma if needed
                    const formattedBalance = newBalance.toLocaleString();
                    el.textContent = `${formattedBalance} pts`;
                }
            }
        });
        
        // Disable the button and change appearance
        btn.disabled = true;
        btn.textContent = 'Redeemed';
        btn.classList.add('redeemed');
        
        console.log('Redemption completed');
    } else {
        console.log('User cancelled redemption');
    }
}

// Set up redemption handlers for dashboard
function setupDashboardRedemptionHandlers() {
    console.log('Setting up dashboard redemption handlers...');
    
    // Handle redemption buttons on the dashboard sidebar
    const dashboardRedeemButtons = document.querySelectorAll('.redemption-item .btn.btn-primary-small');
    
    console.log('Found redemption buttons:', dashboardRedeemButtons.length);
    
    dashboardRedeemButtons.forEach((btn, index) => {
        // Only add handler if button text is "Redeem"
        if (btn.textContent.trim() === 'Redeem') {
            console.log(`Adding handler to button ${index + 1}: ${btn.textContent}`);
            
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleRedemption(this);
            });
        } else {
            console.log(`Skipping button ${index + 1} with text: "${btn.textContent}"`);
        }
    });
}

// Update notification badge count on initial load
function updateNotificationBadgeCount() {
    // Count unread notifications if they exist in DOM
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');

    if (badge) {
        // If we can count actual unread notifications, use that count
        if (unreadNotifications.length > 0) {
            badge.textContent = unreadNotifications.length;
            badge.style.display = 'flex';
        } else {
            // Otherwise use the default (6 unread messages as per actual content)
            // This ensures consistency even before navigating to notifications page
            const currentCount = parseInt(badge.textContent) || 6;
            badge.textContent = currentCount;
            badge.style.display = currentCount > 0 ? 'flex' : 'none';
        }
    }
}

// Export for use in other modules
window.IMI = window.IMI || {};
window.IMI.config = IMI_CONFIG;
window.IMI.utils = window.IMI.utils || {
    debounce,
    throttle
    // showNotification is now provided by the universal toast system in toast.js
};
window.IMI.data = {
    userData: null,
    sessionData: null
};