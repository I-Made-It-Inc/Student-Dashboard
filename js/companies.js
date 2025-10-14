// js/companies.js - Companies Directory Functionality

// Initialize companies features
function initializeCompanies() {
    // Set up search functionality
    setupCompanySearch();
    
    // Set up filter chips
    setupFilterChips();
    
    // Set up company cards
    setupCompanyCards();
    
    // Load initial company data
    loadCompanyDirectory();
    
    // Set up review system
    setupReviewSystem();
}

// Company data (in production, this would come from API)
const companiesData = [
    {
        id: 1,
        name: 'TechCorp',
        logo: 'TC',
        description: 'Leading software development company specializing in AI and machine learning solutions.',
        rating: 4.8,
        reviewCount: 24,
        tags: ['Technology', 'AI/ML', 'Remote'],
        hasReferral: true,
        referralAmount: '$500 per qualified lead',
        dimensions: {
            projectQuality: 4.5,
            mentorship: 4.8,
            workLifeBalance: 4.3,
            learningOpportunities: 5.0,
            careerGrowth: 4.4
        }
    },
    {
        id: 2,
        name: 'StartupXYZ',
        logo: 'SX',
        description: 'Fast-growing startup focused on innovative marketing solutions and growth hacking strategies.',
        rating: 4.2,
        reviewCount: 18,
        tags: ['Marketing', 'Growth', 'Hybrid'],
        hasReferral: false,
        dimensions: {
            projectQuality: 4.1,
            mentorship: 3.9,
            workLifeBalance: 3.5,
            learningOpportunities: 4.6,
            careerGrowth: 4.3
        }
    },
    {
        id: 3,
        name: 'DataCo Analytics',
        logo: 'DC',
        description: 'Data analytics and business intelligence solutions for enterprise clients.',
        rating: 4.8,
        reviewCount: 15,
        tags: ['Technology', 'Data Science', 'Remote'],
        hasReferral: true,
        referralAmount: '$300 per referral',
        dimensions: {
            projectQuality: 4.7,
            mentorship: 4.9,
            workLifeBalance: 4.5,
            learningOpportunities: 4.8,
            careerGrowth: 4.6
        }
    },
    {
        id: 4,
        name: 'GreenTech Hub',
        logo: 'GH',
        description: 'Sustainable technology solutions for environmental challenges.',
        rating: 4.6,
        reviewCount: 8,
        tags: ['Sustainability', 'CleanTech', 'On-site'],
        hasReferral: false,
        dimensions: {
            projectQuality: 4.5,
            mentorship: 4.7,
            workLifeBalance: 4.6,
            learningOpportunities: 4.4,
            careerGrowth: 4.2
        }
    },
    {
        id: 5,
        name: 'HealthTech Solutions',
        logo: 'HS',
        description: 'Digital health solutions improving patient care through technology.',
        rating: 4.7,
        reviewCount: 12,
        tags: ['Healthcare', 'Technology', 'Hybrid'],
        hasReferral: true,
        referralAmount: '$400 per clinical trial participant',
        dimensions: {
            projectQuality: 4.6,
            mentorship: 4.5,
            workLifeBalance: 4.2,
            learningOpportunities: 4.7,
            careerGrowth: 4.3
        }
    },
    {
        id: 6,
        name: 'FinanceFirst',
        logo: 'FF',
        description: 'Innovative financial services and investment solutions for modern businesses.',
        rating: 4.4,
        reviewCount: 20,
        tags: ['Finance', 'Technology', 'On-site'],
        hasReferral: false,
        dimensions: {
            projectQuality: 4.3,
            mentorship: 4.4,
            workLifeBalance: 4.0,
            learningOpportunities: 4.5,
            careerGrowth: 4.6
        }
    }
];

// Active filters
let activeFilters = new Set(['All']);
let searchQuery = '';

