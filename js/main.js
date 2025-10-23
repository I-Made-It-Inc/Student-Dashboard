// js/main.js - Main Initialization
// NOTE: Configuration is now in js/config.js

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('IMI Student Dashboard v0.3 initializing...');

    // Check auth FIRST before anything else
    const isAuth = sessionStorage.getItem('imi_authenticated') === 'true';

    if (!isAuth) {
        console.log('❌ Not authenticated - showing login only');
        // Hide navigation
        const nav = document.querySelector('.nav');
        if (nav) nav.style.display = 'none';

        // Hide all pages except login
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const loginPage = document.getElementById('login-page');
        if (loginPage) loginPage.classList.add('active');

        // Mark page as ready to prevent FOUC
        document.body.classList.add('js-ready');

        // Prevent URL manipulation - force back to login if they change the hash
        window.addEventListener('hashchange', function() {
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

        // Set initial hash to login
        window.location.hash = 'login';

        // Don't initialize anything else
        return;
    }

    console.log('✅ Authenticated - initializing app');

    // Initialize navigation
    initializeNavigation();

    // Initialize other modules
    initializeBlueprintChallenge();
    initializeModal();
    initializeCompanies();
    initializeTimeTracking();

    // Initialize page-specific modules that don't depend on user data
    const currentPage = window.location.hash.slice(1) || 'dashboard';
    if (currentPage === 'notifications') {
        setTimeout(() => {
            if (typeof initializeNotifications === 'function') {
                initializeNotifications();
            }
        }, 100);
    }

    // Set up global event listeners
    setupGlobalEventListeners();

    // Load user data from Microsoft Graph or mock data
    // Profile initialization will happen after userData is loaded
    loadUserData();

    // Start session tracking
    startSessionTracking();

    // Update notification badge count
    updateNotificationBadgeCount();
    
    // Set up redemption handlers for dashboard (after a small delay to ensure DOM is ready)
    setTimeout(() => {
        setupDashboardRedemptionHandlers();
    }, 100);
    
    // Also set up a global click handler as a fallback
    document.addEventListener('click', function(e) {
        // Handle redemption clicks
        if (e.target && e.target.matches('.redemption-item .btn.btn-primary-small')) {
            const btn = e.target;
            if (btn.textContent.trim() === 'Redeem' && !btn.disabled) {
                handleRedemption(btn);
            }
        }
    });
    
    console.log('IMI Student Dashboard ready');
});

