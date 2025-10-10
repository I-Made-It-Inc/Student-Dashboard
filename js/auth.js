// js/auth.js - Authentication System

console.log('🔐 Auth module loading...');

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('imi_authenticated') === 'true';
}

// Login with developer mode
function loginDeveloperMode() {
    console.log('🚀 Developer mode login');

    // Store auth
    sessionStorage.setItem('imi_authenticated', 'true');
    sessionStorage.setItem('imi_auth_mode', 'developer');
    sessionStorage.setItem('imi_user_email', 'developer@imadeit.ai');
    sessionStorage.setItem('imi_user_name', 'Jane Doe (Developer)');

    console.log('✅ Session stored, reloading page to initialize app...');

    // Show notification before reload
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Developer mode activated', 'success');
    }

    // Reload the page - this will trigger main.js to see we're authenticated and initialize everything properly
    setTimeout(() => {
        window.location.href = 'index.html#dashboard';
        window.location.reload();
    }, 500);
}

// Logout
function logout() {
    console.log('🚪 Logging out...');

    // Clear session
    sessionStorage.clear();

    // Hide navigation
    const nav = document.querySelector('.nav');
    if (nav) nav.style.display = 'none';

    // Hide all pages first
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show login page
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
        loginPage.classList.add('active');
    }

    // Set hash to login
    window.location.hash = 'login';

    // Prevent URL manipulation after logout - force back to login if they change the hash
    window.addEventListener('hashchange', function preventURLBypass() {
        if (sessionStorage.getItem('imi_authenticated') !== 'true') {
            console.log('❌ Hash change blocked - not authenticated');
            window.location.hash = 'login';
            // Hide all pages except login
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            const loginPage = document.getElementById('login-page');
            if (loginPage) loginPage.classList.add('active');
        }
    });

    // Show notification
    setTimeout(() => {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('Logged out successfully', 'success');
        }
    }, 100);
}

// Set up login button click handlers using event delegation
document.addEventListener('click', function(e) {
    // Developer mode button
    if (e.target && (e.target.id === 'developer-mode-btn' || e.target.closest('#developer-mode-btn'))) {
        console.log('🎯 Developer mode button clicked');
        e.preventDefault();
        loginDeveloperMode();
    }

    // Microsoft login button
    if (e.target && (e.target.id === 'microsoft-login-btn' || e.target.closest('#microsoft-login-btn'))) {
        console.log('🎯 Microsoft login button clicked');
        e.preventDefault();
        alert('Microsoft authentication is not yet configured.\n\nPlease update js/config.js with your Azure AD credentials.');
    }
});

// Export to global
window.IMI = window.IMI || {};
window.IMI.auth = {
    isAuthenticated,
    logout
};

console.log('🔐 Auth module loaded');
