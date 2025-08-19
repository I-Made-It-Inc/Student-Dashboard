// js/innovation.js - Blueprint for the Future Functionality

// Initialize Blueprint Challenge
function initializeBlueprintChallenge() {
    console.log('Initializing Blueprint Challenge...');
    
    // Set up word counters
    setupWordCounters();
    
    // Set up submission handlers
    setupSubmissionHandlers();
    
    // Load current challenge data
    loadCurrentChallenge();
    
    // Set up auto-save for drafts
    setupAutoSaveDrafts();
    
    // Set up XP chart
    setupXPChart();
    
    // Set up redemption handlers
    setupRedemptionHandlers();
}

// Setup word counters for each section
function setupWordCounters() {
    const textareas = document.querySelectorAll('.submission-textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            updateWordCount(this);
            updateSectionStatus(this);
        });
        
        // Initialize word count
        updateWordCount(textarea);
    });
}

// Update word count display
function updateWordCount(textarea) {
    const words = textarea.value.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const maxWords = 100;
    
    const countElement = textarea.closest('.submission-section')?.querySelector('.word-count');
    if (countElement) {
        countElement.textContent = `${wordCount}/${maxWords} words`;
        
        // Change color based on progress
        if (wordCount >= maxWords) {
            countElement.style.color = 'var(--success-green)';
        } else if (wordCount >= maxWords * 0.8) {
            countElement.style.color = 'var(--warning-orange)';
        } else {
            countElement.style.color = 'var(--text-gray)';
        }
    }
    
    return wordCount;
}

// Update section completion status
function updateSectionStatus(textarea) {
    const wordCount = updateWordCount(textarea);
    const statusElement = textarea.closest('.submission-section')?.querySelector('.section-status');
    
    if (statusElement) {
        if (wordCount >= 100) {
            statusElement.textContent = '✓ Complete - 100 XP';
            statusElement.className = 'section-status completed';
        } else if (wordCount > 0) {
            statusElement.textContent = '⏱ In progress';
            statusElement.className = 'section-status in-progress';
        } else {
            statusElement.textContent = 'Not started';
            statusElement.className = 'section-status';
        }
    }
    
    // Update overall progress
    updateOverallProgress();
}

// Update overall challenge progress
function updateOverallProgress() {
    const sections = document.querySelectorAll('.submission-section');
    let completedSections = 0;
    let totalXP = 0;
    
    sections.forEach(section => {
        const textarea = section.querySelector('.submission-textarea');
        const wordCount = updateWordCount(textarea);
        
        if (wordCount >= 100) {
            completedSections++;
            totalXP += 100; // 100 XP per section in blueprint system
        }
    });
    
    // Update progress display in dashboard
    const progressSections = document.querySelectorAll('.progress-section');
    progressSections.forEach((section, index) => {
        if (index < completedSections) {
            section.classList.add('completed');
            section.querySelector('span:first-child').textContent = '✓';
        } else {
            section.classList.remove('completed');
            section.querySelector('span:first-child').textContent = '○';
        }
    });
    
    // Update XP display
    const xpDisplay = document.querySelector('.points-earned-right');
    if (xpDisplay) {
        xpDisplay.textContent = `XP Earned: ${totalXP}/500`;
    }
    
    const dashboardXpDisplay = document.querySelector('.points-earned');
    if (dashboardXpDisplay) {
        dashboardXpDisplay.textContent = `${totalXP} XP earned`;
    }
    
    return { completedSections, totalXP };
}

// Setup submission handlers
function setupSubmissionHandlers() {
    const submitButton = document.querySelector('.btn-submit-challenge');
    if (submitButton) {
        submitButton.addEventListener('click', submitBlueprint);
    }
    
    const saveDraftButton = document.querySelector('.btn-save-draft');
    if (saveDraftButton) {
        saveDraftButton.addEventListener('click', saveDraft);
    }
}

// Submit blueprint
async function submitBlueprint(e) {
    e.preventDefault();
    
    const progress = updateOverallProgress();
    
    if (progress.completedSections === 0) {
        window.IMI.utils.showNotification('Please complete at least one section before submitting.', 'warning');
        return;
    }
    
    // Collect all responses
    const responses = collectResponses();
    
    // Show loading state
    const submitButton = e.target;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        // In production, submit blueprint
        console.log('Submitting blueprint:', responses);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success - students get full XP for passing
        window.IMI.utils.showNotification(
            `Blueprint submitted successfully! You earned ${progress.totalXP} XP.`,
            'success'
        );
        
        // Update streak and tier
        updateStreak();
        updateTierProgress(progress.totalXP);
        
        // Clear form
        clearSubmissionForm();
        
    } catch (error) {
        console.error('Submission error:', error);
        window.IMI.utils.showNotification('Error submitting blueprint. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Blueprint';
    }
}