// Load user data
async function loadUserData() {
    // Fetch real user profile from Microsoft Graph API
    if (window.IMI && window.IMI.graph && window.IMI.graph.initializeUserProfile) {
        try {
            const graphData = await window.IMI.graph.initializeUserProfile();

            if (graphData) {
                // Check auth mode before calling Dataverse
                const authMode = sessionStorage.getItem('imi_auth_mode');
                let dataverseProfile = null;

                // Only call Dataverse API in Microsoft mode
                if (authMode === 'microsoft' && window.IMI.api) {
                    try {
                        dataverseProfile = await window.IMI.api.fetchProfile(
                            graphData.email,
                            graphData.firstName,
                            graphData.lastName
                        );
                        console.log('✅ Dataverse profile loaded:', dataverseProfile);
                    } catch (error) {
                        console.warn('⚠️ Failed to load Dataverse profile, using Graph only:', error);
                    }
                } else if (authMode === 'developer') {
                    console.log('🔧 Developer mode - skipping Dataverse API call, using session-only data');
                }

                // Fetch XP data from Azure SQL (Microsoft mode only)
                let xpData = null;
                if (authMode === 'microsoft' && window.IMI.api && graphData.id) {
                    try {
                        xpData = await window.IMI.api.fetchUserXP(graphData.id, graphData.email);
                        console.log('✅ XP data loaded:', xpData.currentXP, 'XP');
                    } catch (error) {
                        console.warn('⚠️ Failed to load XP data, using defaults:', error);
                    }
                }

                // Combine profile data with XP data from backend
                const userData = {
                    // Identity
                    name: dataverseProfile?.nickname || graphData.name,  // Prefer Dataverse nickname (display name)
                    firstName: graphData.firstName,
                    lastName: graphData.lastName,
                    initials: graphData.initials,
                    email: graphData.email,
                    id: graphData.id,

                    // Azure AD / profile fields
                    department: graphData.department,
                    officeLocation: graphData.officeLocation,
                    businessPhones: graphData.businessPhones,

                    // Extended profile data (from Dataverse in MS mode, from mock in dev mode)
                    jobTitle: dataverseProfile?.jobTitle || graphData.jobTitle || '',
                    city: dataverseProfile?.city || '',
                    mobilePhone: dataverseProfile?.mobilePhone || graphData.mobilePhone || '',
                    bio: dataverseProfile?.description || graphData.bio || '',  // Dataverse description = bio
                    school: dataverseProfile?.school || graphData.school || '',
                    graduationYear: dataverseProfile?.graduationYear || graphData.graduationYear || '',
                    interests: window.IMI.interestsFromDataverse(dataverseProfile?.careerInterests) || graphData.interests || [],

                    // Dataverse contact ID (MS mode only)
                    contactId: dataverseProfile?.contactId,

                    // XP data (from Azure SQL in MS mode, mock 1850 in dev mode)
                    currentXP: xpData?.currentXP ?? (authMode === 'developer' ? 1850 : 0),
                    lifetimeXP: xpData?.lifetimeXP ?? (authMode === 'developer' ? 1850 : 0),
                    xpSpent: xpData?.xpSpent || 0,

                    // Other gamification data (still mock for now)
                    streak: 12,
                    tier: 'Gold',
                    totalHours: 324,
                    activeProjects: 5,
                    companies: 3
                };

                // Update UI with combined data
                updateUserInterface(userData);

                // Store in global IMI data object for other modules to use
                window.IMI.data.userData = userData;

                console.log('✅ User data loaded successfully');

                // Initialize profile page if we're on it (must happen after userData is loaded)
                const currentPage = window.location.hash.slice(1) || 'dashboard';
                if (currentPage === 'profile' && typeof initializeProfile === 'function') {
                    console.log('📄 Initializing profile page with loaded user data');
                    initializeProfile();
                }

                // Load blueprints if we're on the blueprint page (must happen after userData is loaded)
                if (currentPage === 'blueprint' && typeof renderPastBlueprints === 'function') {
                    console.log('📄 Loading blueprints with user data');
                    renderPastBlueprints();
                }
            }
        } catch (error) {
            console.error('❌ Failed to load user data:', error);
            // Fall back to placeholder data
            usePlaceholderData();
        }
    } else {
        console.warn('⚠️ Graph API module not loaded, using placeholder data');
        usePlaceholderData();
    }
}

// Fallback to placeholder data if Graph API fails
function usePlaceholderData() {
    const userData = {
        name: '[FULL NAME]',
        firstName: '[FIRST NAME]',
        lastName: '[LAST NAME]',
        initials: 'NA',
        email: '[EMAIL]',
        jobTitle: '[JOB TITLE]',
        department: '[DEPARTMENT]',
        currentXP: 1850,
        lifetimeXP: 1850,
        xpSpent: 0,
        streak: 12,
        tier: 'Gold',
        totalHours: 324,
        activeProjects: 5,
        companies: 3
    };

    updateUserInterface(userData);
    window.IMI.data.userData = userData;

    // Initialize profile page if we're on it
    const currentPage = window.location.hash.slice(1) || 'dashboard';
    if (currentPage === 'profile' && typeof initializeProfile === 'function') {
        console.log('📄 Initializing profile page with placeholder data');
        initializeProfile();
    }
}

// Update user interface with data
function updateUserInterface(userData) {
    // Note: Avatar updates are handled by graph.js updateUIWithUserData() to properly support photos
    // Don't update avatars here to avoid overwriting photo backgrounds

    // Update welcome message with display name (nickname)
    const welcomeMessage = document.querySelector('.profile-info h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
    }

    // Update profile details (job title) - important for Dataverse sync
    const profileDetails = document.querySelector('.profile-details');
    if (profileDetails) {
        // Use jobTitle if available and not a placeholder, otherwise leave blank
        if (userData.jobTitle && !userData.jobTitle.startsWith('[')) {
            profileDetails.textContent = userData.jobTitle;
        } else {
            profileDetails.textContent = '';
        }
    }

    // Update stats
    updateDashboardStats(userData);

    // Update dashboard blueprint challenge if on dashboard page (after delay to let DOM settle)
    const currentPage = window.location.hash.slice(1) || 'dashboard';
    if (currentPage === 'dashboard') {
        setTimeout(() => {
            console.log('📍 Currently on dashboard, updating blueprint challenge (delayed)');
            updateDashboardBlueprintChallenge();
        }, 200);
    }
}

