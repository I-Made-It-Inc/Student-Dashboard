// js/blue-spark.js - Blue Spark Visual Reward System

/**
 * Blue Spark Visual Reward System
 * Manages the display and timing of Blue Spark rewards for user engagement
 */

const BlueSpark = {
    // Configuration
    config: {
        SPARK_DURATION: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        STORAGE_KEY: 'imi_blue_spark_data',
        ACTIVITY_TYPES: {
            BLUEPRINT_SUBMISSION: 'blueprint_submission',
            CONNECTOR_BONUS: 'connector_bonus',
            FEATURED_INSIGHT: 'featured_insight',
            COOP_PROJECT_COMPLETION: 'coop_project_completion'
        }
    },

    // Initialize the Blue Spark system
    init() {
        console.log('Initializing Blue Spark Visual Reward System...');
        
        // Load existing spark data
        this.loadSparkData();
        
        // For demo purposes, ensure there's an active spark
        this.initializeDemoSpark();
        
        // Update UI based on current spark status
        this.updateSparkUI();
        
        // Set up automatic cleanup
        this.setupCleanup();
        
        // Set up event listeners for actions that trigger Blue Spark
        this.setupEventListeners();
        
        console.log('Blue Spark system initialized');
    },

    // Initialize demo spark for presentation
    initializeDemoSpark() {
        // If no active sparks exist, create a demo one
        if (this.sparkData.activeSparks.length === 0) {
            console.log('Creating demo Blue Spark for presentation...');
            const demoSpark = {
                type: this.config.ACTIVITY_TYPES.BLUEPRINT_SUBMISSION,
                timestamp: Date.now() - (24 * 60 * 60 * 1000), // Yesterday
                expiresAt: Date.now() + (6 * 24 * 60 * 60 * 1000), // 6 days from now
                details: {
                    topic: 'The Future of Sustainable Cities',
                    sections: ['trendspotter', 'future-visionary'],
                    demo: true
                }
            };
            
            this.sparkData.activeSparks.push(demoSpark);
            this.sparkData.history.push({...demoSpark, triggered: true});
            this.saveSparkData();
        }
    },

    // Load spark data from localStorage
    loadSparkData() {
        const storedData = localStorage.getItem(this.config.STORAGE_KEY);
        this.sparkData = storedData ? JSON.parse(storedData) : {
            activeSparks: [],
            history: []
        };
        
        // Clean up expired sparks
        this.cleanupExpiredSparks();
    },

    // Save spark data to localStorage
    saveSparkData() {
        localStorage.setItem(this.config.STORAGE_KEY, JSON.stringify(this.sparkData));
    },

    // Check if Blue Spark is currently active
    isSparkActive() {
        return this.sparkData.activeSparks.length > 0;
    },

    // Get the most recent spark reason
    getCurrentSparkReason() {
        if (this.sparkData.activeSparks.length === 0) {
            return null;
        }
        
        // Sort by timestamp descending and get the most recent
        const mostRecent = [...this.sparkData.activeSparks]
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        
        return this.getSparkMessage(mostRecent.type, mostRecent.details);
    },

    // Trigger a new Blue Spark
    triggerSpark(activityType, details = {}) {
        console.log(`Triggering Blue Spark for: ${activityType}`, details);
        
        const sparkEntry = {
            type: activityType,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.config.SPARK_DURATION,
            details: details
        };
        
        // Add to active sparks
        this.sparkData.activeSparks.push(sparkEntry);
        
        // Add to history
        this.sparkData.history.push({...sparkEntry, triggered: true});
        
        // Save data
        this.saveSparkData();
        
        // Update UI
        this.updateSparkUI();
        
        // Show notification
        this.showSparkNotification(activityType, details);
        
        // Analytics tracking
        this.trackSparkEvent(activityType, details);
    },

    // Clean up expired sparks
    cleanupExpiredSparks() {
        const now = Date.now();
        const originalCount = this.sparkData.activeSparks.length;
        
        this.sparkData.activeSparks = this.sparkData.activeSparks.filter(
            spark => spark.expiresAt > now
        );
        
        const removedCount = originalCount - this.sparkData.activeSparks.length;
        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} expired Blue Sparks`);
            this.saveSparkData();
        }
    },

    // Update UI elements to show/hide Blue Spark
    updateSparkUI() {
        const profileSpark = document.getElementById('profile-blue-spark');
        const navSpark = document.getElementById('nav-blue-spark');
        const activityIndicator = document.getElementById('blueprint-activity-indicator');
        
        const isActive = this.isSparkActive();
        const reason = this.getCurrentSparkReason();
        
        // Update profile spark
        if (profileSpark) {
            if (isActive) {
                profileSpark.style.display = 'inline-flex';
                const tooltip = profileSpark.querySelector('.blue-spark-tooltip');
                if (tooltip && reason) {
                    tooltip.textContent = reason;
                }
            } else {
                profileSpark.style.display = 'none';
            }
        }
        
        // Update navigation spark
        if (navSpark) {
            if (isActive) {
                navSpark.style.display = 'inline-flex';
                const tooltip = navSpark.querySelector('.blue-spark-tooltip');
                if (tooltip && reason) {
                    tooltip.textContent = reason;
                }
            } else {
                navSpark.style.display = 'none';
            }
        }
        
        // Update dashboard activity indicator
        if (activityIndicator) {
            if (isActive) {
                activityIndicator.style.display = 'flex';
                // Update text based on most recent activity
                const mostRecentSpark = this.sparkData.activeSparks
                    .sort((a, b) => b.timestamp - a.timestamp)[0];
                if (mostRecentSpark) {
                    const timeRemaining = this.getTimeRemaining();
                    let activityText = '✨ Blue Spark Active';
                    let description = 'Great job on your recent activity!';
                    
                    if (mostRecentSpark.type === this.config.ACTIVITY_TYPES.BLUEPRINT_SUBMISSION) {
                        description = 'Excellent work on your Blueprint submission!';
                    } else if (mostRecentSpark.type === this.config.ACTIVITY_TYPES.CONNECTOR_BONUS) {
                        description = 'Great peer collaboration on Blueprint connections!';
                    }
                    
                    if (timeRemaining && timeRemaining.days >= 0) {
                        activityText += ` (${timeRemaining.days}d ${timeRemaining.hours}h remaining)`;
                    }
                    
                    const textElement = activityIndicator.querySelector('.blue-spark-activity-text');
                    const descElement = activityIndicator.querySelector('span');
                    if (textElement) textElement.textContent = activityText;
                    if (descElement) descElement.textContent = description;
                }
            } else {
                activityIndicator.style.display = 'none';
            }
        }
        
        console.log(`Blue Spark UI updated - Active: ${isActive}`);
    },

    // Get user-friendly message for spark type
    getSparkMessage(type, details) {
        const messages = {
            [this.config.ACTIVITY_TYPES.BLUEPRINT_SUBMISSION]: 'Recently active! Blueprint submission completed.',
            [this.config.ACTIVITY_TYPES.CONNECTOR_BONUS]: 'Connector bonus earned! Great peer collaboration.',
            [this.config.ACTIVITY_TYPES.FEATURED_INSIGHT]: 'Featured insight! Your idea was shared with the community.',
            [this.config.ACTIVITY_TYPES.COOP_PROJECT_COMPLETION]: 'Project milestone reached! Co-op work completed.'
        };
        
        return messages[type] || 'Recently active! Keep up the great work.';
    },

    // Show notification when Blue Spark is triggered
    showSparkNotification(activityType, details) {
        const message = `✨ Blue Spark activated! ${this.getSparkMessage(activityType, details)}`;
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification(message, 'success');
        } else {
            // Fallback notification
            console.log(`🎉 ${message}`);
        }
    },

    // Set up event listeners for activities that trigger Blue Spark
    setupEventListeners() {
        // Listen for Blueprint submissions
        document.addEventListener('blueprintSubmitted', (e) => {
            this.triggerSpark(this.config.ACTIVITY_TYPES.BLUEPRINT_SUBMISSION, {
                topic: e.detail?.topic,
                sections: e.detail?.sections
            });
        });
        
        // Listen for connector bonuses
        document.addEventListener('connectorBonusEarned', (e) => {
            this.triggerSpark(this.config.ACTIVITY_TYPES.CONNECTOR_BONUS, {
                peerBlueprint: e.detail?.peerBlueprint
            });
        });
        
        // Listen for featured insights
        document.addEventListener('insightFeatured', (e) => {
            this.triggerSpark(this.config.ACTIVITY_TYPES.FEATURED_INSIGHT, {
                insight: e.detail?.insight
            });
        });
        
        // Listen for co-op project completions
        document.addEventListener('coopProjectCompleted', (e) => {
            this.triggerSpark(this.config.ACTIVITY_TYPES.COOP_PROJECT_COMPLETION, {
                project: e.detail?.project,
                company: e.detail?.company
            });
        });
    },

    // Set up automatic cleanup timer
    setupCleanup() {
        // Clean up every hour
        setInterval(() => {
            this.cleanupExpiredSparks();
            this.updateSparkUI();
        }, 60 * 60 * 1000);
    },

    // Track spark events for analytics
    trackSparkEvent(activityType, details) {
        // In production, this would send analytics data
        console.log('Blue Spark Analytics:', {
            type: activityType,
            timestamp: new Date().toISOString(),
            details: details,
            userId: 'jane-doe' // Would come from auth system
        });
    },

    // Get spark statistics
    getSparkStats() {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        
        const recentHistory = this.sparkData.history.filter(
            spark => spark.timestamp > (now - oneMonth)
        );
        
        const thisWeek = recentHistory.filter(
            spark => spark.timestamp > (now - oneWeek)
        );
        
        return {
            totalSparks: this.sparkData.history.length,
            thisMonth: recentHistory.length,
            thisWeek: thisWeek.length,
            currentlyActive: this.sparkData.activeSparks.length,
            mostRecentActivity: this.sparkData.history.length > 0 
                ? new Date(this.sparkData.history[this.sparkData.history.length - 1].timestamp)
                : null
        };
    },

    // Manual trigger for testing (can be called from console)
    testSpark(type = 'blueprint_submission') {
        console.log('Manually triggering Blue Spark for testing...');
        this.triggerSpark(type, { test: true, trigger: 'manual' });
    },

    // Clear all spark data (for testing)
    clearAllSparks() {
        console.log('Clearing all Blue Spark data...');
        this.sparkData = { activeSparks: [], history: [] };
        this.saveSparkData();
        this.updateSparkUI();
    },

    // Get time remaining for current spark
    getTimeRemaining() {
        if (!this.isSparkActive()) {
            return null;
        }
        
        const mostRecentSpark = [...this.sparkData.activeSparks]
            .sort((a, b) => b.timestamp - a.timestamp)[0];
        
        const remaining = mostRecentSpark.expiresAt - Date.now();
        
        if (remaining <= 0) {
            return null;
        }
        
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        return { days, hours, totalMs: remaining };
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BlueSpark.init());
} else {
    BlueSpark.init();
}

// Export for use in other scripts
window.BlueSpark = BlueSpark;

// For testing in console - simulate a Blueprint submission
window.testBlueSpark = () => {
    const event = new CustomEvent('blueprintSubmitted', {
        detail: {
            topic: 'The Future of Sustainable Cities',
            sections: ['trendspotter', 'future-visionary', 'innovation-catalyst', 'connector', 'growth-hacker']
        }
    });
    document.dispatchEvent(event);
};

// Additional testing functions
window.testConnectorBonus = () => {
    const event = new CustomEvent('connectorBonusEarned', {
        detail: {
            peerBlueprint: 'AI-Powered Ocean Cleanup Systems by Alex Chen'
        }
    });
    document.dispatchEvent(event);
};

window.testFeaturedInsight = () => {
    const event = new CustomEvent('insightFeatured', {
        detail: {
            insight: 'Vertical farming combined with IoT sensors'
        }
    });
    document.dispatchEvent(event);
};

// Show current Blue Spark status
window.showBlueSparkStatus = () => {
    const stats = BlueSpark.getSparkStats();
    console.log('Blue Spark Status:', {
        isActive: BlueSpark.isSparkActive(),
        currentReason: BlueSpark.getCurrentSparkReason(),
        timeRemaining: BlueSpark.getTimeRemaining(),
        stats: stats
    });
};

// Clear all Blue Sparks (for testing)
window.clearBlueSparks = () => {
    BlueSpark.clearAllSparks();
    console.log('All Blue Sparks cleared');
};
