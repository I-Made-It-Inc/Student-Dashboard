// js/navigation.js - Navigation and Page Management

// Initialize navigation
function initializeNavigation() {
    // Set up nav link click handlers
    setupNavLinks();

    // Set up mobile menu
    setupMobileMenu();

    // Set up user menu dropdown
    setupUserMenu();

    // Show initial page FIRST (before setting up history management to avoid double-navigation)
    const initialPage = getPageFromURL();

    // Check if this is a data room preview/external view
    if (initialPage.startsWith('data-room-preview/') || initialPage.startsWith('data-room/')) {
        handleDataRoomRoute(initialPage);
    } else {
        showPage(initialPage, false); // Don't push state on initial load
    }

    // Set up browser back/forward AFTER initial page is shown
    // This prevents the hashchange listener from firing during initialization
    setupHistoryManagement();

    // Mark the page as ready (prevents FOUC)
    // This will fade in the container via CSS transition
    document.body.classList.add('js-ready');
}

// Show specific page
function showPage(pageId, pushState = true) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    // Remove active dropdown parent class
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.classList.remove('has-active-child');
    });

    // Show selected page
    const selectedPage = document.getElementById(`${pageId}-page`);

    if (selectedPage) {
        selectedPage.classList.add('active');
        // Load page-specific content
        loadPageContent(pageId);
    } else {
        console.error(`❌ Page not found: ${pageId}`);
    }
    
    // Update active nav link (only for pages that have nav links)
    const selectedNav = document.getElementById(`nav-${pageId}`);
    if (selectedNav) {
        selectedNav.classList.add('active');
        
        // If this nav item is inside a dropdown, mark the dropdown as having active child
        const parentDropdown = selectedNav.closest('.nav-dropdown');
        if (parentDropdown) {
            parentDropdown.classList.add('has-active-child');
        }
    }
    
    // Update URL without reload (only if pushState is true)
    if (pushState) {
        updateURL(pageId);
    }
    
    // Dispatch page change event
    document.dispatchEvent(new CustomEvent('pageChange', { 
        detail: { page: pageId } 
    }));
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update page title
    updatePageTitle(pageId);
}

// Load page-specific content
function loadPageContent(pageId) {
    switch(pageId) {
        case 'dashboard':
            loadDashboardContent();
            break;
        case 'blueprint':
            loadBlueprintContent();
            break;
        case 'ideas':
            loadIdeasContent();
            break;
        case 'projects':
            loadProjectsContent();
            break;
        case 'companies':
            loadCompaniesContent();
            break;
        case 'network':
            loadNetworkContent();
            break;
        case 'resources':
            loadResourcesContent();
            break;
        case 'tracking':
            loadTimeTrackingContent();
            break;
        case 'profile':
            loadProfileContent();
            break;
        case 'notifications':
            loadNotificationsContent();
            break;
        case 'data-rooms':
            loadDataRoomsContent();
            break;
    }
}

// Dashboard content loader
function loadDashboardContent() {
    console.log('📄 loadDashboardContent() called');

    // Refresh profile information from latest userData
    if (window.IMI && window.IMI.data && window.IMI.data.userData) {
        const userData = window.IMI.data.userData;
        console.log('📊 userData available in loadDashboardContent, XP:', userData.currentXP);

        // Update welcome message with display name (nickname)
        const welcomeMessage = document.querySelector('.profile-info h2');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
        }

        // Update profile details (job title)
        const profileDetails = document.querySelector('.profile-details');
        if (profileDetails) {
            // Use jobTitle if available and not a placeholder, otherwise leave blank
            if (userData.jobTitle && !userData.jobTitle.startsWith('[')) {
                profileDetails.textContent = userData.jobTitle;
            } else {
                profileDetails.textContent = '';
            }
        }

        // Refresh stats (including XP)
        console.log('📊 Calling updateDashboardStats with userData.currentXP:', userData.currentXP);
        updateDashboardStats(userData);
    } else {
        console.warn('⚠️ userData NOT available in loadDashboardContent, calling updateDashboardStats() with no data');
        // Fallback if userData not available
        updateDashboardStats();
    }

    // Load recent activity
    loadRecentActivity();

    // Update leaderboard
    updateLeaderboard();

    // Update blueprint challenge AFTER everything else has settled
    // The setTimeout is necessary because something is resetting the dashboard HTML after this function
    if (typeof updateDashboardBlueprintChallenge === 'function') {
        setTimeout(() => {
            updateDashboardBlueprintChallenge();
        }, 200); // Single timeout value for both modes
    }
}

// Blueprint content loader
function loadBlueprintContent() {
    // Update XP display from userData (single source of truth)
    if (typeof updateBlueprintXPDisplay === 'function') {
        updateBlueprintXPDisplay();
    }

    // Load current challenge
    loadCurrentChallenge();

    // Update progress
    updateChallengeProgress();

    // Load leaderboard
    loadBlueprintLeaderboard();
}

