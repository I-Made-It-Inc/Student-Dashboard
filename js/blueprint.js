// js/blueprint.js - Blueprint for the Future Functionality

// Initialize Blueprint Challenge
function initializeBlueprintChallenge() {
    console.log('Initializing Blueprint Challenge...');

    // Reset draft loading flag for this initialization
    blueprintDraftLoadedThisInitialization = false;

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

    // Load past blueprints
    renderPastBlueprints();
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

    // Validate article information first
    const articleTitle = document.getElementById('article-title')?.value.trim();
    const articleSource = document.getElementById('article-source')?.value.trim();
    const articleUrl = document.getElementById('article-url')?.value.trim();

    if (!articleTitle || !articleSource || !articleUrl) {
        window.IMI.utils.showNotification('Please fill in all article information fields (Title, Source, and URL).', 'warning');
        // Scroll to article info section
        document.querySelector('.article-info-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

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
        // Check if user is authenticated
        const userData = window.IMI?.data?.userData;
        const authMode = sessionStorage.getItem('imi_auth_mode');

        if (!userData || !userData.email) {
            throw new Error('User not authenticated');
        }

        // Calculate total word count
        const totalWordCount = Object.values(responses).reduce((sum, r) => sum + r.wordCount, 0);

        // Calculate XP: 20 XP per section with ≥100 words (max 100 XP for basic submission)
        const xpEarned = progress.totalXP; // Already calculated in updateOverallProgress()

        // Prepare blueprint data for database
        const blueprintData = {
            azureAdUserId: userData.id || null, // Azure AD Object ID (immutable)
            studentEmail: userData.email,
            contactId: userData.contactId || null,
            articleTitle: articleTitle,
            articleSource: articleSource,
            articleUrl: articleUrl,
            trendspotter: responses['trendspotter']?.content || null,
            futureVisionary: responses['future-visionary']?.content || null,
            innovationCatalyst: responses['innovation-catalyst']?.content || null,
            connector: responses['connector']?.content || null,
            growthHacker: responses['growth-hacker']?.content || null,
            xpEarned: xpEarned, // 20 XP per completed section (≥100 words)
            wordCount: totalWordCount,
            status: 'submitted'
        };

        // Only submit to database if in Microsoft mode and API is available
        if (authMode === 'microsoft' && window.IMI?.api?.submitBlueprint) {
            const result = await window.IMI.api.submitBlueprint(blueprintData);
            console.log('✅ Blueprint submitted:', totalWordCount, 'words,', xpEarned, 'XP');

            // Update userData with new XP values from response
            if (result.data.currentXP !== null && result.data.lifetimeXP !== null) {
                window.IMI.data.userData.currentXP = result.data.currentXP;
                window.IMI.data.userData.lifetimeXP = result.data.lifetimeXP;
                console.log('✅ XP updated:', result.data.currentXP, 'current,', result.data.lifetimeXP, 'lifetime');

                // Show success with XP update
                window.IMI.utils.showNotification(
                    `Blueprint submitted! +${xpEarned} XP earned. Total: ${result.data.currentXP.toLocaleString()} XP`,
                    'success'
                );
            } else {
                // Show success without XP update (e.g., draft saved)
                window.IMI.utils.showNotification(
                    result.message || 'Blueprint saved!',
                    result.data.status === 'draft' ? 'warning' : 'success'
                );
            }

            // Refresh past blueprints list
            if (typeof renderPastBlueprints === 'function') {
                renderPastBlueprints();
            }

            // Update dashboard blueprint challenge (if function exists)
            if (typeof updateDashboardBlueprintChallenge === 'function') {
                updateDashboardBlueprintChallenge();
            }
        } else {
            // Developer mode or API not available - save to sessionStorage
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            // Save to sessionStorage (persists until browser closes or hard refresh)
            const sessionBlueprints = JSON.parse(sessionStorage.getItem('imi_blueprints') || '[]');
            const newBlueprint = {
                ...blueprintData,
                blueprintId: Date.now(), // Use timestamp as ID
                submissionDate: new Date().toISOString(),
                studentEmail: userData.email
            };
            sessionBlueprints.unshift(newBlueprint); // Add to beginning
            sessionStorage.setItem('imi_blueprints', JSON.stringify(sessionBlueprints));

            window.IMI.utils.showNotification(
                `Blueprint submitted successfully! You earned ${xpEarned} XP (${progress.completedSections}/5 sections). (Saved to session)`,
                'success'
            );

            // Refresh past blueprints list
            if (typeof renderPastBlueprints === 'function') {
                renderPastBlueprints();
            }

            // Update dashboard blueprint challenge (if function exists)
            if (typeof updateDashboardBlueprintChallenge === 'function') {
                updateDashboardBlueprintChallenge();
            }
        }

        // Update streak and tier
        updateStreak();
        updateTierProgress(xpEarned);

        // Trigger Blue Spark for Blueprint submission
        if (window.BlueSpark) {
            const event = new CustomEvent('blueprintSubmitted', {
                detail: {
                    topic: blueprintData.articleTitle,
                    sections: Object.keys(responses),
                    xpEarned: xpEarned,
                    completedSections: progress.completedSections
                }
            });
            document.dispatchEvent(event);
        }

        // Clear form after successful submission
        clearSubmissionForm();

        // Clear draft from localStorage
        localStorage.removeItem('blueprint_draft');

    } catch (error) {
        console.error('❌ Submission error:', error);
        window.IMI.utils.showNotification(
            `Error submitting blueprint: ${error.message}. Please try again.`,
            'error'
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Blueprint';
    }
}

// Save draft
// saveDraft function is defined later in the file

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

    // Collect article information
    const articleInfo = {
        title: document.getElementById('article-title')?.value || '',
        source: document.getElementById('article-source')?.value || '',
        url: document.getElementById('article-url')?.value || ''
    };

    // Save to localStorage (in production, save to backend)
    const draftData = {
        articleInfo,
        responses,
        timestamp: Date.now()
    };
    localStorage.setItem('blueprint_draft', JSON.stringify(draftData));

    window.IMI.utils.showNotification('Draft saved successfully!', 'success');

    // Update all section statuses to saved
    document.querySelectorAll('.section-status').forEach(status => {
        if (status.textContent !== 'Not started') {
            status.innerHTML = '✓ Saved';
        }
    });
}

// Note: submitBlueprint function is defined above (line 145)

// Clear submission form
function clearSubmissionForm() {
    // Clear article information fields
    const articleTitle = document.getElementById('article-title');
    const articleSource = document.getElementById('article-source');
    const articleUrl = document.getElementById('article-url');

    if (articleTitle) articleTitle.value = '';
    if (articleSource) articleSource.value = '';
    if (articleUrl) articleUrl.value = '';

    // Clear all Blueprint section textareas
    document.querySelectorAll('.submission-textarea').forEach(textarea => {
        textarea.value = '';
        updateWordCount(textarea);
        updateSectionStatus(textarea);
    });
}

// Setup auto-save for drafts
let autoSaveSetupComplete = false;
function setupAutoSaveDrafts() {
    if (autoSaveSetupComplete) {
        return;
    }

    let autoSaveTimer;
    const textareas = document.querySelectorAll('.submission-textarea');

    textareas.forEach((textarea) => {
        textarea.addEventListener('input', (event) => {
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

    autoSaveSetupComplete = true;
}

// Update tier progress
function updateTierProgress(earnedXP) {
    // Tier thresholds based on Blueprint system
    const tiers = {
        bronze: { min: 0, max: 999, name: 'Bronze', icon: '🥉' },
        silver: { min: 1000, max: 2499, name: 'Silver', icon: '🥈' },
        gold: { min: 2500, max: 4999, name: 'Gold', icon: '🥇' },
        platinum: { min: 5000, max: Infinity, name: 'Platinum', icon: '🏆' }
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
        { name: 'Platinum', value: 5000, color: '#1F2937', emoji: '🏆' }
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

// Track if draft has been loaded to prevent multiple notifications during same initialization
let blueprintDraftLoadedThisInitialization = false;

// Load saved draft - only when on blueprint page
function loadDraft() {
    // Check if we're on the blueprint page
    const currentPage = window.location.hash.slice(1) || 'dashboard';
    if (currentPage !== 'blueprint') {
        return; // Don't load draft if not on blueprint page
    }

    // Prevent multiple draft loads during the same initialization cycle
    if (blueprintDraftLoadedThisInitialization) {
        return;
    }

    let saved = localStorage.getItem('blueprint_draft');
    if (!saved) {
        // Check for old key for backward compatibility
        saved = localStorage.getItem('innovation_draft');
        if (saved) {
            // Migrate to new key
            localStorage.setItem('blueprint_draft', saved);
            localStorage.removeItem('innovation_draft');
        }
    }

    if (saved) {
        const draft = JSON.parse(saved);

        // Check if draft is not too old (7 days)
        const age = Date.now() - draft.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
            // Restore article information
            if (draft.articleInfo) {
                const articleTitle = document.getElementById('article-title');
                const articleSource = document.getElementById('article-source');
                const articleUrl = document.getElementById('article-url');

                if (articleTitle && draft.articleInfo.title) {
                    articleTitle.value = draft.articleInfo.title;
                }
                if (articleSource && draft.articleInfo.source) {
                    articleSource.value = draft.articleInfo.source;
                }
                if (articleUrl && draft.articleInfo.url) {
                    articleUrl.value = draft.articleInfo.url;
                }
            }

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

            // Mark as loaded to prevent duplicate notifications
            blueprintDraftLoadedThisInitialization = true;
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
    
    // Draft loading is now handled by soft refresh detection and page navigation events
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
        // Load draft on initial page load
        // Note: sessionStorage (blueprints) persists through ALL refresh types
        // It only clears when tab/window is closed or on logout
        const hasDraft = localStorage.getItem('blueprint_draft');
        if (hasDraft) {
            setTimeout(() => {
                loadDraft();
            }, 100);
        }

        initializeBlueprintChallenge();
        // Update all section statuses
        document.querySelectorAll('.submission-textarea').forEach(textarea => {
            updateSectionStatus(textarea);
        });
        setupXPChart();
        setupAutoSaveDrafts();

        // Add event listeners for buttons
        const saveDraftBtn = document.getElementById('save-draft-btn');
        const submitBtn = document.getElementById('submit-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (saveDraftBtn) saveDraftBtn.addEventListener('click', saveDraft);
        if (submitBtn) submitBtn.addEventListener('click', submitBlueprint);
        if (resetBtn) resetBtn.addEventListener('click', resetAllSections);
    } catch (error) {
        console.error('❌ Error initializing blueprint page:', error);
    }
});

// Load draft when navigating to blueprint page
document.addEventListener('pageChange', function(event) {
    if (event.detail && event.detail.page === 'blueprint') {
        setTimeout(loadDraft, 100); // Small delay to ensure DOM is ready
    }
});

// ====================
// Past Blueprints Feature
// ====================

// Pagination state
let blueprintsPaginationState = {
    offset: 0,
    limit: 4,
    hasMore: false,
    totalLoaded: 0,
    totalCount: 0
};

// Mock blueprint data (developer mode only)
const mockBlueprints = [
    {
        blueprintId: 1,
        studentEmail: 'developer@imadeit.ai',
        submissionDate: '2025-10-07T14:30:00Z',
        articleTitle: 'The Rise of Vertical Farming in Urban Centers',
        articleSource: 'MIT Technology Review',
        articleUrl: 'https://technologyreview.com/vertical-farming',
        trendspotter: 'Urban populations are growing rapidly, and traditional agriculture can\'t keep up. Vertical farming uses hydroponics and LED lighting to grow food in skyscrapers, reducing transportation costs and environmental impact. Singapore and the Netherlands are leading this revolution with government-backed initiatives.',
        futureVisionary: 'In 10 years, every major city will have vertical farms integrated into residential buildings. Imagine apartment complexes with food-producing walls, where residents grow their own vegetables. This will reduce food waste, cut carbon emissions by 50%, and create new jobs in urban agriculture.',
        innovationCatalyst: 'This trend could transform healthcare by creating "medical gardens" - vertical farms that grow medicinal plants tailored to individual patients. Pharmacies could become hyper-local, growing customized treatments on-demand using AI to optimize plant genetics.',
        connector: 'This requires collaboration between urban planners, agricultural engineers, AI developers, and public health experts. Real estate developers need to partner with biotech firms to retrofit buildings with farming infrastructure.',
        growthHacker: 'This article inspired me to explore sustainable technology careers. I\'m now researching agricultural engineering programs and considering internships in vertical farming startups. My first step: join a community garden and learn hydroponics basics.',
        xpEarned: 100,
        wordCount: 487,
        status: 'submitted'
    },
    {
        blueprintId: 2,
        studentEmail: 'developer@imadeit.ai',
        submissionDate: '2025-09-30T10:15:00Z',
        articleTitle: 'AI-Powered Energy Grids Transform Power Distribution',
        articleSource: 'Harvard Business Review',
        articleUrl: 'https://hbr.org/ai-energy-grids',
        trendspotter: 'Traditional power grids waste 30% of electricity due to inefficient routing. AI-powered smart grids use predictive algorithms to optimize energy distribution in real-time, reducing waste and costs. Companies like Google and Tesla are pioneering this technology.',
        futureVisionary: null,
        innovationCatalyst: null,
        connector: null,
        growthHacker: null,
        xpEarned: 20,
        wordCount: 95,
        status: 'submitted'
    },
    {
        blueprintId: 3,
        studentEmail: 'developer@imadeit.ai',
        submissionDate: '2025-09-23T16:45:00Z',
        articleTitle: 'The Future of Remote Work: Hybrid Models and Virtual Offices',
        articleSource: 'Bloomberg',
        articleUrl: 'https://bloomberg.com/remote-work-future',
        trendspotter: 'Post-pandemic, companies are adopting hybrid work models that balance flexibility with collaboration. Virtual reality offices are emerging, allowing remote teams to interact in immersive 3D spaces. This is reshaping corporate real estate and talent acquisition.',
        futureVisionary: 'By 2030, most knowledge workers will split time between home offices, coworking spaces, and VR meeting rooms. Companies will hire globally without location constraints, creating truly international teams and driving innovation through diverse perspectives.',
        innovationCatalyst: 'This trend could revolutionize education by creating "virtual campuses" where students from different countries attend the same classes in VR, collaborating on projects without travel costs. Universities could expand globally without building physical facilities.',
        connector: null,
        growthHacker: null,
        xpEarned: 60,
        wordCount: 312,
        status: 'submitted'
    }
];

// Render past blueprints (initial load or reset)
async function renderPastBlueprints(reset = true) {
    const container = document.getElementById('past-blueprints-container');
    const countElement = document.getElementById('past-blueprints-count');
    const loadMoreContainer = document.getElementById('load-more-blueprints');
    const showingCount = document.getElementById('blueprints-showing-count');

    if (!container) {
        return;
    }

    // Reset pagination state if needed
    if (reset) {
        blueprintsPaginationState = {
            offset: 0,
            limit: 4,
            hasMore: false,
            totalLoaded: 0,
            totalCount: 0
        };
    }

    // Get blueprints (mock for developer mode, API for Microsoft mode)
    const authMode = sessionStorage.getItem('imi_auth_mode');
    let blueprints = [];

    try {
        if (authMode === 'developer') {
            // Developer mode: combine sessionStorage blueprints with mock data
            const sessionBlueprints = JSON.parse(sessionStorage.getItem('imi_blueprints') || '[]');

            // Combine session blueprints (newest first) with mock blueprints
            const allBlueprints = [...sessionBlueprints, ...mockBlueprints];

            blueprints = allBlueprints.slice(blueprintsPaginationState.offset, blueprintsPaginationState.offset + blueprintsPaginationState.limit);
            blueprintsPaginationState.totalCount = allBlueprints.length;
            blueprintsPaginationState.hasMore = (blueprintsPaginationState.offset + blueprints.length) < allBlueprints.length;
        } else if (authMode === 'microsoft') {
            // Microsoft mode: fetch from API with pagination
            const userData = window.IMI?.data?.userData;

            if (userData && window.IMI?.api) {
                // Try Azure AD User ID first (PRIMARY METHOD)
                if (userData.id && window.IMI.api.getBlueprintsByUserId) {
                    blueprints = await window.IMI.api.getBlueprintsByUserId(
                        userData.id,
                        blueprintsPaginationState.limit,
                        blueprintsPaginationState.offset
                    );

                    // Get total count from stats
                    const stats = await window.IMI.api.getBlueprintStatsByUserId(userData.id);

                    blueprintsPaginationState.totalCount = stats.totalSubmissions || 0;
                    blueprintsPaginationState.hasMore = (blueprintsPaginationState.offset + blueprints.length) < blueprintsPaginationState.totalCount;
                }
                // Fallback to email-based method (LEGACY)
                else if (userData.email && window.IMI.api.getBlueprints) {
                    blueprints = await window.IMI.api.getBlueprints(
                        userData.email,
                        blueprintsPaginationState.limit,
                        blueprintsPaginationState.offset
                    );

                    // Get total count from stats
                    const stats = await window.IMI.api.getBlueprintStats(userData.email);

                    blueprintsPaginationState.totalCount = stats.totalSubmissions || 0;
                    blueprintsPaginationState.hasMore = (blueprintsPaginationState.offset + blueprints.length) < blueprintsPaginationState.totalCount;
                } else {
                    console.warn('⚠️ Cannot fetch blueprints - user data or API not available');
                }
            } else {
                console.warn('⚠️ Cannot fetch blueprints - user data or API not available');
            }
        }

        // Update loaded count
        if (reset) {
            blueprintsPaginationState.totalLoaded = blueprints.length;
            // Clear container on reset
            container.innerHTML = '';
        } else {
            blueprintsPaginationState.totalLoaded += blueprints.length;
        }

        // Update header count
        if (countElement) {
            countElement.textContent = `${blueprintsPaginationState.totalCount} submission${blueprintsPaginationState.totalCount !== 1 ? 's' : ''}`;
        }

        // Show empty state if no blueprints
        if (blueprints.length === 0 && blueprintsPaginationState.totalLoaded === 0) {
            container.innerHTML = '<p class="empty-state">No blueprints submitted yet.</p>';
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
            return;
        }

        // Render each blueprint card
        blueprints.forEach(blueprint => {
            const card = createBlueprintCard(blueprint);
            container.appendChild(card);
        });

        // Update "Load More" button visibility and count
        if (loadMoreContainer && showingCount) {
            if (blueprintsPaginationState.hasMore) {
                loadMoreContainer.style.display = 'flex';
                showingCount.textContent = `Showing ${blueprintsPaginationState.totalLoaded} of ${blueprintsPaginationState.totalCount} blueprints`;
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }

    } catch (error) {
        console.error('❌ Error loading blueprints:', error);
        container.innerHTML = '<p class="empty-state" style="color: #e74c3c;">Error loading blueprints. Please try again.</p>';
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    }
}

// Load more blueprints (pagination)
async function loadMoreBlueprints() {
    console.log('Loading more blueprints...');

    // Update offset
    blueprintsPaginationState.offset += blueprintsPaginationState.limit;

    // Render more blueprints (don't reset)
    await renderPastBlueprints(false);
}

// Make loadMoreBlueprints globally accessible
window.loadMoreBlueprints = loadMoreBlueprints;

function createBlueprintCard(blueprint) {
    const card = document.createElement('div');
    card.className = 'blueprint-card';
    card.onclick = () => openBlueprintModal(blueprint);

    // Format date
    const date = new Date(blueprint.submissionDate);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Count completed sections
    const sections = ['trendspotter', 'futureVisionary', 'innovationCatalyst', 'connector', 'growthHacker'];
    const completedSections = sections.filter(s => blueprint[s] && blueprint[s].trim().length > 0);

    // Two-column layout: Info (50%) | Stats + Sections (50%)
    card.innerHTML = `
        <div class="blueprint-card-info">
            <div class="blueprint-card-header">
                <span class="blueprint-card-date">
                    <i class="fa-solid fa-calendar"></i>
                    ${formattedDate}
                </span>
            </div>
            <div class="blueprint-card-article-title">${blueprint.articleTitle}</div>
            <div class="blueprint-card-article-source">${blueprint.articleSource}</div>
        </div>

        <div class="blueprint-card-right">
            <div class="blueprint-card-stats">
                <div class="blueprint-card-xp">${blueprint.xpEarned}</div>
                <div class="blueprint-card-xp-label">XP Earned</div>
                <div class="blueprint-card-sections-label" style="margin-left: auto;">${completedSections.length}/5 Sections</div>
            </div>

            <div class="blueprint-section-badges">
                ${sections.map(s => {
                    const isCompleted = completedSections.includes(s);
                    return `<span class="blueprint-section-badge ${isCompleted ? 'completed' : ''}">${getSectionName(s)}</span>`;
                }).join('')}
            </div>
        </div>
    `;

    return card;
}

function getSectionName(sectionKey) {
    const names = {
        trendspotter: 'Trendspotter',
        futureVisionary: 'Future Visionary',
        innovationCatalyst: 'Innovation Catalyst',
        connector: 'Connector',
        growthHacker: 'Growth Hacker'
    };
    return names[sectionKey] || sectionKey;
}

function openBlueprintModal(blueprint) {
    console.log('Opening blueprint modal:', blueprint.blueprintId);

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) {
        console.error('Modal elements not found');
        return;
    }

    const date = new Date(blueprint.submissionDate);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    modalBody.innerHTML = getBlueprintModalContent(blueprint, formattedDate);

    modal.classList.add('active');
    modal.style.display = 'flex';

    console.log('Blueprint modal opened');
}

function getBlueprintModalContent(blueprint, formattedDate) {
    const sections = [
        { key: 'trendspotter', name: 'The Trendspotter', icon: 'fa-magnifying-glass' },
        { key: 'futureVisionary', name: 'The Future Visionary', icon: 'fa-road' },
        { key: 'innovationCatalyst', name: 'The Innovation Catalyst', icon: 'fa-bolt' },
        { key: 'connector', name: 'The Connector', icon: 'fa-link' },
        { key: 'growthHacker', name: 'The Growth Hacker', icon: 'fa-chart-line' }
    ];

    return `
        <div class="blueprint-modal">
            <div class="blueprint-modal-header">
                <h2>Blueprint Submission #${blueprint.blueprintId}</h2>
                <div class="blueprint-modal-meta">
                    <span>${formattedDate}</span>
                    <span class="blueprint-modal-xp">${blueprint.xpEarned} XP</span>
                </div>
            </div>

            <div class="blueprint-modal-article">
                <h3><i class="fa-solid fa-newspaper"></i> Article Information</h3>
                <p><strong>${blueprint.articleTitle}</strong></p>
                <p style="color: var(--text-gray); margin: var(--spacing-xs) 0;">${blueprint.articleSource}</p>
                <p><a href="${blueprint.articleUrl}" target="_blank" class="blueprint-modal-article-link">${blueprint.articleUrl}</a></p>
            </div>

            ${sections.map(section => {
                const content = blueprint[section.key];
                const isEmpty = !content || content.trim().length === 0;

                return `
                    <div class="blueprint-modal-section ${isEmpty ? 'empty' : ''}">
                        <h4><i class="fa-solid ${section.icon}"></i> ${section.name}</h4>
                        <div class="blueprint-modal-section-content">
                            ${isEmpty ? 'Not completed' : content}
                        </div>
                    </div>
                `;
            }).join('')}

            <div class="button-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

// Initialize past blueprints when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('past-blueprints-container')) {
        renderPastBlueprints();
    }
});

// Also render when navigating to blueprint page
document.addEventListener('pageChange', function(event) {
    if (event.detail && event.detail.page === 'blueprint') {
        setTimeout(() => {
            renderPastBlueprints();
        }, 100);
    }
});