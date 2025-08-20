/**
 * Simplified Blue Spark Visual Reward System
 * Uses CSS classes to show/hide Blue Spark overlays on avatars
 */

class SimpleBlueSparkManager {
    constructor() {
        // Set Blue Spark end time (6 days from now for demo)
        this.endTime = new Date();
        this.endTime.setDate(this.endTime.getDate() + 6);
        this.endTime.setHours(this.endTime.getHours() - 1); // 5d 23h remaining
        
        this.init();
    }

    init() {
        console.log('Simple Blue Spark system initializing...');
        
        // For demo purposes, activate Blue Spark on both avatars
        this.activateBlueSpark();
        
        // Update activity indicator with countdown
        this.updateActivityIndicator();
        
        // Update countdown every minute
        setInterval(() => this.updateActivityIndicator(), 60000);
        
        console.log('Simple Blue Spark system initialized');
    }

    getTimeRemaining() {
        const now = new Date();
        const diff = this.endTime - now;
        
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
            const timeRemaining = this.getTimeRemaining();
            
            if (timeRemaining) {
                activityIndicator.style.display = 'flex';
                const blueText = activityIndicator.querySelector('.blue-spark-activity-text');
                const greyText = activityIndicator.querySelector('.support-text');
                
                if (blueText) {
                    blueText.innerHTML = `<span class="blue-sparkle">✨</span> Blue Spark Active (${timeRemaining})`;
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
