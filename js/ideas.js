// js/ideas.js - Ideas & Innovation Hub JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Ideas functionality
    initializeIdeasPage();
});

// Store like states in localStorage for persistence
const LIKES_STORAGE_KEY = 'studentDashboardLikes';

function getLikeData() {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveLikeData(data) {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(data));
}

function initializeIdeasPage() {
    // Initialize like states from localStorage
    initializeLikeStates();
    
    // Handle idea submission form
    const ideaForm = document.getElementById('idea-submission-form');
    if (ideaForm) {
        ideaForm.addEventListener('submit', handleIdeaSubmission);
    }

    // Handle collaboration checkboxes
    const lookingForTeamCheckbox = document.querySelector('input[name="lookingForTeam"]');
    if (lookingForTeamCheckbox) {
        lookingForTeamCheckbox.addEventListener('change', toggleSkillsSection);
    }

    // Handle filter buttons
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });

    // Handle idea action buttons
    initializeIdeaActions();
}

function initializeLikeStates() {
    const likeData = getLikeData();
    const likeButtons = document.querySelectorAll('.btn-like');
    
    likeButtons.forEach(button => {
        const ideaId = button.getAttribute('data-idea-id');
        if (likeData[ideaId] && likeData[ideaId].liked) {
            // Set liked state
            const likeIcon = button.querySelector('.like-icon');
            likeIcon.textContent = '❤️';
            button.classList.add('liked');
        }
    });
}

function toggleLike(button) {
    const ideaId = button.getAttribute('data-idea-id');
    const likeIcon = button.querySelector('.like-icon');
    const likeCountElement = document.getElementById(`like-count-${ideaId}`);
    const likeData = getLikeData();
    
    // Get current like count
    const currentText = likeCountElement.textContent;
    const currentCount = parseInt(currentText.match(/\d+/)[0]);
    
    if (button.classList.contains('liked')) {
        // Unlike
        likeIcon.textContent = '🤍';
        button.classList.remove('liked');
        likeCountElement.textContent = `${currentCount - 1} likes`;
        
        // Update stored data
        delete likeData[ideaId];
        
        // Show notification
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('💔 Removed like', 'info');
        }
    } else {
        // Like
        likeIcon.textContent = '❤️';
        button.classList.add('liked');
        likeCountElement.textContent = `${currentCount + 1} likes`;
        
        // Update stored data
        likeData[ideaId] = { liked: true, timestamp: Date.now() };
        
        // Show notification
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('❤️ Liked!', 'success');
        }
    }
    
    // Save to localStorage
    saveLikeData(likeData);
}

function handleIdeaSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ideaData = {
        title: formData.get('ideaTitle'),
        industry: formData.get('industry'),
        stage: formData.get('stage'),
        description: formData.get('description'),
        inspiration: formData.get('inspiration'),
        openToCollaboration: formData.get('openToCollaboration'),
        seekingFunding: formData.get('seekingFunding'),
        lookingForTeam: formData.get('lookingForTeam'),
        skills: formData.getAll('skills')
    };

    console.log('Idea submitted:', ideaData);
    
    // Show success message
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('🎉 Your idea has been submitted successfully!', 'success');
    }
    
    // Reset form
    event.target.reset();
    toggleSkillsSection(); // Hide skills section if it was shown
    
    // In a real app, this would send data to the server
    // For demo purposes, we'll just simulate success
    setTimeout(() => {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('💡 Your idea is now live in the community feed!', 'info');
        }
    }, 2000);
}

function saveDraft() {
    const form = document.getElementById('idea-submission-form');
    const formData = new FormData(form);
    
    // In a real app, this would save to localStorage or server
    localStorage.setItem('ideaDraft', JSON.stringify({
        title: formData.get('ideaTitle'),
        industry: formData.get('industry'),
        stage: formData.get('stage'),
        description: formData.get('description'),
        inspiration: formData.get('inspiration'),
        timestamp: Date.now()
    }));
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('💾 Draft saved successfully!', 'success');
    }
}

function toggleSkillsSection() {
    const lookingForTeamCheckbox = document.querySelector('input[name="lookingForTeam"]');
    const skillsSection = document.querySelector('.skills-needed');
    
    if (lookingForTeamCheckbox && skillsSection) {
        if (lookingForTeamCheckbox.checked) {
            skillsSection.style.display = 'block';
        } else {
            skillsSection.style.display = 'none';
            // Uncheck all skill checkboxes
            const skillCheckboxes = skillsSection.querySelectorAll('input[type="checkbox"]');
            skillCheckboxes.forEach(cb => cb.checked = false);
        }
    }
}

function handleFilterChange(event) {
    const clickedButton = event.target;
    const filter = clickedButton.getAttribute('data-filter');
    const isAllIdeas = filter === 'all';
    
    if (isAllIdeas) {
        // If "All Ideas" is clicked, clear all other filters
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            if (btn !== clickedButton) {
                btn.classList.remove('active');
            }
        });
        
        // Toggle All Ideas
        clickedButton.classList.toggle('active');
    } else {
        // If a fine-grained filter is clicked, remove "All Ideas" active state
        document.querySelectorAll('.filter-buttons button').forEach(btn => {
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.remove('active');
            }
        });
        
        // Toggle this filter
        clickedButton.classList.toggle('active');
    }
    
    // Filter idea cards
    filterIdeas();
}

