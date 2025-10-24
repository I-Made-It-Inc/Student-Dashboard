// azure-functions/StudentDashboardAPI/config.js
// Backend Configuration - must match frontend js/config.js

/**
 * Gamification Configuration
 * IMPORTANT: These values must match the frontend config.js GAMIFICATION.tiers
 * If you update these thresholds, update both files!
 */
const GAMIFICATION = {
    // XP Tier Thresholds (based on lifetime XP)
    tiers: {
        bronze: 0,
        silver: 2500,
        gold: 5000,
        platinum: 10000,
    },

    // XP Rewards
    xpPerSection: 20,           // XP per complete blueprint section (≥100 words)
    maxSectionsPerBlueprint: 5, // Maximum sections in a blueprint
    connectorBonus: 25,         // Bonus for Connector role
    featuredInsightBonus: 50,   // Bonus for featured insights
};

module.exports = {
    GAMIFICATION,
};
