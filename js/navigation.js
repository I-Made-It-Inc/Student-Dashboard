// js/navigation.js - Navigation and Page Management

// Initialize navigation
function initializeNavigation() {
    console.log('Initializing navigation...');

    // Set up nav link click handlers
    setupNavLinks();

    // Set up mobile menu
    setupMobileMenu();

    // Set up user menu dropdown
    setupUserMenu();

    // Handle browser back/forward
    setupHistoryManagement();

    // Show initial page from URL or default to dashboard
    const initialPage = getPageFromURL();

    // Check if this is a data room preview/external view
    if (initialPage.startsWith('data-room-preview/') || initialPage.startsWith('data-room/')) {
        console.log('Initial page is data room route:', initialPage);
        handleDataRoomRoute(initialPage);
    } else {
        console.log('Initial page is regular page:', initialPage);
        showPage(initialPage, false); // Don't push state on initial load
    }
}

// Show specific page
function showPage(pageId, pushState = true) {
    console.log(`Navigating to: ${pageId}`);

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
    console.log(`🔍 Looking for page element: ${pageId}-page`);
    console.log(`📄 Page element found:`, !!selectedPage);

    if (selectedPage) {
        selectedPage.classList.add('active');
        console.log(`✅ Page ${pageId} made active`);

        // Load page-specific content
        console.log(`🔄 About to call loadPageContent(${pageId})`);
        loadPageContent(pageId);
        console.log(`✅ loadPageContent(${pageId}) called`);
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
        case 'innovation':
            loadInnovationContent();
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
    console.log('Loading dashboard content...');
    
    // Refresh stats
    updateDashboardStats();
    
    // Load recent activity
    loadRecentActivity();
    
    // Update leaderboard
    updateLeaderboard();
}

// Innovation content loader
function loadInnovationContent() {
    console.log('Loading innovation challenge content...');
    
    // Load current challenge
    loadCurrentChallenge();
    
    // Update progress
    updateChallengeProgress();
    
    // Load leaderboard
    loadInnovationLeaderboard();
}

// Ideas content loader
function loadIdeasContent() {
    console.log('Loading ideas & innovation content...');
    
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
    console.log('Loading data rooms content...');

    try {
        // Initialize data rooms functionality completely
        console.log('About to call initializeDataRooms...');
        if (typeof initializeDataRooms === 'function') {
            initializeDataRooms();
            console.log('initializeDataRooms called successfully');
        } else {
            console.error('initializeDataRooms function not available');
        }

        // Ensure document library is synchronized
        console.log('Checking document library sync...');
        if (typeof window.documentLibrary !== 'undefined') {
            console.log('Document library available:', Object.keys(window.documentLibrary));
        } else {
            console.error('Document library not available - attempting to load from profile...');
            // Try to initialize document library from profile
            if (typeof initializeProfile === 'function') {
                console.log('Calling initializeProfile to set up document library...');
                initializeProfile();
                console.log('Profile initialization completed for document library sync');
            }
        }

    } catch (error) {
        console.error('Error loading data rooms content:', error);
    }
}

// Load current challenge
function loadCurrentChallenge() {
    console.log('Loading current challenge...');
    // In production, fetch from API
}

// Update progress
function updateChallengeProgress() {
    console.log('Updating challenge progress...');
    // In production, fetch from API
}

// Load innovation leaderboard
function loadInnovationLeaderboard() {
    console.log('Loading innovation leaderboard...');
    // In production, fetch from API
}

// Load community ideas
function loadCommunityIdeas() {
    console.log('Loading community ideas...');
    // In production, fetch from API
}

// Load user's ideas
function loadUserIdeas() {
    console.log('Loading user ideas...');
    // In production, fetch from API
}

// Notifications content loader
function loadNotificationsContent() {
    console.log('Loading notifications content...');
    
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
    console.log('Loading time data...');
    // In production, fetch from API
}

// Update time charts
function updateTimeCharts() {
    console.log('Updating time charts...');
    // In production, update charts
}

// Export functions for global use

// Projects content loader
function loadProjectsContent() {
    console.log('Loading projects content...');
    
    // Load active projects
    loadActiveProjects();
    
    // Load available projects
    loadAvailableProjects();
}

// Load active projects
function loadActiveProjects() {
    console.log('Loading active projects...');
    // In production, fetch from API
}

// Load available projects  
function loadAvailableProjects() {
    console.log('Loading available projects...');
    // In production, fetch from API
}

// Companies content loader
function loadCompaniesContent() {
    console.log('Loading companies content...');
    
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
    console.log('Loading network content...');
    
    // Load connections
    loadConnections();
    
    // Load peer suggestions
    loadPeerSuggestions();
}

// Load connections
function loadConnections() {
    console.log('Loading connections...');
    // In production, fetch from API
}

// Load peer suggestions
function loadPeerSuggestions() {
    console.log('Loading peer suggestions...');
    // In production, fetch from API
}

// Resources content loader
function loadResourcesContent() {
    console.log('Loading resources content...');
    
    // Load publications
    loadPublications();
    
    // Load AI tools
    loadAITools();
}

// Load publications
function loadPublications() {
    console.log('Loading publications...');
    // In production, fetch from API
}

// Load AI tools
function loadAITools() {
    console.log('Loading AI tools...');
    // In production, fetch from API
}

// Time tracking content loader
function loadTimeTrackingContent() {
    console.log('Loading time tracking content...');
    
    // Load time data
    loadTimeData();
    
    // Update charts
    updateTimeCharts();
}

// Profile content loader
function loadProfileContent() {
    console.log('Loading profile content...');

    try {
        // Initialize profile functionality completely
        console.log('About to call initializeProfile...');
        if (typeof initializeProfile === 'function') {
            initializeProfile();
            console.log('initializeProfile called successfully');
        } else {
            console.error('initializeProfile function not available');
            // Fallback to just loading data
            loadProfileData();
        }
    } catch (error) {
        console.error('Error in loadProfileContent:', error);
        // Fallback: try to initialize profile directly
        console.log('Trying fallback initialization...');
        setTimeout(() => {
            if (typeof initializeProfile === 'function') {
                console.log('Fallback: initializeProfile available, calling it');
                initializeProfile();
            } else {
                console.error('Fallback: initializeProfile not available');
            }
        }, 200);
    }
}

// Load profile data
function loadProfileData() {
    console.log('🔍 === LOAD PROFILE DATA STARTED ===');
    console.log('📋 Checking if initializeProfile exists:', typeof initializeProfile);
    console.log('📁 Profile.js loaded?', !!window.initializeProfile);

    // Force initialize profile functionality - try multiple approaches
    console.log('🔄 Attempting to initialize profile...');

    // Try direct call first
    if (typeof initializeProfile === 'function') {
        console.log('✅ initializeProfile available, calling directly');
        initializeProfile();
        return;
    }

    // Try window.initializeProfile
    if (typeof window.initializeProfile === 'function') {
        console.log('✅ window.initializeProfile available, calling it');
        window.initializeProfile();
        return;
    }

    // Force load profile functionality with retries
    console.log('⚠️ initializeProfile not available, forcing initialization...');
    let retryCount = 0;
    const maxRetries = 5;

    const tryInitialize = () => {
        retryCount++;
        console.log(`🔄 Initialization attempt ${retryCount}/${maxRetries}`);

        if (typeof initializeProfile === 'function') {
            console.log('✅ initializeProfile now available');
            initializeProfile();
            return;
        }

        if (typeof window.initializeProfile === 'function') {
            console.log('✅ window.initializeProfile now available');
            window.initializeProfile();
            return;
        }

        if (retryCount < maxRetries) {
            setTimeout(tryInitialize, 100 * retryCount); // Exponential backoff
        } else {
            console.error('❌ Failed to initialize profile after all retries');
            // Manual fallback - call the core functions directly
            console.log('🚨 Attempting manual profile initialization...');

            // Call the core functions directly if available
            if (typeof window.setupDocumentUploads === 'function') {
                console.log('📁 Calling setupDocumentUploads directly');
                window.setupDocumentUploads();
            }
            if (typeof window.loadDocumentsFromLibrary === 'function') {
                console.log('📚 Calling loadDocumentsFromLibrary directly');
                window.loadDocumentsFromLibrary();
            }
        }
    };

    tryInitialize();
}

// Setup profile forms
function setupProfileForms() {
    console.log('Setting up profile forms...');
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

    console.log('🔍 Looking for user avatar element...');
    console.log('Avatar element found:', !!userAvatar);
    console.log('Avatar element:', userAvatar);

    if (userAvatar) {
        console.log('✅ Setting up user avatar click handler');
        console.log('Avatar classes:', userAvatar.className);
        console.log('Avatar parent:', userAvatar.parentElement);

        userAvatar.addEventListener('click', (e) => {
            console.log('🎯 AVATAR CLICKED! Event details:');
            console.log('- Event target:', e.target);
            console.log('- Current target:', e.currentTarget);
            console.log('- Event type:', e.type);
            console.log('- Timestamp:', e.timeStamp);
            console.log('🚀 Navigating to profile...');
            e.stopPropagation();
            e.preventDefault();
            // Navigate directly to profile page instead of showing dropdown
            showPage('profile');
        });
        console.log('✅ User avatar click handler set up successfully');

        // Store a reference to test later
        window.avatarElement = userAvatar;

        // Test function to verify click handler is still working
        window.testAvatarClick = () => {
            console.log('🧪 Testing if avatar click handler is still attached...');
            const currentAvatar = document.querySelector('.user-avatar');
            console.log('Current avatar element:', currentAvatar);
            console.log('Same as stored avatar?', currentAvatar === window.avatarElement);
            console.log('Avatar classes:', currentAvatar?.className);
            console.log('Avatar computed styles - pointer-events:', window.getComputedStyle(currentAvatar).pointerEvents);
            console.log('Avatar computed styles - cursor:', window.getComputedStyle(currentAvatar).cursor);

            // Manually trigger a click to test
            console.log('🔬 Simulating click...');
            currentAvatar.click();
        };
    } else {
        console.error('❌ User avatar element not found');
        console.log('Available elements with "avatar" in class:',
            document.querySelectorAll('*[class*="avatar"]'));
        console.log('Available elements with "user" in class:',
            document.querySelectorAll('*[class*="user"]'));
    }
}

// Test function to check if avatar navigation is working
function testAvatarNavigation() {
    console.log('🧪 Testing avatar navigation...');
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        console.log('✅ User avatar found');
        console.log('Avatar element:', userAvatar);
        console.log('Avatar classes:', userAvatar.className);
        console.log('Click listeners count:', getEventListeners ? Object.keys(getEventListeners(userAvatar)).length : 'unknown');

        // Try to re-establish the click handler as a fallback
        console.log('🔧 Re-establishing avatar click handler as fallback...');
        userAvatar.removeEventListener('click', setupUserMenu); // Remove any existing
        userAvatar.addEventListener('click', (e) => {
            console.log('🎯 FALLBACK: User avatar clicked! Navigating to profile...');
            e.stopPropagation();
            showPage('profile');
        });
        console.log('✅ Fallback click handler established');
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
        console.log('🔄 === HASHCHANGE EVENT FIRED ===');
        console.log('📍 New hash:', window.location.hash);

        const currentPage = getPageFromURL();
        console.log('📄 Parsed page:', currentPage);

        if (currentPage.startsWith('data-room-preview/') || currentPage.startsWith('data-room/')) {
            console.log('🎯 Detected data room route, calling handleDataRoomRoute...');
            handleDataRoomRoute(currentPage);
        } else {
            console.log('📄 Regular page route, calling showPage...');
            showPage(currentPage, false);
        }
        console.log('🔄 === HASHCHANGE HANDLING COMPLETE ===');
    });

    // Set initial state but don't show page here (it's handled in initializeNavigation)
    const initialPage = getPageFromURL() || 'dashboard';
    history.replaceState({ page: initialPage }, '', `#${initialPage}`);
}

// Handle data room preview and external routes
function handleDataRoomRoute(route) {
    const parts = route.split('/');
    const mode = parts[0]; // 'data-room-preview' or 'data-room'
    const roomId = parts[1];

    console.log('Handling data room route:', route, 'Mode:', mode, 'Room ID:', roomId);

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
    console.log(`Updating URL to: ${newURL}`);
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
    const validPages = ['dashboard', 'innovation', 'ideas', 'projects', 'companies', 'network', 'resources', 'tracking', 'profile', 'notifications', 'data-rooms'];
    return validPages.includes(hash) ? hash : 'dashboard';
}

// Update page title
function updatePageTitle(pageId) {
    const titles = {
        dashboard: 'Dashboard',
        innovation: 'Innovation Challenge',
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
function updateDashboardStats() {
    // In production, fetch from API
    console.log('Updating dashboard stats...');
}

// Load recent activity
function loadRecentActivity() {
    // In production, fetch from API
    console.log('Loading recent activity...');
}

// Update leaderboard
function updateLeaderboard() {
    // In production, fetch from API
    console.log('Updating leaderboard...');
    
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
        console.log('Leaderboard updated');
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
            console.log('Applying referral filter...');
            
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