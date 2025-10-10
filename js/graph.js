// js/graph.js - Microsoft Graph API Integration

console.log('📊 Graph API module loading...');

/**
 * Fetch user profile data from Microsoft Graph API
 * @returns {Promise<Object>} User profile data
 */
async function fetchUserProfile() {
    const accessToken = sessionStorage.getItem('imi_access_token');

    if (!accessToken) {
        console.error('❌ No access token available');
        return getPlaceholderUserData();
    }

    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Graph API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ User profile fetched from Graph API:', data);

        // Extract last name with better fallback logic
        let lastName = data.surname;
        if (!lastName && data.displayName) {
            const nameParts = data.displayName.split(' ');
            lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '[PLACEHOLDER]';
        }
        if (!lastName) lastName = '[PLACEHOLDER]';

        return {
            name: data.displayName || '[PLACEHOLDER]',
            email: data.userPrincipalName || data.mail || '[PLACEHOLDER]',
            firstName: data.givenName || data.displayName?.split(' ')[0] || '[PLACEHOLDER]',
            lastName: lastName,
            jobTitle: data.jobTitle || '[PLACEHOLDER]',
            department: data.department || '[PLACEHOLDER]',
            officeLocation: data.officeLocation || '[PLACEHOLDER]',
            mobilePhone: data.mobilePhone || '[PLACEHOLDER]',
            businessPhones: data.businessPhones || [],
            initials: getInitials(data.displayName),
            id: data.id
        };
    } catch (error) {
        console.error('❌ Failed to fetch user profile:', error);
        return getPlaceholderUserData();
    }
}

/**
 * Fetch user profile photo from Microsoft Graph API
 * @returns {Promise<string|null>} Base64 encoded photo or null
 */
async function fetchUserPhoto() {
    const accessToken = sessionStorage.getItem('imi_access_token');

    if (!accessToken) {
        console.error('❌ No access token available');
        return null;
    }

    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log('ℹ️ No profile photo available');
            } else {
                console.warn(`⚠️ Could not fetch photo: ${response.status}`);
            }
            return null;
        }

        const blob = await response.blob();
        return await blobToBase64(blob);
    } catch (error) {
        console.error('❌ Failed to fetch user photo:', error);
        return null;
    }
}

/**
 * Convert Blob to Base64 string
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Get initials from display name
 */
function getInitials(name) {
    if (!name || name === '[PLACEHOLDER]') return 'NA';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get placeholder user data (fallback)
 */
function getPlaceholderUserData() {
    // Try to get from sessionStorage first
    const storedName = sessionStorage.getItem('imi_user_name');
    const storedEmail = sessionStorage.getItem('imi_user_email');

    return {
        name: storedName || '[PLACEHOLDER]',
        email: storedEmail || '[PLACEHOLDER]',
        firstName: storedName?.split(' ')[0] || '[PLACEHOLDER]',
        lastName: '[PLACEHOLDER]',
        jobTitle: '[PLACEHOLDER]',
        department: '[PLACEHOLDER]',
        officeLocation: '[PLACEHOLDER]',
        mobilePhone: '[PLACEHOLDER]',
        businessPhones: [],
        initials: getInitials(storedName),
        id: null
    };
}

/**
 * Cache user data in sessionStorage
 */
function cacheUserData(userData) {
    sessionStorage.setItem('imi_user_profile', JSON.stringify(userData));
}

/**
 * Get cached user data from sessionStorage
 */
function getCachedUserData() {
    const cached = sessionStorage.getItem('imi_user_profile');
    return cached ? JSON.parse(cached) : null;
}

/**
 * Update all UI elements with user data
 */
async function updateUIWithUserData(userData, photoUrl = null) {
    console.log('🎨 Updating UI with user data:', userData);

    // Update all avatars
    const avatars = document.querySelectorAll('.user-avatar, .profile-avatar');
    avatars.forEach(avatar => {
        if (photoUrl) {
            // Replace with photo
            avatar.style.backgroundImage = `url(${photoUrl})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = ''; // Remove initials
        } else {
            // Use initials
            avatar.textContent = userData.initials;
        }
    });

    // Update welcome message
    const welcomeMessage = document.querySelector('.profile-info h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${userData.firstName}!`;
    }

    // Update profile details (department/job title can be repurposed for co-op info)
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails && userData.department !== '[PLACEHOLDER]') {
        // Use department field for co-op stream info
        profileDetails.textContent = userData.department;
    }

    // Update any name displays
    document.querySelectorAll('[data-user-name]').forEach(el => {
        el.textContent = userData.name;
    });

    // Update any email displays
    document.querySelectorAll('[data-user-email]').forEach(el => {
        el.textContent = userData.email;
    });

    console.log('✅ UI updated with user data');
}

/**
 * Initialize user profile (main function to call on page load)
 */
async function initializeUserProfile() {
    console.log('🚀 Initializing user profile...');

    // Check if authenticated
    if (sessionStorage.getItem('imi_authenticated') !== 'true') {
        console.log('⚠️ User not authenticated, skipping profile fetch');
        return null;
    }

    // Check if we're in developer mode (skip Graph API)
    const authMode = sessionStorage.getItem('imi_auth_mode');
    if (authMode === 'developer') {
        console.log('🔧 Developer mode - using mock data');
        const mockData = {
            name: 'Jane Doe (Developer)',
            email: 'developer@imadeit.ai',
            firstName: 'Jane',
            lastName: 'Doe',
            jobTitle: 'Grade 11 Student',
            department: 'Summer 2025 Co-op Stream',
            officeLocation: 'Toronto, ON',
            mobilePhone: '[PLACEHOLDER]',
            businessPhones: [],
            initials: 'JD',
            id: 'dev-123'
        };
        await updateUIWithUserData(mockData);
        return mockData;
    }

    // Try to get cached data first
    let userData = getCachedUserData();

    // Check if cached data is stale (has placeholders in critical fields)
    const isCacheStale = userData && (
        userData.lastName === '[PLACEHOLDER]' ||
        userData.name === '[PLACEHOLDER]' ||
        !userData.lastName ||
        !userData.name
    );

    // If no cache, stale cache, or force refresh, fetch from Graph API
    if (!userData || isCacheStale) {
        console.log(isCacheStale ? '🔄 Cache is stale, refreshing...' : '📡 No cache found, fetching fresh data...');
        userData = await fetchUserProfile();
        cacheUserData(userData);
    } else {
        console.log('💾 Using cached user data');
    }

    // Fetch profile photo (don't block on this)
    fetchUserPhoto().then(photoUrl => {
        if (photoUrl) {
            // Update avatars with photo
            updateUIWithUserData(userData, photoUrl);
        }
    });

    // Update UI with user data
    await updateUIWithUserData(userData);

    return userData;
}

// Export to global namespace
window.IMI = window.IMI || {};
window.IMI.graph = {
    fetchUserProfile,
    fetchUserPhoto,
    initializeUserProfile,
    updateUIWithUserData,
    getCachedUserData
};

console.log('📊 Graph API module loaded');
