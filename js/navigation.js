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
}

// Show specific page
function showPage(pageId) {
    console.log(`Navigating to: ${pageId}`);
    
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageId}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Load page-specific content
        loadPageContent(pageId);
    }
    
    // Update active nav link
    const selectedNav = document.getElementById(`nav-${pageId}`);
    if (selectedNav) {
        selectedNav.classList.add('active');
    }
    
    // Update URL without reload
    updateURL(pageId);
    
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

// Projects content loader
function loadProjectsContent() {
    console.log('Loading projects content...');
    
    // Load active projects
    loadActiveProjects();
    
    // Load available projects
    loadAvailableProjects();
}

// Companies content loader
function loadCompaniesContent() {
    console.log('Loading companies content...');
    
    // Load company directory
    loadCompanyDirectory();
    
    // Load recommendations
    loadCompanyRecommendations();
}

// Network content loader
function loadNetworkContent() {
    console.log('Loading network content...');
    
    // Load connections
    loadConnections();
    
    // Load peer suggestions
    loadPeerSuggestions();
}

// Resources content loader
function loadResourcesContent() {
    console.log('Loading resources content...');
    
    // Load publications
    loadPublications();
    
    // Load AI tools
    loadAITools();
}

// Time tracking content loader
function loadTimeTrackingContent() {
    console.log('Loading time tracking content...');
    
    // Load time data
    loadTimeData();
    
    // Update charts
    updateTimeCharts();
}

// Setup navigation links
function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.id.replace('nav-', '');
            showPage(pageId);
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
        });
    }
}

// Setup user menu dropdown
function setupUserMenu() {
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userAvatar) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }
}

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
            showPage(e.state.page);
        }
    });
    
    // Set initial state
    const initialPage = getPageFromURL() || 'dashboard';
    history.replaceState({ page: initialPage }, '', `#${initialPage}`);
}

// Update URL without page reload
function updateURL(pageId) {
    const newURL = `#${pageId}`;
    history.pushState({ page: pageId }, '', newURL);
}

// Get page from URL hash
function getPageFromURL() {
    const hash = window.location.hash.slice(1);
    return hash || null;
}

// Update page title
function updatePageTitle(pageId) {
    const titles = {
        dashboard: 'Dashboard',
        innovation: 'Innovation Challenge',
        projects: 'Co-op Projects',
        companies: 'Companies Directory',
        network: 'Professional Network',
        resources: 'Resources & Tools',
        tracking: 'Time Tracking'
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

// Export functions for global use
window.showPage = showPage;
window.initializeNavigation = initializeNavigation;