// Ideas content loader
function loadIdeasContent() {
    // Initialize ideas page functionality
    if (typeof initializeIdeasPage === 'function') {
        initializeIdeasPage();
    }
    
    // Load community ideas feed
    loadCommunityIdeas();
    
    // Load user's ideas
    loadUserIdeas();
}

// Data rooms content loader
function loadDataRoomsContent() {
    try {
        // Initialize data rooms functionality completely
        if (typeof initializeDataRooms === 'function') {
            initializeDataRooms();
        } else {
            console.error('initializeDataRooms function not available');
        }

        // Ensure document library is synchronized
        if (typeof window.documentLibrary === 'undefined') {
            console.error('Document library not available - attempting to load from profile...');
            // Try to initialize document library from profile
            if (typeof initializeProfile === 'function') {
                initializeProfile();
            }
        }
    } catch (error) {
        console.error('Error loading data rooms content:', error);
    }
}

// Load current challenge
function loadCurrentChallenge() {
    // In production, fetch from API
}

// Update progress
function updateChallengeProgress() {
    // In production, fetch from API
}

// Load blueprint leaderboard
function loadBlueprintLeaderboard() {
    // In production, fetch from API
}

// Load community ideas
function loadCommunityIdeas() {
    // In production, fetch from API
}

// Load user's ideas
function loadUserIdeas() {
    // In production, fetch from API
}

// Notifications content loader
function loadNotificationsContent() {
    // Initialize if the function exists from notifications.js
    if (typeof window.initializeNotifications === 'function') {
        window.initializeNotifications();
    } else if (typeof initializeNotifications === 'function') {
        initializeNotifications();
    } else {
        // Fallback - try again after a small delay
        setTimeout(() => {
            if (typeof window.initializeNotifications === 'function') {
                window.initializeNotifications();
            } else if (typeof initializeNotifications === 'function') {
                initializeNotifications();
            }
        }, 100);
    }
}

// Load time data
function loadTimeData() {
    // In production, fetch from API
}

// Update time charts
function updateTimeCharts() {
    // In production, update charts
}

// Export functions for global use

// Projects content loader
function loadProjectsContent() {
    // Load active projects
    loadActiveProjects();
    
    // Load available projects
    loadAvailableProjects();
}

// Load active projects
function loadActiveProjects() {
    // In production, fetch from API
}

// Load available projects
function loadAvailableProjects() {
    // In production, fetch from API
}

// Companies content loader
function loadCompaniesContent() {
    // Ensure companies filters are properly initialized
    if (typeof window.activeFilters !== 'undefined' && window.activeFilters.size === 0) {
        window.activeFilters.add('All');
    }
    
    // Reset filter chips UI to match state
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        const filterText = chip.textContent.trim();
        if (window.activeFilters && window.activeFilters.has(filterText)) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
    
    // Load company data
    if (typeof window.loadCompanyDirectory === 'function') {
        window.loadCompanyDirectory();
    }
}

// Network content loader
function loadNetworkContent() {
    // Load connections
    loadConnections();
    
    // Load peer suggestions
    loadPeerSuggestions();
}

// Load connections
function loadConnections() {
    // In production, fetch from API
}

// Load peer suggestions
function loadPeerSuggestions() {
    // In production, fetch from API
}

// Resources content loader
function loadResourcesContent() {
    // Load publications
    loadPublications();
    
    // Load AI tools
    loadAITools();
}

// Load publications
function loadPublications() {
    // In production, fetch from API
}

// Load AI tools
function loadAITools() {
    // In production, fetch from API
}

// Time tracking content loader
function loadTimeTrackingContent() {
    // Load time data
    loadTimeData();
    
    // Update charts
    updateTimeCharts();
}

// Profile content loader
function loadProfileContent() {
    try {
        // Initialize profile functionality completely
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        } else {
            console.error('initializeProfile function not available');
            // Fallback to just loading data
            loadProfileData();
        }
    } catch (error) {
        console.error('Error in loadProfileContent:', error);
        // Fallback: try to initialize profile directly
        setTimeout(() => {
            if (typeof initializeProfile === 'function') {
                initializeProfile();
            } else {
                console.error('Fallback: initializeProfile not available');
            }
        }, 200);
    }
}

