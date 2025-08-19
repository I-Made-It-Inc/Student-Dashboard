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
            statusElement.textContent = '✓ Complete - 20 XP';
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
            totalXP += 20; // 20 XP per section in blueprint system
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
        xpDisplay.textContent = `XP Earned: ${totalXP}/100`;
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

// Submit blueprint for review
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
        // In production, send to AI grading API
        console.log('Submitting blueprint for review:', responses);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success - students get full XP when they pass
        window.IMI.utils.showNotification(
            `Blueprint submitted successfully! You earned ${progress.totalXP} XP.`,
            'success'
        );
        
        // Update streak
        updateStreak();
        
        // Update tier progress
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

// Clear submission form
function clearSubmissionForm() {
    document.querySelectorAll('.submission-textarea').forEach(textarea => {
        textarea.value = '';
        updateWordCount(textarea);
        updateSectionStatus(textarea);
    });
}

// Setup auto-save for drafts
function setupAutoSaveDrafts() {
    let autoSaveTimer;
    
    document.querySelectorAll('.submission-textarea').forEach(textarea => {
        textarea.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            
            // Show saving indicator
            const statusElement = textarea.closest('.submission-section')?.querySelector('.section-status');
            if (statusElement && textarea.value.length > 0) {
                statusElement.textContent = '⏱ Saving...';
            }
            
            // Auto-save after 2 seconds of inactivity
            autoSaveTimer = setTimeout(() => {
                saveDraft();
            }, 2000);
        });
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
    // Initialize chart without toggle buttons
    updateXPChart();
}

// Update XP Chart with simple HTML/CSS approach
function updateXPChart() {
    const chartContainer = document.querySelector('.xp-chart-container');
    if (!chartContainer) return;
    
    // Data with LIFETIME XP progression
    const chartData = {
        months: ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025'],
        points: [2650, 2850, 3170, 3530, 3890, 4010, 4090, 4120] // Lifetime XP progression
    };
    
    const maxValue = 5500; // Ensure adequate space above platinum tier
    
    // Tier definitions
    const tiers = [
        { name: 'Silver', value: 1000, color: '#6B7280', emoji: '🥈' },
        { name: 'Gold', value: 2500, color: '#D97706', emoji: '🏆' },
        { name: 'Platinum', value: 5000, color: '#1F2937', emoji: '💎' }
    ];
    
    let chartHTML = `
        <div class="simple-chart">
            <div class="chart-grid">
                <!-- Y-axis labels -->
                <div class="y-axis-simple">
                    ${[5000, 4000, 3000, 2500, 2000, 1000, 0].map(val => 
                        `<div class="y-tick" style="bottom: ${(val / maxValue) * 100}%">${val}</div>`
                    ).join('')}
                </div>
                
                <!-- Plot area -->
                <div class="plot-simple">
                    <!-- Tier threshold lines -->
                    ${tiers.map(tier => `
                        <div class="tier-line-simple" style="bottom: ${(tier.value / maxValue) * 100}%; border-color: ${tier.color};">
                            <span class="tier-label-simple" style="color: ${tier.color};">${tier.emoji} ${tier.name}</span>
                        </div>
                    `).join('')}
                    
                    <!-- Data points and line -->
                    <div class="data-line-container">
                        ${chartData.points.map((point, i) => {
                            // Adjust x position to account for padding/margins and center on labels
                            // Labels have flex: 1, so they are centered in equal segments
                            // First label is centered at 1/(2*n) of the width, last at (2n-1)/(2*n)
                            const segmentWidth = 100 / chartData.points.length;
                            const x = segmentWidth * (i + 0.5);
                            const y = (point / maxValue) * 100;
                            return `<div class="data-point" style="left: ${x}%; bottom: ${y}%;"></div>`;
                        }).join('')}
                        
                        <!-- Connecting line using CSS -->
                        <svg class="connecting-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polyline fill="none" stroke="var(--imi-blue)" stroke-width="1" 
                                     points="${chartData.points.map((point, i) => {
                                         // Match the x positioning with data points
                                         const segmentWidth = 100 / chartData.points.length;
                                         const x = segmentWidth * (i + 0.5);
                                         const y = 100 - (point / maxValue) * 100;
                                         return `${x},${y}`;
                                     }).join(' ')}"/>
                        </svg>
                    </div>
                </div>
            </div>
            
            <!-- X-axis -->
            <div class="x-axis-simple">
                ${chartData.months.map(month => `<div class="x-tick">${month}</div>`).join('')}
            </div>
        </div>
    `;
    
    chartContainer.innerHTML = chartHTML;
}

// Setup redemption handlers
function setupRedemptionHandlers() {
    const redeemButtons = document.querySelectorAll('.btn-redeem');
    
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const itemContainer = this.closest('.redemption-item-compact');
            if (!itemContainer) return;
            
            const itemName = itemContainer.querySelector('.item-name').textContent;
            const costText = itemContainer.querySelector('.item-cost').textContent;
            
            if (confirm(`Redeem ${itemName} for ${costText}?`)) {
                if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                    window.IMI.utils.showNotification(`Successfully redeemed ${itemName}!`, 'success');
                }
                
                // Parse cost properly
                const costMatch = costText.match(/(\d+)/);
                if (costMatch) {
                    const costXP = parseInt(costMatch[1]);
                    
                    // Update available XP
                    const balanceElement = document.querySelector('.balance-amount');
                    if (balanceElement) {
                        const currentXP = parseInt(balanceElement.textContent.replace(/,/g, ''));
                        const newBalance = currentXP - costXP;
                        const formattedBalance = newBalance.toLocaleString();
                        balanceElement.textContent = formattedBalance;
                        
                        // Also update the dashboard XP display
                        const dashboardXPElements = document.querySelectorAll('.stat-main');
                        dashboardXPElements.forEach(el => {
                            if (el.textContent.includes('pts')) {
                                el.textContent = `${formattedBalance} pts`;
                            }
                        });
                        
                        // Update the sidebar XP display too
                        const sidebarXPElement = document.querySelector('.text-muted.small');
                        if (sidebarXPElement && sidebarXPElement.textContent.includes('XP available')) {
                            sidebarXPElement.textContent = `${formattedBalance} XP available`;
                        }
                    }
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeBlueprintPage();
        updateAllSectionStatuses();
        setupXPChart();
        setupAutoSaveDrafts();
        
        // Add event listeners for buttons
        const saveDraftBtn = document.getElementById('save-draft-btn');
        const submitBtn = document.getElementById('submit-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (saveDraftBtn) saveDraftBtn.addEventListener('click', saveDraft);
        if (submitBtn) submitBtn.addEventListener('click', submitBlueprint);
        if (resetBtn) resetBtn.addEventListener('click', resetAllSections);
        
        console.log('Blueprint page initialized successfully');
    } catch (error) {
        console.error('Error initializing blueprint page:', error);
    }
});