function filterIdeas() {
    const activeButtons = document.querySelectorAll('.filter-buttons button.active');
    const activeFilters = Array.from(activeButtons).map(btn => btn.getAttribute('data-filter'));
    const ideaCards = document.querySelectorAll('.idea-card');
    
    ideaCards.forEach(card => {
        let shouldShow = false;
        
        // If no filters are active or "all" is active, show all cards
        if (activeFilters.length === 0 || activeFilters.includes('all')) {
            shouldShow = true;
        } else {
            // OR logic: show if card matches ANY of the active filters
            for (const filter of activeFilters) {
                switch(filter) {
                    case 'seeking-funding':
                        if (card.getAttribute('data-seeking-funding') === 'true') {
                            shouldShow = true;
                        }
                        break;
                    case 'recruiting':
                        if (card.getAttribute('data-recruiting') === 'true') {
                            shouldShow = true;
                        }
                        break;
                    case 'my-industry':
                        // For demo, show technology and healthcare (student's interests)
                        const industry = card.getAttribute('data-industry');
                        if (industry === 'technology' || industry === 'healthcare') {
                            shouldShow = true;
                        }
                        break;
                }
                // If we found a match, no need to check other filters
                if (shouldShow) break;
            }
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeIdeaActions() {
    // Handle XP investment buttons
    const investButtons = document.querySelectorAll('.idea-actions .btn-primary-small');
    investButtons.forEach(button => {
        if (button.textContent.includes('💰 Invest XP')) {
            button.addEventListener('click', handleXPInvestment);
        }
        if (button.textContent.includes('🤝 Join Team')) {
            button.addEventListener('click', handleJoinTeam);
        }
        if (button.textContent.includes('💬 Open in Teams')) {
            button.addEventListener('click', handleOpenTeams);
        }
    });
}

function handleXPInvestment(event) {
    // Check if button is disabled
    if (event.target.disabled || event.target.classList.contains('disabled')) {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('❌ This idea is not currently seeking XP investment.', 'error');
        }
        return;
    }
    
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    // Show investment modal (simplified for demo)
    const investmentAmount = prompt(`How many XP would you like to invest in "${ideaTitle}"?\n\nCurrent available XP: 1,850`, '100');
    
    if (investmentAmount && !isNaN(investmentAmount) && parseInt(investmentAmount) > 0) {
        const amount = parseInt(investmentAmount);
        if (amount <= 1850) { // Check available XP
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification(`🎉 Successfully invested ${amount} XP in "${ideaTitle}"!`, 'success');
            }
            
            // Update progress bar if it exists
            const progressBar = ideaCard.querySelector('.progress-fill');
            if (progressBar) {
                // Simulate progress update
                const currentWidth = parseInt(progressBar.style.width) || 48;
                const newWidth = Math.min(currentWidth + (amount / 50), 100); // Simple calculation
                progressBar.style.width = newWidth + '%';
                
                // Update progress text
                const progressInfo = ideaCard.querySelector('.progress-info span');
                if (progressInfo) {
                    const currentAmount = 1200 + amount;
                    progressInfo.textContent = `Crowdfunding Progress: ${currentAmount} / 2,500 XP (${Math.round(newWidth)}%)`;
                }
            }
        } else {
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification('❌ Insufficient XP for this investment amount.', 'error');
            }
        }
    }
}

function handleJoinTeam(event) {
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`🤝 Join request sent for "${ideaTitle}"! The team lead will review your application.`, 'success');
    }
    
    // Change button text and style to indicate request sent
    event.target.textContent = '⏳ Request Sent';
    event.target.disabled = true;
    event.target.classList.remove('btn-idea-primary');
    event.target.classList.remove('btn-idea-secondary');
    event.target.classList.add('btn-idea-disabled');
}

function handleOpenTeams(event) {
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    // Simulate opening MS Teams
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`💬 Opening MS Teams collaboration space for "${ideaTitle}"...`, 'info');
    }
    
    // In a real app, this would open MS Teams or redirect to the collaboration space
    setTimeout(() => {
        // Simulate external link
        console.log(`Would open: https://teams.microsoft.com/l/team/idea-${ideaTitle.replace(/\s+/g, '-').toLowerCase()}`);
    }, 1000);
}


// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('ideaDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        const form = document.getElementById('idea-submission-form');
        if (form) {
            form.ideaTitle.value = draftData.title || '';
            form.industry.value = draftData.industry || '';
            form.stage.value = draftData.stage || '';
            form.description.value = draftData.description || '';
            form.inspiration.value = draftData.inspiration || '';
            
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification('📝 Draft loaded from previous session.', 'info');
            }
        }
    }
}

// Load draft when page loads
document.addEventListener('DOMContentLoaded', loadDraft);
