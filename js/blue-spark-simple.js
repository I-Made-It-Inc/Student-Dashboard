/**
 * Simplified Blue Spark Visual Reward System
 * Uses CSS classes to show/hide Blue Spark overlays on avatars
 */

class SimpleBlueSparkManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('Simple Blue Spark system initializing...');
        
        // For demo purposes, activate Blue Spark on both avatars
        this.activateBlueSpark();
        
        // Update activity indicator
        this.updateActivityIndicator();
        
        console.log('Simple Blue Spark system initialized');
    }

    activateBlueSpark() {
        const profileAvatar = document.querySelector('.profile-avatar');
        const navAvatar = document.querySelector('.user-avatar');
        
        if (profileAvatar) {
            profileAvatar.classList.add('blue-spark-active');
            profileAvatar.title = 'Blue Spark Active - Recent activity detected!';
        }
        
        if (navAvatar) {
            navAvatar.classList.add('blue-spark-active');
            navAvatar.title = 'Blue Spark Active - Recent activity detected!';
        }
        
        console.log('Blue Spark activated on avatars');
    }

    deactivateBlueSpark() {
        const profileAvatar = document.querySelector('.profile-avatar');
        const navAvatar = document.querySelector('.user-avatar');
        
        if (profileAvatar) {
            profileAvatar.classList.remove('blue-spark-active');
            profileAvatar.title = '';
        }
        
        if (navAvatar) {
            navAvatar.classList.remove('blue-spark-active');  
            navAvatar.title = 'Profile Settings';
        }
        
        console.log('Blue Spark deactivated on avatars');
    }

    updateActivityIndicator() {
        const activityIndicator = document.getElementById('blueprint-activity-indicator');
        if (activityIndicator) {
            activityIndicator.style.display = 'flex';
            const indicator = activityIndicator.querySelector('.activity-indicator-text');
            if (indicator) {
                indicator.textContent = '✨ Blue Spark Active (5d 23h remaining)';
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