// Save draft
function saveDraft() {
    const responses = collectResponses();
    
    // Save to localStorage (in production, save to backend)
    localStorage.setItem('innovation_draft', JSON.stringify({
        responses,
        timestamp: Date.now()
    }));
    
    window.IMI.utils.showNotification('Draft saved successfully!', 'success');
    
    // Update all section statuses to saved
    document.querySelectorAll('.section-status').forEach(status => {
        if (status.textContent !== 'Not started') {
            status.innerHTML = '✓ Saved';
        }
    });
}

// Collect all responses
function collectResponses() {
    const responses = {};
    const sections = [
        'trendspotter',
        'future-visionary',
        'innovation-catalyst',
        'connector',
        'growth-hacker'
    ];
    
    sections.forEach(section => {
        const textarea = document.querySelector(`#${section}-textarea`);
        if (textarea) {
            responses[section] = {
                content: textarea.value,
                wordCount: updateWordCount(textarea)
            };
        }
    });
    
    return responses;
}

// Save draft
function saveDraft() {
    const responses = collectResponses();
    
    // Save to localStorage (in production, save to backend)
    localStorage.setItem('blueprint_draft', JSON.stringify({
        responses,
        timestamp: Date.now()
    }));
    
    window.IMI.utils.showNotification('Draft saved successfully!', 'success');
    
    // Update all section statuses to saved
    document.querySelectorAll('.section-status').forEach(status => {
        if (status.textContent !== 'Not started') {
            status.innerHTML = '✓ Saved';
        }
    });
}

// Update tier progress
function updateTierProgress(earnedXP) {
    // Tier thresholds based on Blueprint system
    const tiers = {
        bronze: { min: 0, max: 999, name: 'Bronze', icon: '🥉' },
        silver: { min: 1000, max: 2499, name: 'Silver', icon: '🥈' },
        gold: { min: 2500, max: 4999, name: 'Gold', icon: '🥇' },
        platinum: { min: 5000, max: Infinity, name: 'Platinum', icon: '💎' }
    };
    
    // In a real app, this would be calculated from total lifetime XP
    const totalXP = 1850 + earnedXP;
    
    let currentTier = 'bronze';
    for (const [tierName, tierData] of Object.entries(tiers)) {
        if (totalXP >= tierData.min && totalXP < tierData.max) {
            currentTier = tierName;
            break;
        }
    }
    
    // Update tier displays
    const tierElements = document.querySelectorAll('.challenge-stat-value, .stat-main');
    tierElements.forEach(el => {
        if (el.textContent.includes('#') || el.textContent.includes('Gold')) {
            el.textContent = tiers[currentTier].name;
        }
    });
    
    console.log(`Updated to ${tiers[currentTier].name} tier with ${totalXP} total XP`);
}

// Setup XP Chart
function setupXPChart() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active tab
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart view
            const view = this.dataset.view;
            updateXPChart(view);
        });
    });
    
    // Initialize chart
    updateXPChart('total');
}

// Update XP Chart
function updateXPChart(view) {
    const chartContainer = document.querySelector('.xp-chart-container');
    if (!chartContainer) return;
    
    // Mock data for XP progress over time
    const mockData = {
        total: [100, 300, 500, 750, 1200, 1850],
        unredeemed: [100, 250, 400, 500, 600, 1850],
        labels: ['Week 1', 'Week 3', 'Week 5', 'Week 7', 'Week 9', 'Now']
    };
    
    // Simple text-based chart for demo
    let chartHTML = '<div class="simple-chart">';
    
    if (view === 'both') {
        chartHTML += '<div class="chart-legend">';
        chartHTML += '<span class="legend-item"><span class="legend-color total"></span>Total XP</span>';
        chartHTML += '<span class="legend-item"><span class="legend-color unredeemed"></span>Unredeemed XP</span>';
        chartHTML += '</div>';
    }
    
    chartHTML += '<div class="chart-bars">';
    
    mockData.labels.forEach((label, index) => {
        const totalValue = mockData.total[index];
        const unredeemedValue = mockData.unredeemed[index];
        const maxValue = Math.max(...mockData.total);
        
        let barHTML = '<div class="chart-bar-group">';
        barHTML += `<div class="chart-label">${label}</div>`;
        
        if (view === 'total' || view === 'both') {
            const height = (totalValue / maxValue) * 100;
            barHTML += `<div class="chart-bar total" style="height: ${height}%" title="Total: ${totalValue} XP"></div>`;
        }
        
        if (view === 'unredeemed' || view === 'both') {
            const height = (unredeemedValue / maxValue) * 100;
            barHTML += `<div class="chart-bar unredeemed" style="height: ${height}%" title="Unredeemed: ${unredeemedValue} XP"></div>`;
        }
        
        barHTML += `<div class="chart-value">${view === 'total' ? totalValue : unredeemedValue} XP</div>`;
        barHTML += '</div>';
        
        chartHTML += barHTML;
    });
    
    chartHTML += '</div></div>';
    
    chartContainer.innerHTML = chartHTML;
}

