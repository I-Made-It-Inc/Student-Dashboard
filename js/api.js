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
        console.log('✅ Profile fetched from Dataverse:', data);
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
        console.log('✅ Profile updated in Dataverse:', data);
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
        console.log('✅ Blueprint submitted successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Failed to submit blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprints for a student from Azure SQL Database
 * @param {string} studentEmail - Student's email address
 * @returns {Promise<Array>} List of blueprints
 */
async function getBlueprints(studentEmail) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?studentEmail=${encodeURIComponent(studentEmail)}`;

    console.log('📡 Fetching blueprints from SQL Database:', studentEmail);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Blueprints fetched successfully:', data.count, 'blueprints');
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
        console.log('✅ Blueprint fetched successfully');
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch blueprint:', error);
        throw error;
    }
}

/**
 * Get blueprint statistics for a student
 * @param {string} studentEmail - Student's email
 * @returns {Promise<Object>} Statistics object
 */
async function getBlueprintStats(studentEmail) {
    const baseUrl = window.IMI.config.API.baseUrl;
    const url = `${baseUrl}/GetBlueprints?studentEmail=${encodeURIComponent(studentEmail)}&stats=true`;

    console.log('📡 Fetching blueprint stats:', studentEmail);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Blueprint stats fetched successfully');
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
        console.log('✅ Featured blueprints fetched successfully:', data.count, 'blueprints');
        return data.data;
    } catch (error) {
        console.error('❌ Failed to fetch featured blueprints:', error);
        throw error;
    }
}

// Export to global namespace
window.IMI = window.IMI || {};
window.IMI.api = {
    fetchProfile,
    updateProfile,
    submitBlueprint,
    getBlueprints,
    getBlueprintById,
    getBlueprintStats,
    getFeaturedBlueprints
};

console.log('📡 API module loaded');
