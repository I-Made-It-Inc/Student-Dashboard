// azure-functions/StudentDashboardAPI/config.js
// Backend Configuration - must match frontend js/config.js

/**
 * Gamification Configuration
 * IMPORTANT: These values must match the frontend config.js GAMIFICATION
 * If you update these values, update BOTH config files!
 */
const GAMIFICATION = {
    // Blueprint XP Rewards
    xpPerSection: 20,           // XP earned per completed section (≥100 words)
    minWordsPerSection: 100,    // Minimum words required for section to count as complete
    maxSectionsPerBlueprint: 5, // Total sections in a blueprint
    connectorBonus: 25,         // Bonus for Connector role
    featuredInsightBonus: 50,   // Bonus for featured insights

    // XP Tier Thresholds (based on lifetime XP)
    tiers: {
        bronze: 0,      // 0-2,499 XP
        silver: 2500,   // 2,500-4,999 XP
        gold: 5000,     // 5,000-9,999 XP
        platinum: 10000, // 10,000+ XP
    },
};

module.exports = {
    GAMIFICATION,
};
