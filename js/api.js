// js/api.js - API Client for Azure Functions

console.log('📡 API module loading...');

/**
 * Fetch user profile from Dataverse
 * @param {string} email - User's email address
 * @param {string} firstName - User's first name from Azure AD
 * @param {string} lastName - User's last name from Azure AD
 * @returns {Promise<Object>} Profile data from Dataverse
 */
async function fetchProfile(email, firstName, lastName) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const endpoint = window.IMI.config.API.endpoints.profile.get;
    const url = `${baseUrl}${endpoint}?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

    console.log('📡 Fetching profile from Dataverse:', email);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Profile fetched:', data.fullName);
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch profile:', error);
        throw error;
    }
}

/**
 * Update user profile in Dataverse
 * @param {string} email - User's email address
 * @param {Object} updates - Fields to update (e.g., { mobilePhone: "555-1234" })
 * @returns {Promise<Object>} Updated profile data
 */
async function updateProfile(email, updates) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const endpoint = window.IMI.config.API.endpoints.profile.update;
    const url = `${baseUrl}${endpoint}`;

    console.log('📡 Updating profile in Dataverse:', email, updates);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                ...updates
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Failed to update profile:', error);
        throw error;
    }
}

/**
 * Submit a Blueprint to Azure SQL Database
 * @param {Object} blueprintData - Blueprint submission data
 * @returns {Promise<Object>} Submission result with blueprintId
 */
async function submitBlueprint(blueprintData) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/SubmitBlueprint`;

    console.log('📡 Submitting Blueprint to SQL Database:', blueprintData.studentEmail);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blueprintData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Failed to submit blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprints for a user by Azure AD User ID (PRIMARY METHOD)
 * @param {string} azureAdUserId - Azure AD Object ID (immutable)
 * @param {number} limit - Number of blueprints to return (default: 10)
 * @param {number} offset - Number of blueprints to skip (default: 0)
 * @returns {Promise<Array>} List of blueprints
 */
async function getBlueprintsByUserId(azureAdUserId, limit = 10, offset = 0) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?azureAdUserId=${encodeURIComponent(azureAdUserId)}&limit=${limit}&offset=${offset}`;

    console.log('📡 Fetching blueprints by userId:', azureAdUserId, 'limit:', limit, 'offset:', offset);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data; // Return the array of blueprints
    } catch (error) {
        console.error('❌ Failed to fetch blueprints by user ID:', error);
        throw error;
    }
}

/**
 * Get blueprints for a student from Azure SQL Database with pagination (LEGACY - use getBlueprintsByUserId instead)
 * @param {string} studentEmail - Student's email address
 * @param {number} limit - Number of blueprints to return (default: 10)
 * @param {number} offset - Number of blueprints to skip (default: 0)
 * @returns {Promise<Array>} List of blueprints
 */
async function getBlueprints(studentEmail, limit = 10, offset = 0) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?studentEmail=${encodeURIComponent(studentEmail)}&limit=${limit}&offset=${offset}`;

    console.log('📡 Fetching blueprints by email (LEGACY):', studentEmail, 'limit:', limit, 'offset:', offset);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data; // Return the array of blueprints
    } catch (error) {
        console.error('❌ Failed to fetch blueprints:', error);
        throw error;
    }
}

/**
 * Get a specific blueprint by ID
 * @param {number} blueprintId - Blueprint ID
 * @returns {Promise<Object>} Blueprint data
 */
async function getBlueprintById(blueprintId) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?blueprintId=${blueprintId}`;

    console.log('📡 Fetching blueprint by ID:', blueprintId);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprint statistics for a user by Azure AD User ID (PRIMARY METHOD)
 * @param {string} azureAdUserId - Azure AD Object ID
 * @returns {Promise<Object>} Statistics object
 */
async function getBlueprintStatsByUserId(azureAdUserId) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?azureAdUserId=${encodeURIComponent(azureAdUserId)}&stats=true`;

    console.log('📡 Fetching blueprint stats by userId:', azureAdUserId);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch blueprint stats by user ID:', error);
        throw error;
    }
}

/**
 * Get blueprint statistics for a student (LEGACY - use getBlueprintStatsByUserId instead)
 * @param {string} studentEmail - Student's email
 * @returns {Promise<Object>} Statistics object
 */
