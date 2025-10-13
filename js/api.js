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

// Export to global namespace
window.IMI = window.IMI || {};
window.IMI.api = {
    fetchProfile,
    updateProfile
};

console.log('📡 API module loaded');