// Update dashboard statistics
function updateDashboardStats(data) {
    // Update gamification stats badge (XP display)
    const statMainElements = document.querySelectorAll('.stat-main');
    statMainElements.forEach(el => {
        if (el.textContent.includes('pts') || el.textContent.includes('XP')) {
            // Format XP with comma separator
            el.textContent = `${data.currentXP.toLocaleString()} XP`;
        }
    });

    // Update sidebar "XP available" text
    const xpAvailableElements = document.querySelectorAll('.text-muted.small');
    xpAvailableElements.forEach(el => {
        if (el.textContent.includes('XP available')) {
            el.textContent = `${data.currentXP.toLocaleString()} XP available`;
        }
    });

    // Update other stats if elements exist (these are less critical)
    const statElements = {
        '.stat-value.hours': data.totalHours,
        '.stat-value.projects': data.activeProjects,
        '.stat-value.companies': data.companies
    };

    Object.entries(statElements).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element && value !== undefined) {
            element.textContent = value;
        }
    });
}

// Get current week's date range (Monday to Sunday)
function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days to Monday (start of week)
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + daysToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
}

// Update dashboard blueprint challenge progress
async function updateDashboardBlueprintChallenge() {
    const authMode = sessionStorage.getItem('imi_auth_mode');

    // Don't update if elements don't exist (not on dashboard page)
    if (!document.querySelector('.challenge-progress .progress-section')) {
        return;
    }

    const { monday, sunday } = getCurrentWeekRange();
    let thisWeekBlueprints = [];

    try {
        if (authMode === 'developer') {
            // Developer mode: get blueprints from sessionStorage
            const sessionBlueprints = JSON.parse(sessionStorage.getItem('imi_blueprints') || '[]');
            thisWeekBlueprints = sessionBlueprints.filter(bp => {
                const submissionDate = new Date(bp.submissionDate);
                return submissionDate >= monday && submissionDate <= sunday;
            });
        } else if (authMode === 'microsoft') {
            // Microsoft mode: fetch from API
            const userData = window.IMI?.data?.userData;
            let allBlueprints = [];

            // Try Azure AD User ID first (PRIMARY METHOD)
            if (userData && userData.id && window.IMI?.api?.getBlueprintsByUserId) {
                allBlueprints = await window.IMI.api.getBlueprintsByUserId(userData.id, 100, 0);
            }
            // Fallback to email-based method (LEGACY)
            else if (userData && userData.email && window.IMI?.api?.getBlueprints) {
                allBlueprints = await window.IMI.api.getBlueprints(userData.email, 100, 0);
            } else {
                console.warn('⚠️ Cannot fetch blueprints - user data or API not available');
            }

            // Filter blueprints submitted this week
            if (allBlueprints.length > 0) {
                thisWeekBlueprints = allBlueprints.filter(bp => {
                    const submissionDate = new Date(bp.submissionDate);
                    return submissionDate >= monday && submissionDate <= sunday;
                });
            }
        }

        // Check which sections are completed this week (any blueprint with ≥100 words counts)
        const sections = ['trendspotter', 'futureVisionary', 'innovationCatalyst', 'connector', 'growthHacker'];
        const completedSections = new Set();

        thisWeekBlueprints.forEach(bp => {
            sections.forEach(section => {
                const content = bp[section] || '';
                const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
                if (wordCount >= 100) {
                    completedSections.add(section);
                }
            });
        });

        // Calculate total XP this week
        const totalXP = thisWeekBlueprints.reduce((sum, bp) => sum + (bp.xpEarned || 0), 0);

        console.log('📊 Dashboard updated:', thisWeekBlueprints.length, 'blueprints,', completedSections.size, 'sections,', totalXP, 'XP');

        // Update UI
        const progressSections = document.querySelectorAll('.challenge-progress .progress-section');
        progressSections.forEach((element, index) => {
            const section = sections[index];
            const isCompleted = completedSections.has(section);

            if (isCompleted) {
                element.classList.add('completed');
                element.querySelector('span:first-child').textContent = '✓';
            } else {
                element.classList.remove('completed');
                element.querySelector('span:first-child').textContent = '○';
            }
        });

        // Update XP display
        const xpDisplay = document.querySelector('.challenge-progress .points-earned');
        if (xpDisplay) {
            xpDisplay.textContent = `${totalXP} XP earned`;
        }

    } catch (error) {
        console.error('❌ Error updating dashboard blueprint challenge:', error);
    }
}

