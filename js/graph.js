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
        console.log('✅ User profile fetched from Graph API:', data.displayName, data.mail);

        // Extract last name with better fallback logic
        let lastName = data.surname;
        if (!lastName && data.displayName) {
            const nameParts = data.displayName.split(' ');
            lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '[LAST NAME]';
        }
        if (!lastName) lastName = '[LAST NAME]';

        // Get Azure AD User ID from Graph API, or fall back to stored value from MSAL
        const userId = data.id || sessionStorage.getItem('imi_user_id');

        return {
            name: data.displayName || '[FULL NAME]',
            email: data.userPrincipalName || data.mail || '[EMAIL]',
            firstName: data.givenName || data.displayName?.split(' ')[0] || '[FIRST NAME]',
            lastName: lastName,
            jobTitle: data.jobTitle || '[JOB TITLE]',
            department: data.department || '[DEPARTMENT]',
            officeLocation: data.officeLocation || '[LOCATION]',
            mobilePhone: data.mobilePhone || '[PHONE]',
            businessPhones: data.businessPhones || [],
            initials: getInitials(data.displayName),
            id: userId
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
    if (!name || name.startsWith('[')) return 'NA';

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
    const storedUserId = sessionStorage.getItem('imi_user_id');

    return {
        name: storedName || '[FULL NAME]',
        email: storedEmail || '[EMAIL]',
        firstName: storedName?.split(' ')[0] || '[FIRST NAME]',
        lastName: '[LAST NAME]',
        jobTitle: '[JOB TITLE]',
        department: '[DEPARTMENT]',
        officeLocation: '[LOCATION]',
        mobilePhone: '[PHONE]',
        businessPhones: [],
        initials: getInitials(storedName),
        id: storedUserId || null
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
    // Update all avatars
    const avatars = document.querySelectorAll('.user-avatar, .profile-avatar');
    avatars.forEach(avatar => {
        if (photoUrl) {
            // Replace with photo
            avatar.style.backgroundImage = `url(${photoUrl})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.innerHTML = ''; // Clear all text and child elements
        } else {
            // Use initials
            avatar.style.backgroundImage = 'none'; // Clear any previous photo
            avatar.textContent = userData.initials;
        }

        // Mark as loaded to trigger fade-in animation
        avatar.classList.add('loaded');
    });

    // Update welcome message
    const welcomeMessage = document.querySelector('.profile-info h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${userData.firstName}!`;
    }

    // Update profile details with job title (leave blank if not available)
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        // Use jobTitle if available and not a placeholder, otherwise leave blank
        if (userData.jobTitle && !userData.jobTitle.startsWith('[')) {
            profileDetails.textContent = userData.jobTitle;
        } else {
            profileDetails.textContent = '';
        }
    }

    // Update any name displays
    document.querySelectorAll('[data-user-name]').forEach(el => {
        el.textContent = userData.name;
    });

    // Update any email displays
    document.querySelectorAll('[data-user-email]').forEach(el => {
        el.textContent = userData.email;
    });
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
            // Basic identity
            name: 'Jane Doe (Developer)',
            email: 'developer@imadeit.ai',
            firstName: 'Jane',
            lastName: 'Doe',
            initials: 'JD',
            id: 'dev-123',

            // Azure AD fields (repurposed for demo)
            jobTitle: 'Summer 2025 Co-op Student',
            department: 'Summer 2025 Co-op Stream',
            officeLocation: 'Toronto, ON',
            businessPhones: [],

            // Profile fields (developer mode defaults)
            mobilePhone: '',  // Empty by default
            bio: 'Passionate technology student with hands-on experience in AI/ML projects through IMI\'s co-op program. I enjoy solving complex problems through innovative software solutions and am always eager to learn new technologies. Currently seeking opportunities to apply my skills in data analysis, software development, and project management.',
            city: 'Toronto',
            school: 'Lincoln High School',
            graduationYear: '2025',
            interests: ['Machine Learning', 'Sustainability', 'Data Science']
        };
        await updateUIWithUserData(mockData);
        return mockData;
    }

    // Try to get cached data first
    let userData = getCachedUserData();

    // Check if cached data is stale (has placeholders in critical fields or old generic placeholders)
    const isCacheStale = userData && (
        userData.lastName?.startsWith('[') ||
        userData.name?.startsWith('[') ||
        userData.jobTitle === '[PLACEHOLDER]' ||  // Check for old generic placeholder
        userData.department === '[PLACEHOLDER]' ||
        userData.officeLocation === '[PLACEHOLDER]' ||
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

    // In Microsoft mode, fetch profile photo first to avoid flashing initials
    // before photo loads
    const photoUrl = await fetchUserPhoto();

    // Update UI once with either photo or initials (no flash)
    await updateUIWithUserData(userData, photoUrl);

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
