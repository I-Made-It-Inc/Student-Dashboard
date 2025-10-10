// js/auth.js - Authentication System

console.log('🔐 Auth module loading...');

// Initialize MSAL instance
let msalInstance = null;

// Initialize MSAL when config is loaded
async function initializeMSAL() {
    if (!window.IMI || !window.IMI.config || !window.IMI.config.FEATURES.enableMSAL) {
        console.log('⚠️ MSAL not enabled');
        return;
    }

    const msalConfig = {
        auth: {
            clientId: window.IMI.config.MSAL.clientId,
            authority: window.IMI.config.MSAL.authority,
            redirectUri: window.IMI.config.MSAL.redirectUri,
            navigateToLoginRequestUrl: false, // Prevent auto-navigation after login
        },
        cache: {
            cacheLocation: 'sessionStorage',
            storeAuthStateInCookie: false,
        },
        system: {
            allowRedirectInIframe: false,
            // Use query parameters instead of hash to avoid conflicts with app routing
            windowHashTimeout: 60000,
            iframeHashTimeout: 6000,
        }
    };

    try {
        msalInstance = new msal.PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        console.log('✅ MSAL initialized successfully');

        // Handle redirect response after login
        await handleRedirectResponse();
    } catch (error) {
        console.error('❌ Failed to initialize MSAL:', error);
    }
}

// Handle redirect response from Microsoft login
async function handleRedirectResponse() {
    try {
        const response = await msalInstance.handleRedirectPromise();

        if (response) {
            console.log('✅ Microsoft login successful (redirect):', response);

            // Store authentication data
            sessionStorage.setItem('imi_authenticated', 'true');
            sessionStorage.setItem('imi_auth_mode', 'microsoft');
            sessionStorage.setItem('imi_user_email', response.account.username);
            sessionStorage.setItem('imi_user_name', response.account.name || response.account.username);
            sessionStorage.setItem('imi_access_token', response.accessToken);

            // Show notification
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification(`Welcome, ${response.account.name}!`, 'success');
            }

            // Redirect to dashboard
            window.location.hash = 'dashboard';
            window.location.reload();
        }
    } catch (error) {
        console.error('❌ Error handling redirect:', error);
    }
}

// Initialize MSAL when the script loads
if (typeof msal !== 'undefined') {
    initializeMSAL();
}

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

// Login with Microsoft
async function loginWithMicrosoft() {
    console.log('🔐 Microsoft login initiated');

    if (!msalInstance) {
        console.error('❌ MSAL not initialized');
        alert('Microsoft authentication is not properly configured.\n\nPlease check the console for errors.');
        return;
    }

    const loginRequest = {
        scopes: window.IMI.config.MSAL.scopes,
        prompt: 'select_account', // Always show account picker
    };

    try {
        // Use redirect login (more reliable than popup for SPAs with hash routing)
        await msalInstance.loginRedirect(loginRequest);
        // After redirect, handleRedirectResponse() will be called automatically
    } catch (error) {
        console.error('❌ Microsoft login failed:', error);
        alert('Failed to sign in with Microsoft.\n\nError: ' + (error.errorMessage || error.message));
    }
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
        loginWithMicrosoft();
    }
});

// Export to global
window.IMI = window.IMI || {};
window.IMI.auth = {
    isAuthenticated,
    logout
};

console.log('🔐 Auth module loaded');
