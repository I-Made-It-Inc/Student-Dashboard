/**
 * Simplified Blue Spark Visual Reward System
 * Uses CSS classes to show/hide Blue Spark overlays on avatars
 * Blue Spark is active for 7 days after a blueprint submission
 */

class SimpleBlueSparkManager {
    constructor() {
        this.BLUE_SPARK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        this.init();
    }

    init() {
        console.log('Simple Blue Spark system initializing...');

        // Calculate and set Blue Spark state based on last submission
        this.refresh();

        // Update countdown at configured interval
        setInterval(() => this.updateActivityIndicator(), window.IMI.config.SESSION.updateInterval);

        console.log('Simple Blue Spark system initialized');
    }

    /**
     * Refresh Blue Spark state based on current userData
     * Call this after blueprint submission or when userData changes
     */
    refresh() {
        const userData = window.IMI?.data?.userData;

        if (!userData || !userData.lastBlueprintSubmission) {
            // No submission data - deactivate Blue Spark
            this.deactivateBlueSpark();
            return;
        }

        const lastSubmission = new Date(userData.lastBlueprintSubmission);
        const now = new Date();
        const timeSinceSubmission = now - lastSubmission;

        // Check if within 7 days
        if (timeSinceSubmission < this.BLUE_SPARK_DURATION_MS && timeSinceSubmission >= 0) {
            // Blue Spark is active
            this.activateBlueSpark();
            this.updateActivityIndicator();
        } else {
            // Blue Spark expired or future date
            this.deactivateBlueSpark();
        }
    }

    getTimeRemaining() {
        const userData = window.IMI?.data?.userData;

        if (!userData || !userData.lastBlueprintSubmission) {
            return null;
        }

        const lastSubmission = new Date(userData.lastBlueprintSubmission);
        const now = new Date();
        const endTime = new Date(lastSubmission.getTime() + this.BLUE_SPARK_DURATION_MS);
        const diff = endTime - now;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}d ${hours}h remaining`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m remaining`;
        } else {
            return `${minutes}m remaining`;
        }
    }

    activateBlueSpark() {
        const profileAvatar = document.querySelector('.profile-avatar');
        const navAvatar = document.querySelector('.user-avatar');
        
        if (profileAvatar) {
            profileAvatar.classList.add('blue-spark-active');
            profileAvatar.title = 'Blue Spark Active - Great job on your recent submission!';
        }
        
        if (navAvatar) {
            navAvatar.classList.add('blue-spark-active');
            navAvatar.title = 'Blue Spark Active - Great job on your recent submission!';
        }
        
        console.log('Blue Spark activated on avatars');
    }

    deactivateBlueSpark() {
        const profileAvatar = document.querySelector('.profile-avatar');
        const navAvatar = document.querySelector('.user-avatar');
        const activityIndicator = document.getElementById('blueprint-activity-indicator');

        if (profileAvatar) {
            profileAvatar.classList.remove('blue-spark-active');
            profileAvatar.title = '';
        }

        if (navAvatar) {
            navAvatar.classList.remove('blue-spark-active');
            navAvatar.title = 'Profile Settings';
        }

        if (activityIndicator) {
            activityIndicator.style.display = 'none';
        }

        console.log('Blue Spark deactivated on avatars');
    }

    updateActivityIndicator() {
        const activityIndicator = document.getElementById('blueprint-activity-indicator');
        if (activityIndicator) {
            const timeRemaining = this.getTimeRemaining();
            
            if (timeRemaining) {
                activityIndicator.style.display = 'flex';
                const blueText = activityIndicator.querySelector('.blue-spark-activity-text');
                const greyText = activityIndicator.querySelector('.support-text');
                
                if (blueText) {
                    blueText.innerHTML = `<i class="fa-solid fa-award"></i> Blue Spark Active (${timeRemaining})`;
                }
                if (greyText) {
                    greyText.textContent = `Excellent work on your Blueprint submission!`;
                }
            } else {
                // Time expired, deactivate Blue Spark
                this.deactivateBlueSpark();
                activityIndicator.style.display = 'none';
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simpleBlueSpark = new SimpleBlueSparkManager();
    });
} else {
    window.simpleBlueSpark = new SimpleBlueSparkManager();
}

// Export for console testing
window.SimpleBlueSparkManager = SimpleBlueSparkManager;