// Session tracking
let sessionStartTime = Date.now();
let currentPage = 'dashboard';
let sessionTimer = null;

function startSessionTracking() {
    // Track page time
    sessionTimer = setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
        // Update session timer in UI if needed
        updateSessionTime(elapsedMinutes);
    }, 60000); // Update every minute
    
    // Track page changes
    document.addEventListener('pageChange', (event) => {
        logPageTime(currentPage, Date.now() - sessionStartTime);
        currentPage = event.detail.page;
        sessionStartTime = Date.now();

        // Note: Dashboard blueprint challenge is updated via loadDashboardContent()
        // No need to call it here as well
    });
    
    // Track before unload
    window.addEventListener('beforeunload', () => {
        logPageTime(currentPage, Date.now() - sessionStartTime);
    });
}

// Update session time display
function updateSessionTime(minutes) {
    const sessionDisplay = document.getElementById('session-time');
    if (sessionDisplay) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        sessionDisplay.textContent = `${hours}h ${mins}m`;
    }
}

// Log page time for analytics
function logPageTime(page, duration) {
    const seconds = Math.floor(duration / 1000);
    console.log(`Time spent on ${page}: ${seconds} seconds`);
    
    // In production, send to analytics API
    // sendAnalytics('page_time', { page, duration: seconds });
}

// Global event listeners
function setupGlobalEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Click outside handlers
    document.addEventListener('click', handleOutsideClicks);
    
    // Form submissions (exclude profile forms which have their own handlers)
    document.querySelectorAll('form').forEach(form => {
        // Skip profile forms, data room forms, and other forms with specific handlers
        if (!form.id.includes('personal-info-form') &&
            !form.id.includes('social-links-form') &&
            !form.id.includes('edit-data-room-form') &&
            !form.id.includes('create-data-room-form') &&
            !form.id.includes('idea-form') &&
            !form.id.includes('review-form') &&
            !form.id.includes('time-entry-form')) {
            form.addEventListener('submit', handleFormSubmit);
        }
    });
    
    // Auto-save for textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', debounce(autoSave, window.IMI.config.SESSION.autoSaveInterval));
    });
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
    }
    
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentWork();
    }
}

// Handle clicks outside of dropdowns/modals
function handleOutsideClicks(e) {
    // Close dropdowns if clicking outside
    const dropdowns = document.querySelectorAll('.dropdown-menu.active');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target) && !e.target.closest('.dropdown-toggle')) {
            dropdown.classList.remove('active');
        }
    });
}

// Handle form submissions
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formId = e.target.id;
    const formData = new FormData(e.target);
    
    console.log(`Form submitted: ${formId}`, Object.fromEntries(formData));
    
    // Show success message
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Changes saved successfully!', 'success');
    }
    
    // In production, send to API
    // submitForm(formId, formData);
}

// Auto-save functionality
function autoSave(e) {
    const element = e.target;
    const content = element.value;
    const id = element.id || element.name;
    
    if (content.length > 0) {
        console.log(`Auto-saving ${id}...`);
        
        // Update status indicator
        const statusElement = element.closest('.section')?.querySelector('.save-status');
        if (statusElement) {
            statusElement.textContent = '✓ Saved';
            statusElement.classList.add('saved');
        }
        
        // In production, save to API
        // saveContent(id, content);
    }
}