// Clear company search
function clearCompanySearch() {
    const searchInput = document.querySelector('.company-search');
    const clearButton = document.querySelector('.search-clear-btn');
    
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        filterCompanies();
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
}

// Setup company search
function setupCompanySearch() {
    const searchInput = document.querySelector('.company-search');
    const clearButton = document.querySelector('.search-clear-btn');
    if (!searchInput || !clearButton) return;
    
    // Set up clear button click handler
    clearButton.addEventListener('click', clearCompanySearch);
    
    searchInput.addEventListener('input', window.IMI.utils.debounce((e) => {
        searchQuery = e.target.value.toLowerCase();
        
        // Show/hide clear button based on input
        if (searchQuery.length > 0) {
            clearButton.style.display = 'flex';
        } else {
            clearButton.style.display = 'none';
        }
        
        filterCompanies();
    }, 300));
}

// Setup filter chips
function setupFilterChips() {
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filterText = this.textContent.trim();
            
            if (filterText === 'All') {
                // Clear all other filters
                activeFilters.clear();
                activeFilters.add('All');
                chips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            } else {
                // Toggle specific filter
                if (activeFilters.has(filterText)) {
                    activeFilters.delete(filterText);
                    this.classList.remove('active');
                } else {
                    activeFilters.add(filterText);
                    activeFilters.delete('All');
                    this.classList.add('active');
                }
                
                // Update "All" button state
                const allChip = document.querySelector('.chip:first-child');
                if (allChip) {
                    allChip.classList.remove('active');
                }
                
                // If no filters active, activate "All"
                if (activeFilters.size === 0) {
                    activeFilters.add('All');
                    allChip.classList.add('active');
                }
            }

            filterCompanies();
        });
    });
}

// Filter companies based on search and chips
function filterCompanies() {
    let filteredCompanies = [...companiesData];

    // Apply search filter
    if (searchQuery) {
        filteredCompanies = filteredCompanies.filter(company => {
            return company.name.toLowerCase().includes(searchQuery) ||
                   company.description.toLowerCase().includes(searchQuery) ||
                   company.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        });
    }
    
    // Apply chip filters
    if (!activeFilters.has('All')) {
        filteredCompanies = filteredCompanies.filter(company => {
            return Array.from(activeFilters).some(filter => {
                // Handle different filter types
                if (filter === 'Has Referral Program') {
                    return company.hasReferral;
                }
                // Check if company tags include the filter
                return company.tags.some(tag => 
                    tag.toLowerCase().includes(filter.toLowerCase()) ||
                    filter.toLowerCase().includes(tag.toLowerCase())
                );
            });
        });
    }

    // Update display
    displayCompanies(filteredCompanies);
    
    // Show message if no results
    if (filteredCompanies.length === 0) {
        showNoResultsMessage();
    }
}

