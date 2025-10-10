// js/config.js - Centralized Configuration

/**
 * Environment Configuration
 *
 * This file centralizes all configuration for the IMI Student Dashboard.
 * Update these values based on your environment (development, staging, production).
 */

const IMI_CONFIG = {
    // Azure Active Directory / MSAL Configuration
    MSAL: {
        clientId: 'e72211d9-88cf-4e6d-b34b-8d3d4924c74b',
        authority: 'https://login.microsoftonline.com/4aeaa91e-7669-479e-9283-222abfbda9d5',
        // For GitHub Pages, we need to include the repository path
        redirectUri: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/'),
        scopes: ['User.Read', 'openid', 'profile'], // Default scopes for authentication
    },

    // API Configuration
    API: {
        baseUrl: '/api', // Update to your Azure Functions URL or API Gateway
        timeout: 30000, // Request timeout in milliseconds (30 seconds)

        // API Endpoints
        endpoints: {
            // User/Student endpoints
            students: {
                me: '/students/me',
                profile: '/students/me/profile',
                achievements: '/students/me/achievements',
                certificates: '/students/me/certificates',
            },

            // Blueprint endpoints
            blueprints: {
                list: '/blueprints',
                submit: '/blueprints',
                get: '/blueprints/:id',
                featured: '/blueprints/featured',
            },

            // Company endpoints
            companies: {
                list: '/companies',
                get: '/companies/:id',
                reviews: '/companies/:id/reviews',
                projects: '/companies/:id/projects',
            },

            // Project endpoints
            projects: {
                list: '/projects',
                get: '/projects/:id',
                submit: '/projects/:id/submit',
            },

            // Network endpoints
            network: {
                connections: '/network/connections',
                add: '/network/connections',
                update: '/network/connections/:id',
            },

            // Data Room endpoints
            dataRooms: {
                list: '/data-rooms',
                create: '/data-rooms',
                get: '/data-rooms/:id',
                update: '/data-rooms/:id',
                delete: '/data-rooms/:id',
            },

            // Notification endpoints
            notifications: {
                list: '/notifications',
                markRead: '/notifications/:id/read',
                markAllRead: '/notifications/read-all',
            },

            // Time Tracking endpoints
            tracking: {
                list: '/tracking',
                submit: '/tracking',
                summary: '/tracking/summary',
            },

            // XP and Gamification endpoints
            gamification: {
                xp: '/gamification/xp',
                redeem: '/gamification/redeem',
                leaderboard: '/gamification/leaderboard',
            },
        },
    },

    // Session Configuration
    SESSION: {
        timeout: 30 * 60 * 1000, // 30 minutes in milliseconds
        autoSaveInterval: 2000, // Auto-save interval in milliseconds (2 seconds)
    },

    // IMI Brand Colors
    COLORS: {
        blue: '#042847',
        yellow: '#ffd502',
        darkGray: '#231f20',
        white: '#ffffff',
        lightGray: '#f5f5f5',
        mediumGray: '#e0e0e0',
        textGray: '#666666',
    },

    // Gamification Settings
    GAMIFICATION: {
        xpPerBlueprint: 100,
        connectorBonus: 25,
        featuredInsightBonus: 50,
        blueSparkDuration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds

        // XP Milestones
        tiers: {
            bronze: 0,
            silver: 2500,
            gold: 5000,
            platinum: 10000,
        },
    },

    // Feature Flags (enable/disable features)
    FEATURES: {
        enableMSAL: true, // Set to true when MSAL is configured
        enableBackend: false, // Set to true when backend is ready
        useMockData: true, // Use mock data when backend is disabled
        enableAnalytics: false, // Enable session tracking/analytics
    },

    // Development Settings
    DEBUG: {
        logApiCalls: true, // Log all API calls to console
        logStateChanges: false, // Log state changes
        showLoadingStates: true, // Show loading spinners
    },
};

// Freeze config to prevent accidental modifications
Object.freeze(IMI_CONFIG);
Object.freeze(IMI_CONFIG.MSAL);
Object.freeze(IMI_CONFIG.API);
Object.freeze(IMI_CONFIG.API.endpoints);
Object.freeze(IMI_CONFIG.SESSION);
Object.freeze(IMI_CONFIG.COLORS);
Object.freeze(IMI_CONFIG.GAMIFICATION);
Object.freeze(IMI_CONFIG.FEATURES);
Object.freeze(IMI_CONFIG.DEBUG);

// Export to global IMI namespace
window.IMI = window.IMI || {};
window.IMI.config = IMI_CONFIG;

// Helper function to get endpoint URL with parameters
window.IMI.getEndpoint = function(category, endpoint, params = {}) {
    let url = IMI_CONFIG.API.endpoints[category]?.[endpoint];
    if (!url) {
        console.error(`Endpoint not found: ${category}.${endpoint}`);
        return null;
    }

    // Replace path parameters (e.g., :id)
    Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
    });

    return IMI_CONFIG.API.baseUrl + url;
};

// Log configuration on load (only in debug mode)
if (IMI_CONFIG.DEBUG.logApiCalls) {
    console.log('IMI Configuration loaded:', {
        features: IMI_CONFIG.FEATURES,
        apiBase: IMI_CONFIG.API.baseUrl,
        environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    });
}
