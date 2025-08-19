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
    
    // Initialize profile if on profile page
    if (window.location.hash === '#profile') {
        initializeProfile();
    }
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    // Load user data
    loadUserData();
    
    // Start session tracking
    startSessionTracking();
    
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
    
    // Form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
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

// Export for use in other modules
window.IMI = window.IMI || {};
window.IMI.config = IMI_CONFIG;
window.IMI.utils = window.IMI.utils || {
    debounce,
    throttle
};
window.IMI.data = {
    userData: null,
    sessionData: null
};