// Load profile data
function loadProfileData() {
    // Try direct call first
    if (typeof initializeProfile === 'function') {
        initializeProfile();
        return;
    }

    // Try window.initializeProfile
    if (typeof window.initializeProfile === 'function') {
        window.initializeProfile();
        return;
    }

    // Force load profile functionality with retries
    let retryCount = 0;
    const maxRetries = 5;

    const tryInitialize = () => {
        retryCount++;

        if (typeof initializeProfile === 'function') {
            initializeProfile();
            return;
        }

        if (typeof window.initializeProfile === 'function') {
            window.initializeProfile();
            return;
        }

        if (retryCount < maxRetries) {
            setTimeout(tryInitialize, 100 * retryCount); // Exponential backoff
        } else {
            console.error('❌ Failed to initialize profile after all retries');
            // Manual fallback - call the core functions directly
            if (typeof window.setupDocumentUploads === 'function') {
                window.setupDocumentUploads();
            }
            if (typeof window.loadDocumentsFromLibrary === 'function') {
                window.loadDocumentsFromLibrary();
            }
        }
    };

    tryInitialize();
}

// Setup profile forms
function setupProfileForms() {
    // Setup form validation and submission handlers
}

// Setup navigation links
function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const pageId = href.substring(1);
                showPage(pageId);
            }
        });
    });
    
    // Setup dropdown toggles for mobile
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.closest('.nav-dropdown');
            
            // On mobile, toggle the dropdown menu
            if (window.innerWidth <= 768) {
                dropdown.classList.toggle('mobile-active');
            }
            // On desktop, dropdowns work on hover, so this click does nothing
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
            
            // Close all dropdown menus when mobile menu closes
            if (!navLinks.classList.contains('mobile-active')) {
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('mobile-active');
                });
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navLinks.classList.contains('mobile-active')) {
            navLinks.classList.remove('mobile-active');
            mobileToggle.classList.remove('active');
            
            // Close all dropdown menus
            document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                dropdown.classList.remove('mobile-active');
            });
        }
    });
    
    // Close mobile menu when a nav link is clicked (but not dropdown toggles)
    document.querySelectorAll('.nav-links a:not(.nav-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
                
                // Close all dropdown menus
                document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('mobile-active');
                });
            }
        });
    });
}

// Setup user menu dropdown
function setupUserMenu() {
    const userAvatar = document.querySelector('.user-avatar');

    if (userAvatar) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Navigate directly to profile page instead of showing dropdown
            showPage('profile');
        });

        // Store a reference to test later
        window.avatarElement = userAvatar;

        // Test function to verify click handler is still working
        window.testAvatarClick = () => {
            const currentAvatar = document.querySelector('.user-avatar');
            console.log('Testing avatar click - Same element?', currentAvatar === window.avatarElement);
            console.log('Pointer events:', window.getComputedStyle(currentAvatar).pointerEvents);
            currentAvatar.click();
        };
    } else {
        console.error('❌ User avatar element not found');
    }
}

// Test function to check if avatar navigation is working
function testAvatarNavigation() {
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        // Try to re-establish the click handler as a fallback
        userAvatar.removeEventListener('click', setupUserMenu); // Remove any existing
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            showPage('profile');
        });
    } else {
        console.error('❌ User avatar not found during test');
    }
}

// Export test function
window.testAvatarNavigation = testAvatarNavigation;

// Toggle user dropdown menu
function toggleUserDropdown() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Setup browser history management
function setupHistoryManagement() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            // Check if this is a data room preview/external view
            if (e.state.page.startsWith('data-room-preview/') || e.state.page.startsWith('data-room/')) {
                handleDataRoomRoute(e.state.page);
            } else {
                showPage(e.state.page, false); // Don't push state when navigating via browser buttons
            }
        }
    });

    // Handle hash changes (for direct navigation)
    window.addEventListener('hashchange', () => {
        const currentPage = getPageFromURL();

        if (currentPage.startsWith('data-room-preview/') || currentPage.startsWith('data-room/')) {
            handleDataRoomRoute(currentPage);
        } else {
            // Check if we're leaving a data room preview - clean up if so
            const previewContainer = document.getElementById('data-room-preview-container');
            if (previewContainer && previewContainer.style.display !== 'none') {
                // Hide preview container
                previewContainer.style.display = 'none';

                // Restore nav bar
                const nav = document.querySelector('.nav');
                if (nav) nav.style.display = '';

                // Restore main container
                const mainContainer = document.querySelector('.container');
                if (mainContainer) mainContainer.style.display = '';
            }

            showPage(currentPage, false);
        }
    });

    // Set initial state only if not already set correctly
    // (Page has already been shown in initializeNavigation before this function is called)
    const currentHash = window.location.hash.slice(1);
    const currentPage = getPageFromURL();

    // Only update history state if the current state is not set or is different
    if (!history.state || history.state.page !== currentPage) {
        history.replaceState({ page: currentPage }, '', `#${currentPage}`);
    }
}