// Focus search input
function focusSearch() {
    const searchInput = document.querySelector('.company-search, .search-input');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

// Save current work
function saveCurrentWork() {
    const activeSection = document.querySelector('.page-section.active');
    if (activeSection) {
        const textareas = activeSection.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (textarea.value.length > 0) {
                autoSave({ target: textarea });
            }
        });
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('All changes saved!', 'success');
        }
    }
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle redemption action
function handleRedemption(btn) {
    const redemptionItem = btn.closest('.redemption-item');
    if (!redemptionItem) {
        console.error('❌ Could not find redemption item container');
        return;
    }

    const itemName = redemptionItem.querySelector('.redemption-title').textContent;
    const costText = redemptionItem.querySelector('.redemption-cost').textContent;

    if (confirm(`Redeem ${itemName} for ${costText}?`)) {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification(`Successfully redeemed ${itemName}!`, 'success');
        }

        // Parse cost properly
        const costMatch = costText.match(/(\d+)/);
        if (!costMatch) {
            console.error('❌ Could not parse cost from:', costText);
            return;
        }
        const costXP = parseInt(costMatch[1]);

        // Update userData.currentXP (single source of truth)
        if (window.IMI && window.IMI.data && window.IMI.data.userData) {
            window.IMI.data.userData.currentXP -= costXP;
            window.IMI.data.userData.xpSpent = (window.IMI.data.userData.xpSpent || 0) + costXP;
            console.log('✅ XP updated in userData:', window.IMI.data.userData.currentXP);
        }

        // Update available XP in sidebar
        const xpAvailableElement = document.querySelector('.text-muted.small');
        if (xpAvailableElement && xpAvailableElement.textContent.includes('XP available')) {
            const currentXPMatch = xpAvailableElement.textContent.match(/([\d,]+)/);
            if (currentXPMatch) {
                const currentXP = parseInt(currentXPMatch[1].replace(/,/g, ''));
                const newBalance = currentXP - costXP;
                const formattedBalance = newBalance.toLocaleString();
                xpAvailableElement.textContent = `${formattedBalance} XP available`;
            }
        }

        // Update the gamification stats XP display
        const statMainElements = document.querySelectorAll('.stat-main');
        statMainElements.forEach(el => {
            if (el.textContent.includes('XP') || el.textContent.includes('pts')) {
                const currentXPMatch = el.textContent.match(/([\d,]+)/);
                if (currentXPMatch) {
                    const currentXP = parseInt(currentXPMatch[1].replace(/,/g, ''));
                    const newBalance = currentXP - costXP;
                    const formattedBalance = newBalance.toLocaleString();
                    el.textContent = `${formattedBalance} XP`;
                }
            }
        });

        // Disable the button and change appearance
        btn.disabled = true;
        btn.textContent = 'Redeemed';
        btn.classList.add('redeemed');
    }
}

// Set up redemption handlers for dashboard
function setupDashboardRedemptionHandlers() {
    // Handle redemption buttons on the dashboard sidebar
    const dashboardRedeemButtons = document.querySelectorAll('.redemption-item .btn.btn-primary-small');

    dashboardRedeemButtons.forEach((btn) => {
        // Only add handler if button text is "Redeem"
        if (btn.textContent.trim() === 'Redeem') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleRedemption(this);
            });
        }
    });
}

// Update notification badge count on initial load
function updateNotificationBadgeCount() {
    // Count unread notifications if they exist in DOM
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');

    if (badge) {
        // If we can count actual unread notifications, use that count
        if (unreadNotifications.length > 0) {
            badge.textContent = unreadNotifications.length;
            badge.style.display = 'flex';
        } else {
            // Otherwise use the default (6 unread messages as per actual content)
            // This ensures consistency even before navigating to notifications page
            const currentCount = parseInt(badge.textContent) || 6;
            badge.textContent = currentCount;
            badge.style.display = currentCount > 0 ? 'flex' : 'none';
        }
    }
}

// Export utilities for use in other modules
window.IMI = window.IMI || {};
window.IMI.utils = window.IMI.utils || {
    debounce,
    throttle
    // showNotification is now provided by the universal toast system in toast.js
};
window.IMI.data = {
    userData: null,
    sessionData: null
};