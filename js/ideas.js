// js/ideas.js - Ideas & Innovation Hub JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Ideas functionality
    initializeIdeasPage();
});

function initializeIdeasPage() {
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
    showNotification('🎉 Your idea has been submitted successfully!', 'success');
    
    // Reset form
    event.target.reset();
    toggleSkillsSection(); // Hide skills section if it was shown
    
    // In a real app, this would send data to the server
    // For demo purposes, we'll just simulate success
    setTimeout(() => {
        showNotification('💡 Your idea is now live in the community feed!', 'info');
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
    
    showNotification('💾 Draft saved successfully!', 'success');
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
    
    // Update active filter button
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('filter-active');
    });
    clickedButton.classList.add('filter-active');
    
    // Filter idea cards
    filterIdeas(filter);
}

function filterIdeas(filter) {
    const ideaCards = document.querySelectorAll('.idea-card');
    
    ideaCards.forEach(card => {
        let shouldShow = true;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'seeking-funding':
                shouldShow = card.getAttribute('data-seeking-funding') === 'true';
                break;
            case 'recruiting':
                shouldShow = card.getAttribute('data-recruiting') === 'true';
                break;
            case 'my-industry':
                // For demo, show technology and healthcare (student's interests)
                const industry = card.getAttribute('data-industry');
                shouldShow = industry === 'technology' || industry === 'healthcare';
                break;
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
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    // Show investment modal (simplified for demo)
    const investmentAmount = prompt(`How many XP would you like to invest in "${ideaTitle}"?\n\nCurrent available XP: 1,850`, '100');
    
    if (investmentAmount && !isNaN(investmentAmount) && parseInt(investmentAmount) > 0) {
        const amount = parseInt(investmentAmount);
        if (amount <= 1850) { // Check available XP
            showNotification(`🎉 Successfully invested ${amount} XP in "${ideaTitle}"!`, 'success');
            
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
            showNotification('❌ Insufficient XP for this investment amount.', 'error');
        }
    }
}

function handleJoinTeam(event) {
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    showNotification(`🤝 Join request sent for "${ideaTitle}"! The team lead will review your application.`, 'success');
    
    // Change button text to indicate request sent
    event.target.textContent = '⏳ Request Sent';
    event.target.disabled = true;
    event.target.classList.add('btn-secondary-small');
    event.target.classList.remove('btn-primary-small');
}

function handleOpenTeams(event) {
    const ideaCard = event.target.closest('.idea-card');
    const ideaTitle = ideaCard.querySelector('h4').textContent;
    
    // Simulate opening MS Teams
    showNotification(`💬 Opening MS Teams collaboration space for "${ideaTitle}"...`, 'info');
    
    // In a real app, this would open MS Teams or redirect to the collaboration space
    setTimeout(() => {
        // Simulate external link
        console.log(`Would open: https://teams.microsoft.com/l/team/idea-${ideaTitle.replace(/\s+/g, '-').toLowerCase()}`);
    }, 1000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 10000;
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    animation: slideIn 0.3s ease;
}

.notification-success {
    background-color: #4caf50;
    color: white;
    border-left: 4px solid #2e7d32;
}

.notification-error {
    background-color: #f44336;
    color: white;
    border-left: 4px solid #c62828;
}

.notification-info {
    background-color: #2196f3;
    color: white;
    border-left: 4px solid #1565c0;
}

.notification-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', notificationStyles);

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
            
            showNotification('📝 Draft loaded from previous session.', 'info');
        }
    }
}

// Load draft when page loads
document.addEventListener('DOMContentLoaded', loadDraft);