// Handle data room preview and external routes
function handleDataRoomRoute(route) {
    const parts = route.split('/');
    const mode = parts[0]; // 'data-room-preview' or 'data-room'
    const roomId = parts[1];

    // IMMEDIATELY hide nav bar and all page sections before doing anything else
    // This prevents the dashboard from flashing while we wait for user data
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.display = 'none';
    }

    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }

    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Check if the preview function is available
    if (typeof window.showDataRoomPreview === 'function') {
        if (mode === 'data-room-preview') {
            // Student preview mode
            window.showDataRoomPreview(roomId, true);
        } else if (mode === 'data-room') {
            // External/recruiter view
            window.showDataRoomPreview(roomId, false);
        }
    } else {
        console.error('showDataRoomPreview function not available. Data room preview functionality may not be loaded.');

        // Fallback: try again after a short delay to allow JS files to load
        setTimeout(() => {
            if (typeof window.showDataRoomPreview === 'function') {
                if (mode === 'data-room-preview') {
                    window.showDataRoomPreview(roomId, true);
                } else if (mode === 'data-room') {
                    window.showDataRoomPreview(roomId, false);
                }
            } else {
                console.error('showDataRoomPreview still not available after delay');
            }
        }, 500);
    }
}

// Update URL without page reload
function updateURL(pageId) {
    const newURL = `#${pageId}`;
    history.pushState({ page: pageId }, '', newURL);
}

// Get page from URL hash
function getPageFromURL() {
    const hash = window.location.hash.slice(1);

    // Check for data room preview/external view first
    if (hash.startsWith('data-room-preview/') || hash.startsWith('data-room/')) {
        return hash; // Return the full hash for special handling
    }

    // Validate that the page exists
    const validPages = ['dashboard', 'blueprint', 'ideas', 'projects', 'companies', 'network', 'resources', 'tracking', 'profile', 'notifications', 'data-rooms'];
    return validPages.includes(hash) ? hash : 'dashboard';
}

// Update page title
function updatePageTitle(pageId) {
    const titles = {
        dashboard: 'Dashboard',
        blueprint: 'Blueprint for the Future',
        ideas: 'Ideas & Innovation Hub',
        projects: 'Co-op Projects',
        companies: 'Companies Directory',
        network: 'Professional Network',
        resources: 'Resources & Tools',
        tracking: 'Time Tracking',
        profile: 'Profile Settings',
        notifications: 'Notifications',
        'data-rooms': 'Virtual Data Rooms'
    };
    
    document.title = `${titles[pageId] || 'Dashboard'} - IMI Student Portal`;
}

// Update dashboard statistics
// updateDashboardStats is defined in main.js

// Load recent activity
function loadRecentActivity() {
    // In production, fetch from API
}

// Update leaderboard
function updateLeaderboard() {
    // In production, fetch from API

    // Simulate data update
    const leaderboardData = [
        { rank: 1, name: 'Alex Chen', points: 3240 },
        { rank: 2, name: 'Maria G.', points: 3180 },
        { rank: 3, name: 'James W.', points: 2950 }
    ];

    // Update UI
    const leaderboardList = document.querySelector('.leaderboard-list');
    if (leaderboardList) {
        // Update with new data
    }
}

// Breadcrumb navigation
function updateBreadcrumb(path) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = path.map((item, index) => {
            if (index === path.length - 1) {
                return `<span class="current">${item.label}</span>`;
            }
            return `<a href="#" onclick="showPage('${item.page}')">${item.label}</a>`;
        }).join(' / ');
    }
}

// Show page with pre-selected filter
function showPageWithFilter(pageId, filter) {
    // Navigate to the page
    showPage(pageId);
    
    // Apply the filter after a short delay to ensure page is loaded
    setTimeout(() => {
        if (pageId === 'companies' && filter === 'referral') {
            // Clear all existing filters first
            if (typeof window.clearAllFilters === 'function') {
                window.clearAllFilters();
            }
            
            // Find the referral program chip
            const referralChip = Array.from(document.querySelectorAll('.chip')).find(
                chip => chip.textContent.trim() === 'Has Referral Program'
            );
            
            if (referralChip) {
                // Activate the referral chip manually
                referralChip.classList.add('active');
                
                // Update activeFilters set
                if (window.activeFilters) {
                    window.activeFilters.delete('All');
                    window.activeFilters.add('Has Referral Program');
                }
                
                // Deactivate the "All" chip
                const allChip = document.querySelector('.chip:first-child');
                if (allChip) {
                    allChip.classList.remove('active');
                }
                
                // Apply the filter
                if (typeof window.filterCompanies === 'function') {
                    window.filterCompanies();
                }
            }
        }
    }, 100);
}

// Export functions for global use
window.showPage = showPage;
window.showPageWithFilter = showPageWithFilter;
window.initializeNavigation = initializeNavigation;
window.loadProfileData = loadProfileData;
window.setupProfileForms = setupProfileForms;