// Display companies
function displayCompanies(companies) {
    const container = document.querySelector('.companies-directory');
    if (!container) return;
    
    container.innerHTML = '';
    
    companies.forEach(company => {
        const card = createCompanyCard(company);
        container.appendChild(card);
    });
    
    // Add animation
    const cards = container.querySelectorAll('.company-directory-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Create company card element
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-directory-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
    
    const dimensionsHTML = Object.entries(company.dimensions).map(([key, value]) => {
        const labels = {
            projectQuality: 'Project Quality',
            mentorship: 'Mentorship',
            workLifeBalance: 'Work-Life Balance',
            learningOpportunities: 'Learning Opportunities',
            careerGrowth: 'Career Growth'
        };
        
        return `
            <div class="dimension">
                <span class="dimension-label">${labels[key]}</span>
                <div class="dimension-bar">
                    <div class="dimension-fill" style="width: ${value * 20}%;"></div>
                </div>
                <span class="dimension-score">${value.toFixed(1)}</span>
            </div>
        `;
    }).join('');
    
    card.innerHTML = `
        <div class="company-header">
            <div class="company-logo-large">${company.logo}</div>
            <div class="company-info">
                <h3>${company.name}</h3>
                <div class="company-rating">
                    <span class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(company.rating))}</span>
                    <span>${company.rating}/5 (${company.reviewCount} reviews)</span>
                </div>
                <div class="company-tags">
                    ${company.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${company.hasReferral ? '<span class="tag referral">Referral Program</span>' : ''}
                </div>
            </div>
        </div>
        <p class="company-description">${company.description}</p>
        
        <div class="review-dimensions">
            ${dimensionsHTML}
        </div>
        
        <div class="company-actions">
            <button class="btn btn-primary" onclick="applyForCoop(${company.id})">Apply for Co-op</button>
            <button class="btn btn-secondary" onclick="viewCompanyDetails(${company.id})">View Details</button>
            <button class="btn btn-secondary" onclick="openReviewModal(${company.id})">Write Review</button>
            ${company.hasReferral ? `<button class="btn btn-referral" onclick="viewReferralProgram(${company.id})">Referral Info</button>` : ''}
        </div>
    `;
    
    return card;
}

// Show no results message
function showNoResultsMessage() {
    const container = document.querySelector('.companies-directory');
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-results">
            <h3>No companies found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
        </div>
    `;
}

// Clear all filters and show all companies
function showAllCompanies() {
    // Clear filters state
    activeFilters.clear();
    activeFilters.add('All');
    searchQuery = '';
    
    // Reset search input
    const searchInput = document.querySelector('.company-search');
    const clearButton = document.querySelector('.search-clear-btn');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    // Reset filter chips UI
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Activate "All" chip
    const allChip = document.querySelector('.chip:first-child');
    if (allChip) {
        allChip.classList.add('active');
    }
    
    // Display all companies
    displayCompanies(companiesData);
    
    // Navigate to companies page
    if (typeof showPage === 'function') {
        showPage('companies');
    }
}

// Clear all filters
function clearAllFilters() {
    activeFilters.clear();
    activeFilters.add('All');
    searchQuery = '';
    
    // Reset UI
    const searchInput = document.querySelector('.company-search');
    const clearButton = document.querySelector('.search-clear-btn');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector('.chip:first-child').classList.add('active');
    
    filterCompanies();
}

// Setup company cards interactions
function setupCompanyCards() {
    // Delegated event handling for dynamically created cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.company-directory-card');
        if (card && !e.target.closest('button')) {
            // Card click (not on buttons)
            const companyId = card.dataset.companyId;
            if (companyId) {
                viewCompanyDetails(companyId);
            }
        }
    });
}

// Load company directory
function loadCompanyDirectory() {
    // Ensure filter state is initialized
    if (activeFilters.size === 0) {
        activeFilters.add('All');
    }
    
    // Sync UI with filter state
    syncFilterChipsWithState();
    
    // In production, fetch from API
    // For now, display filtered data based on current state
    filterCompanies();
    
    // Load recommendations
    loadCompanyRecommendations();
}

// Sync filter chips UI with the current filter state
function syncFilterChipsWithState() {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        const filterText = chip.textContent.trim();
        if (activeFilters.has(filterText)) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });
}

// Load company recommendations
function loadCompanyRecommendations() {
    // In production, this would use AI/ML to recommend companies
    const recommendations = companiesData.filter(c => c.rating >= 4.5).slice(0, 3);
    
    const container = document.querySelector('.recommended-companies');
    if (!container) return;
    
    container.innerHTML = recommendations.map(company => `
        <div class="company-recommendation-card" onclick="viewCompanyDetails(${company.id})">
            <div class="match-percentage">${Math.floor(85 + Math.random() * 15)}% Match</div>
            <h4>${company.name}</h4>
            <div class="company-rating">
                <span class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.round(company.rating))}</span>
                <span>${company.rating} (${company.reviewCount} reviews)</span>
            </div>
            <p>Matches your interests in ${company.tags[0]}</p>
            <button class="btn btn-primary-small" onclick="event.stopPropagation(); viewCompanyDetails(${company.id})">Explore</button>
        </div>
    `).join('');
}

// Setup review system
function setupReviewSystem() {
    // Initialize star rating interactions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star-rating')) {
            handleStarRating(e.target);
        }
    });
}

// Handle star rating
function handleStarRating(element) {
    const rating = element.dataset.rating;
    const container = element.parentElement;
    
    // Update visual state
    container.querySelectorAll('.star-rating').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
    
    // Store rating
    container.dataset.selectedRating = rating;
}

// View company details
function viewCompanyDetails(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    if (!company) return;
    
    // In production, navigate to company detail page or open modal
    window.IMI.utils.showNotification(`Opening ${company.name} details...`, 'info');
}

// Apply for co-op
function applyForCoop(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    if (!company) return;
    
    // In production, open application form or redirect
    window.IMI.utils.showNotification(`Starting application for ${company.name}...`, 'success');
}

// Open review modal
function openReviewModal(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    if (!company) return;
    
    // Create review form content
    const content = `
        <h2>Review ${company.name}</h2>
        <form id="review-form">
            <div class="review-dimensions-form">
                ${Object.keys(company.dimensions).map(key => {
                    const labels = {
                        projectQuality: 'Project Quality',
                        mentorship: 'Mentorship',
                        workLifeBalance: 'Work-Life Balance',
                        learningOpportunities: 'Learning Opportunities',
                        careerGrowth: 'Career Growth'
                    };
                    
                    return `
                        <div class="form-group">
                            <label>${labels[key]}</label>
                            <div class="star-rating-container" data-dimension="${key}">
                                ${[1,2,3,4,5].map(i => `<span class="star-rating" data-rating="${i}"><i class="fa-solid fa-star"></i></span>`).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="form-group">
                <label>Your Experience</label>
                <textarea placeholder="Share your experience working with ${company.name}..." rows="4"></textarea>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox"> Submit as anonymous
                </label>
            </div>
            
            <div class="button-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit Review</button>
            </div>
        </form>
    `;
    
    window.openModal('custom');
    document.getElementById('modal-body').innerHTML = content;
    
    // Handle form submission
    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview(companyId);
    });
}