// Setup redemption handlers
function setupRedemptionHandlers() {
    const redeemButtons = document.querySelectorAll('.btn-redeem');
    
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const itemName = this.closest('.redemption-item-compact').querySelector('.item-name').textContent;
            const cost = this.closest('.redemption-item-compact').querySelector('.item-cost').textContent;
            
            if (confirm(`Redeem ${itemName} for ${cost}?`)) {
                window.IMI.utils.showNotification(`Successfully redeemed ${itemName}!`, 'success');
                
                // Update available XP (in production, this would be handled by backend)
                const balanceElement = document.querySelector('.balance-amount');
                if (balanceElement) {
                    const currentXP = parseInt(balanceElement.textContent);
                    const costXP = parseInt(cost);
                    balanceElement.textContent = (currentXP - costXP).toString();
                }
                
                // Disable the button
                this.disabled = true;
                this.textContent = 'Redeemed';
            }
        });
    });
}

// Load saved draft
function loadDraft() {
    const saved = localStorage.getItem('blueprint_draft');
    if (saved) {
        const draft = JSON.parse(saved);
        
        // Check if draft is not too old (7 days)
        const age = Date.now() - draft.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
            // Restore responses
            Object.entries(draft.responses).forEach(([section, data]) => {
                const textarea = document.querySelector(`#${section}-textarea`);
                if (textarea && data.content) {
                    textarea.value = data.content;
                    updateWordCount(textarea);
                    updateSectionStatus(textarea);
                }
            });
            
            window.IMI.utils.showNotification('Draft restored from previous session', 'info');
        }
    }
}

// Load current challenge
function loadCurrentChallenge() {
    // In production, fetch from API
    const challengeData = {
        topic: 'The Future of Sustainable Cities',
        description: 'Explore how technology and innovation can create more sustainable urban environments through the lens of your personal Blueprint for the Future.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        weeklySubmission: true,
        multipleSubmissionsAllowed: false, // Changed for blueprint system
        fullXPOnPass: true, // Students get full XP when they pass
        sections: [
            {
                id: 'trendspotter',
                title: '� The Trendspotter',
                prompt: 'Identify the core trend or shift revealed in the article you read. What underlying forces are driving this change?'
            },
            {
                id: 'future-visionary',
                title: '� The Future Visionary',
                prompt: 'Describe a plausible, exciting vision for the future in 5-10 years based on this trend. Paint a picture of what could be possible.'
            },
            {
                id: 'innovation-catalyst',
                title: '� The Innovation Catalyst',
                prompt: 'Propose how this trend could be applied in a completely different field to create something new. Think outside the box!'
            },
            {
                id: 'connector',
                title: '🔗 The Connector',
                prompt: 'Identify which industries, skill sets, or communities would need to collaborate to make this vision a reality.'
            },
            {
                id: 'growth-hacker',
                title: '📈 The Growth Hacker',
                prompt: 'Reflect on how this new knowledge changes your personal career path and future vision. What one small action can you take now?'
            }
        ]
    };
    
    // Update UI with challenge data
    updateChallengeUI(challengeData);
    
    // Load saved draft if exists
    loadDraft();
}

// Update challenge UI
function updateChallengeUI(data) {
    // Update topic elements
    const topicElements = document.querySelectorAll('.challenge-topic, h4');
    topicElements.forEach(el => {
        if (el.textContent && el.textContent.includes('Future of Sustainable Cities')) {
            el.textContent = data.topic;
        }
    });
    
    // Update deadline
    const deadlineElements = document.querySelectorAll('.challenge-deadline, .deadline');
    deadlineElements.forEach(el => {
        const daysLeft = Math.ceil((data.deadline - Date.now()) / (24 * 60 * 60 * 1000));
        el.textContent = `Due: Sunday 11:59 PM (${daysLeft} days)`;
    });
    
    // Update section prompts
    data.sections.forEach(section => {
        const textarea = document.querySelector(`#${section.id}-textarea`);
        if (textarea) {
            textarea.placeholder = section.prompt;
        }
    });
}

// Update streak
function updateStreak() {
    const streakElements = document.querySelectorAll('.challenge-stat-value, .stat-main');
    streakElements.forEach(el => {
        if (el.textContent && el.textContent.includes('week')) {
            const currentStreak = parseInt(el.textContent) || 0;
            el.textContent = `${currentStreak + 1} weeks`;
            
            // Animate streak update
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 1000);
        }
    });
}

// Show points marketplace (placeholder function)
function showPointsMarketplace() {
    window.IMI.utils.showNotification('Points Marketplace coming soon!', 'info');
}

// Export functions
window.initializeBlueprintChallenge = initializeBlueprintChallenge;
window.initializeInnovationChallenge = initializeBlueprintChallenge; // Backward compatibility
window.loadCurrentChallenge = loadCurrentChallenge;
window.showPointsMarketplace = showPointsMarketplace;