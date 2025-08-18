// js/innovation.js - Innovation Challenge Functionality

// Initialize Innovation Challenge
function initializeInnovationChallenge() {
    console.log('Initializing Innovation Challenge...');
    
    // Set up word counters
    setupWordCounters();
    
    // Set up submission handlers
    setupSubmissionHandlers();
    
    // Set up leaderboard tabs
    setupLeaderboardTabs();
    
    // Load current challenge data
    loadCurrentChallenge();
    
    // Set up auto-save for drafts
    setupAutoSaveDrafts();
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
            statusElement.textContent = '✓ Complete';
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
    let totalPoints = 0;
    
    sections.forEach(section => {
        const textarea = section.querySelector('.submission-textarea');
        const wordCount = updateWordCount(textarea);
        
        if (wordCount >= 100) {
            completedSections++;
            totalPoints += 20; // 20 points per section
        }
    });
    
    // Update progress display
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
    
    // Update points display
    const pointsDisplay = document.querySelector('.points-earned');
    if (pointsDisplay) {
        pointsDisplay.textContent = `${totalPoints}/100 points earned`;
    }
    
    return { completedSections, totalPoints };
}

// Setup submission handlers
function setupSubmissionHandlers() {
    const submitButton = document.querySelector('.btn-submit-challenge');
    if (submitButton) {
        submitButton.addEventListener('click', submitChallenge);
    }
    
    const saveDraftButton = document.querySelector('.btn-save-draft');
    if (saveDraftButton) {
        saveDraftButton.addEventListener('click', saveDraft);
    }
}

// Submit challenge for AI review
async function submitChallenge(e) {
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
        console.log('Submitting for AI review:', responses);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success
        window.IMI.utils.showNotification(
            `Challenge submitted successfully! You earned ${progress.totalPoints} points.`,
            'success'
        );
        
        // Update streak
        updateStreak();
        
        // Clear form
        clearSubmissionForm();
        
    } catch (error) {
        console.error('Submission error:', error);
        window.IMI.utils.showNotification('Error submitting challenge. Please try again.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit for AI Review';
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
        'innovation-catalyst',
        'trend-spotter',
        'future-visionist',
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

// Clear submission form
function clearSubmissionForm() {
    document.querySelectorAll('.submission-textarea').forEach(textarea => {
        textarea.value = '';
        updateWordCount(textarea);
        updateSectionStatus(textarea);
    });
}

// Load current challenge
function loadCurrentChallenge() {
    // In production, fetch from API
    const challengeData = {
        topic: 'The Future of Sustainable Cities',
        description: 'Explore how technology and innovation can create more sustainable urban environments.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        weeklySubmission: true,
        multipleSubmissionsAllowed: true,
        pointsDecay: 0.5, // Subsequent submissions get 50% points
        sections: [
            {
                id: 'innovation-catalyst',
                title: '🚀 Innovation Catalyst',
                prompt: 'What breakthrough innovation could transform sustainable cities?'
            },
            {
                id: 'trend-spotter',
                title: '🔍 Trend Spotter',
                prompt: 'What current trends are shaping sustainable urban development?'
            },
            {
                id: 'future-visionist',
                title: '🔮 Future Visionist',
                prompt: 'How will sustainable cities look in 2050?'
            },
            {
                id: 'connector',
                title: '🔗 Connector',
                prompt: 'How can different stakeholders collaborate for sustainable cities?'
            },
            {
                id: 'growth-hacker',
                title: '📈 Growth Hacker',
                prompt: 'How can we scale sustainable city solutions globally?'
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
    // Update topic
    const topicElement = document.querySelector('.challenge-topic');
    if (topicElement) {
        topicElement.textContent = data.topic;
    }
    
    // Update deadline
    const deadlineElement = document.querySelector('.challenge-deadline');
    if (deadlineElement) {
        const daysLeft = Math.ceil((data.deadline - Date.now()) / (24 * 60 * 60 * 1000));
        deadlineElement.textContent = `Due in ${daysLeft} days`;
    }
    
    // Update section prompts
    data.sections.forEach(section => {
        const textarea = document.querySelector(`#${section.id}-textarea`);
        if (textarea) {
            textarea.placeholder = section.prompt;
        }
    });
}

// Load saved draft
function loadDraft() {
    const saved = localStorage.getItem('innovation_draft');
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

// Setup leaderboard tabs
function setupLeaderboardTabs() {
    const tabButtons = document.querySelectorAll('.leaderboard-tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active tab
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Load appropriate leaderboard
            const tabType = this.textContent.toLowerCase();
            loadLeaderboard(tabType);
        });
    });
}

// Load leaderboard data
function loadLeaderboard(type) {
    console.log(`Loading ${type} leaderboard...`);
    
    // In production, fetch from API
    let leaderboardData;
    
    if (type === 'points') {
        leaderboardData = [
            { rank: 1, name: 'Alex Chen', value: '3,240 pts', medal: 'gold' },
            { rank: 2, name: 'Maria Garcia', value: '3,180 pts', medal: 'silver' },
            { rank: 3, name: 'James Wilson', value: '2,950 pts', medal: 'bronze' }
        ];
    } else if (type === 'streaks') {
        leaderboardData = [
            { rank: 1, name: 'Sarah Johnson', value: '45 weeks', medal: 'gold' },
            { rank: 2, name: 'Mike Davis', value: '38 weeks', medal: 'silver' },
            { rank: 3, name: 'Emma Thompson', value: '31 weeks', medal: 'bronze' }
        ];
    }
    
    updateLeaderboardDisplay(leaderboardData);
}

// Update leaderboard display
function updateLeaderboardDisplay(data) {
    const leaderboardContainer = document.querySelector('.leaderboard-extended');
    if (!leaderboardContainer) return;
    
    // Clear existing entries
    leaderboardContainer.innerHTML = '';
    
    // Add new entries
    data.forEach(entry => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${entry.medal || ''}`;
        
        const medalEmoji = {
            gold: '🥇',
            silver: '🥈',
            bronze: '🥉'
        };
        
        item.innerHTML = `
            <span class="rank">${medalEmoji[entry.medal] || `#${entry.rank}`}</span>
            <span class="name">${entry.name}</span>
            <span class="value">${entry.value}</span>
        `;
        
        leaderboardContainer.appendChild(item);
    });
}

// Update streak
function updateStreak() {
    const streakElement = document.querySelector('.streak-value');
    if (streakElement) {
        const currentStreak = parseInt(streakElement.textContent) || 0;
        streakElement.textContent = `${currentStreak + 1} week streak`;
        
        // Animate streak update
        streakElement.classList.add('updated');
        setTimeout(() => streakElement.classList.remove('updated'), 1000);
    }
}

// Load innovation leaderboard
function loadInnovationLeaderboard() {
    loadLeaderboard('points');
}

// Export functions
window.initializeInnovationChallenge = initializeInnovationChallenge;
window.loadCurrentChallenge = loadCurrentChallenge;