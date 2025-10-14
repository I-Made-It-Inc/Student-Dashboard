// js/page-loader.js - Dynamic Page Loading Module

// Cache for loaded pages to avoid repeated fetches
const pageCache = new Map();

// Initialize page loader
function initializePageLoader() {
    // Preload the dashboard page (most commonly accessed)
    preloadPage('dashboard');
}

// Load page content dynamically
async function loadPage(pageId) {
    try {
        // Check cache first
        if (pageCache.has(pageId)) {
            return pageCache.get(pageId);
        }

        // Fetch page content
        const response = await fetch(`pages/${pageId}.html`);

        if (!response.ok) {
            throw new Error(`Failed to load page: ${pageId} (${response.status})`);
        }

        const content = await response.text();

        // Cache the content
        pageCache.set(pageId, content);

        return content;

    } catch (error) {
        console.error(`Error loading page ${pageId}:`, error);

        // Return fallback content
        return getFallbackContent(pageId);
    }
}

// Inject page content into the DOM
function injectPageContent(pageId, content) {
    const container = document.getElementById('page-container');
    if (!container) {
        console.error('Page container not found');
        return false;
    }

    // Clear existing content (including loading state)
    container.innerHTML = '';

    // Inject new content
    container.innerHTML = content;

    // Ensure the injected page section has the active class
    const pageSection = container.querySelector(`#${pageId}-page`);
    if (pageSection) {
        pageSection.classList.add('active');
        // Hide loading state and show content
        pageSection.style.display = 'block';
    } else {
        console.error(`Could not find page section with id: ${pageId}-page`);
        console.log('Available elements in container:', container.innerHTML.substring(0, 200));
    }

    // Initialize page-specific functionality
    initializePageSpecificFeatures(pageId);

    return true;
}

// Initialize page-specific features after content injection
function initializePageSpecificFeatures(pageId) {
    switch(pageId) {
        case 'dashboard':
            // Dashboard is already handled by main.js
            setupDashboardRedemptionHandlers();
            break;

        case 'innovation':
            if (typeof initializeBlueprintChallenge === 'function') {
                initializeBlueprintChallenge();
            }
            break;

        case 'ideas':
            if (typeof initializeIdeasPage === 'function') {
                initializeIdeasPage();
            }
            break;

        case 'projects':
            // Initialize project-specific functionality
            initializeProjectsFeatures();
            break;

        case 'companies':
            if (typeof initializeCompanies === 'function') {
                initializeCompanies();
            }
            break;

        case 'network':
            // Initialize network features
            initializeNetworkFeatures();
            break;

        case 'resources':
            // Initialize resources features
            initializeResourcesFeatures();
            break;

        case 'tracking':
            if (typeof initializeTimeTracking === 'function') {
                initializeTimeTracking();
            }
            break;

        case 'profile':
            if (typeof initializeProfile === 'function') {
                initializeProfile();
            }
            break;

        case 'notifications':
            if (typeof initializeNotifications === 'function') {
                initializeNotifications();
            }
            break;

        default:
            break;
    }

    // Re-initialize global features that might be needed
    setupGlobalEventListeners();
}

// Initialize projects page features
function initializeProjectsFeatures() {
    // Set up project interaction handlers
    const projectButtons = document.querySelectorAll('.btn');
    projectButtons.forEach(button => {
        if (!button.hasAttribute('data-handler-added')) {
            button.addEventListener('click', handleProjectActions);
            button.setAttribute('data-handler-added', 'true');
        }
    });
}

// Initialize network page features
function initializeNetworkFeatures() {
    // Set up connection interaction handlers
    const connectButtons = document.querySelectorAll('.connect-btn');
    connectButtons.forEach(button => {
        if (!button.hasAttribute('data-handler-added')) {
            button.addEventListener('click', handleConnectionActions);
            button.setAttribute('data-handler-added', 'true');
        }
    });
}

// Initialize resources page features
function initializeResourcesFeatures() {
    // Set up resource link handlers
    const resourceLinks = document.querySelectorAll('.resource-link');
    resourceLinks.forEach(link => {
        if (!link.hasAttribute('data-handler-added')) {
            link.addEventListener('click', handleResourceAccess);
            link.setAttribute('data-handler-added', 'true');
        }
    });
}

// Handle project actions
function handleProjectActions(e) {
    const button = e.target;
    const action = button.textContent.trim();

    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`${action} completed!`, 'success');
    }
}

// Handle connection actions
function handleConnectionActions(e) {
    const button = e.target;
    const action = button.textContent.trim();

    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`${action} successful!`, 'success');
    }
}

// Handle resource access
function handleResourceAccess(e) {
    const link = e.target;
    const resource = link.textContent.trim();

    // Track resource access for analytics
    if (typeof logPageTime === 'function') {
        logPageTime('resource_access', Date.now());
    }
}

// Preload specific pages for better performance
async function preloadPage(pageId) {
    try {
        await loadPage(pageId);
    } catch (error) {
        console.error(`Failed to preload page ${pageId}:`, error);
    }
}

// Preload multiple pages
async function preloadPages(pageIds) {
    const promises = pageIds.map(pageId => preloadPage(pageId));
    await Promise.allSettled(promises);
}

// Get fallback content when page fails to load
function getFallbackContent(pageId) {
    return `
        <div id="${pageId}-page" class="page-section active">
            <div class="card">
                <div class="error-content">
                    <h3>⚠️ Page Loading Error</h3>
                    <p>Sorry, we couldn't load the ${pageId} page. Please try refreshing the page.</p>
                    <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            </div>
        </div>
    `;
}

// Clear page cache (useful for development)
function clearPageCache() {
    pageCache.clear();
    console.log('Page cache cleared');
}

// Get cache statistics
function getCacheStats() {
    return {
        size: pageCache.size,
        pages: Array.from(pageCache.keys())
    };
}

// Export functions for global use
window.pageLoader = {
    loadPage,
    injectPageContent,
    preloadPage,
    preloadPages,
    clearPageCache,
    getCacheStats,
    initializePageLoader
};

// Auto-initialize if not already initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageLoader);
} else {
    initializePageLoader();
}