// Submit review
function submitReview(companyId) {
    // Collect review data
    const reviewData = {
        companyId,
        dimensions: {},
        experience: document.querySelector('#review-form textarea').value,
        anonymous: document.querySelector('#review-form input[type="checkbox"]').checked
    };
    
    // Collect dimension ratings
    document.querySelectorAll('.star-rating-container').forEach(container => {
        const dimension = container.dataset.dimension;
        const rating = container.dataset.selectedRating || 0;
        reviewData.dimensions[dimension] = parseInt(rating);
    });

    // In production, submit to API
    window.IMI.utils.showNotification('Review submitted successfully!', 'success');
    window.closeModal();
}

// View referral program
function viewReferralProgram(companyId) {
    const company = companiesData.find(c => c.id === companyId);
    if (!company) return;
    
    // In production, open referral details modal or page
    window.IMI.utils.showNotification(`Opening ${company.name} referral program: ${company.referralAmount}`, 'info');
}

// Export functions
window.initializeCompanies = initializeCompanies;
window.viewCompanyDetails = viewCompanyDetails;
window.applyForCoop = applyForCoop;
window.openReviewModal = openReviewModal;
window.viewReferralProgram = viewReferralProgram;
window.clearAllFilters = clearAllFilters;
window.showAllCompanies = showAllCompanies;
window.loadCompanyRecommendations = loadCompanyRecommendations;
window.loadCompanyDirectory = loadCompanyDirectory;
window.filterCompanies = filterCompanies;
window.syncFilterChipsWithState = syncFilterChipsWithState;
window.activeFilters = activeFilters;