async function getBlueprintStats(studentEmail) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?studentEmail=${encodeURIComponent(studentEmail)}&stats=true`;

    console.log('📡 Fetching blueprint stats by email (LEGACY):', studentEmail);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch blueprint stats:', error);
        throw error;
    }
}

/**
 * Get featured blueprints (for peer inspiration)
 * @param {number} limit - Number of blueprints to return (default: 10)
 * @returns {Promise<Array>} Featured blueprints
 */
async function getFeaturedBlueprints(limit = 10) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?featured=true&limit=${limit}`;

    console.log('📡 Fetching featured blueprints, limit:', limit);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch featured blueprints:', error);
        throw error;
    }
}

/**
 * Fetch user XP data from Azure SQL Database
 * @param {string} azureAdUserId - Azure AD Object ID
 * @param {string} studentEmail - Student email (optional, for auto-create)
 * @returns {Promise<Object>} User XP data (currentXP, lifetimeXP, xpSpent, streak, tier)
 */
async function fetchUserXP(azureAdUserId, studentEmail = null) {
    const baseUrl = window.IMI.config.API.baseUrl;
    let url = `${baseUrl}/GetUserXP?azureAdUserId=${encodeURIComponent(azureAdUserId)}`;

    // Include email if provided (for auto-create on first fetch)
    if (studentEmail) {
        url += `&studentEmail=${encodeURIComponent(studentEmail)}`;
    }

    console.log('📡 Fetching user XP from SQL Database:', azureAdUserId);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ User XP fetched:', result.data.currentXP, 'XP, Streak:', result.data.currentStreak, 'Tier:', result.data.currentTier);
        return result.data;
    } catch (error) {
        console.error('❌ Failed to fetch user XP:', error);
        // Return default values if fetch fails
        return {
            currentXP: 0,
            lifetimeXP: 0,
            xpSpent: 0,
            currentStreak: 0,
            lastSubmissionWeek: null,
            currentTier: 'bronze'
        };
    }
}

/**
 * Fetch user's seasonal stats
 * @param {string} azureAdUserId - Azure AD Object ID
 * @param {number} seasonId - Optional, defaults to current season
 * @returns {Promise<Object>} Seasonal stats with season info
 */
async function fetchSeasonalStats(azureAdUserId, seasonId = null) {
    const baseUrl = window.IMI.config.API.baseUrl;
    let url = `${baseUrl}/GetSeasonalStats?azureAdUserId=${encodeURIComponent(azureAdUserId)}`;

    if (seasonId) {
        url += `&seasonId=${seasonId}`;
    }

    console.log('📡 Fetching seasonal stats from SQL Database:', azureAdUserId);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Seasonal stats fetched:', result.data.season?.seasonName);
        return result.data;
    } catch (error) {
        console.error('❌ Failed to fetch seasonal stats:', error);
        // Return default values if fetch fails
        return {
            season: null,
            stats: {
                seasonPoints: 0,
                blueprintCount: 0,
                maxStreakDuringSeason: 0,
                finalTier: null
            }
        };
    }
}

/**
 * Fetch all seasons user participated in
 * @param {string} azureAdUserId - Azure AD Object ID
 * @returns {Promise<Array>} Historical season stats
 */
async function fetchSeasonHistory(azureAdUserId) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetSeasonalStats?azureAdUserId=${encodeURIComponent(azureAdUserId)}&history=true`;

    console.log('📡 Fetching season history from SQL Database:', azureAdUserId);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Season history fetched:', result.data.length, 'seasons');
        return result.data;
    } catch (error) {
        console.error('❌ Failed to fetch season history:', error);
        return [];
    }
}

// Export to global namespace
window.IMI = window.IMI || {};
window.IMI.api = {
    fetchProfile,
    updateProfile,
    submitBlueprint,
    getBlueprintsByUserId,      // PRIMARY: Query by Azure AD User ID
    getBlueprints,               // LEGACY: Fallback for old data
    getBlueprintById,
    getBlueprintStatsByUserId,  // PRIMARY: Stats by Azure AD User ID
    getBlueprintStats,           // LEGACY: Stats by email
    getFeaturedBlueprints,
    fetchUserXP,                 // XP: Get user XP data with streak/tier
    fetchSeasonalStats,          // Season: Get current/specific season stats
    fetchSeasonHistory           // Season: Get all season history
};

console.log('📡 API module loaded');
