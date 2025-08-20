// js/notifications.js - Notifications Page Functionality

// Initialize notifications when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#notifications') {
        initializeNotifications();
    }
});

// Initialize notifications functionality
function initializeNotifications() {
    console.log('Initializing notifications...');
    
    // Set up filter chips
    setupNotificationFilters();
    
    // Set up notification actions
    setupNotificationActions();
    
    // Set up toggle switches for settings
    setupNotificationSettings();
    
    // Update counts and filters
    updateFilterChips();
    updateNotificationCount();
    
    // Update the notification badge based on current unread count
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    updateNotificationBadge(unreadCount);
    
    console.log(`Notifications initialized. ${unreadCount} unread notifications found.`);
}

// Set up notification filters
function setupNotificationFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Apply filter
            filterNotifications(filter);
        });
    });
}

// Filter notifications by category
function filterNotifications(category) {
    const notifications = document.querySelectorAll('.notification-item');
    
    notifications.forEach(notification => {
        const notificationCategory = notification.getAttribute('data-category');
        
        if (category === 'all' || notificationCategory === category) {
            notification.style.display = 'flex';
        } else {
            notification.style.display = 'none';
        }
    });
    
    console.log(`Filtered notifications by: ${category}`);
}

// Set up notification actions
function setupNotificationActions() {
    // Mark all as read
    const markAllBtn = document.querySelector('[onclick="markAllAsRead()"]');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', markAllAsRead);
    }
    
    // Clear read notifications
    const clearReadBtn = document.querySelector('[onclick="clearReadNotifications()"]');
    if (clearReadBtn) {
        clearReadBtn.addEventListener('click', clearReadNotifications);
    }
}

// Mark all notifications as read
function markAllAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        // Remove unread indicator
        const unreadIndicator = notification.querySelector('.unread-indicator');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
        
        // Update mark as read button text
        const markAsReadBtn = notification.querySelector('[onclick*="markAsRead"]');
        if (markAsReadBtn) {
            markAsReadBtn.textContent = 'Read';
            markAsReadBtn.disabled = true;
            markAsReadBtn.classList.add('disabled');
        }
    });
    
    // Update notification badge
    updateNotificationBadge(0);
    
    // Update filter chips
    updateFilterChips();
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('All notifications marked as read!', 'success');
    }
    
    console.log('All notifications marked as read');
}

// Clear read notifications
function clearReadNotifications() {
    const readNotifications = document.querySelectorAll('.notification-item.read');
    const confirmClear = confirm(`Are you sure you want to clear ${readNotifications.length} read notifications? This action cannot be undone.`);
    
    if (confirmClear) {
        readNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Update filter chips
        updateFilterChips();
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('Read notifications cleared!', 'success');
        }
        
        console.log('Read notifications cleared');
    }
}

// Mark individual notification as read
function markAsRead(button) {
    const notificationItem = button.closest('.notification-item');
    if (notificationItem) {
        notificationItem.classList.remove('unread');
        notificationItem.classList.add('read');
        
        // Remove unread indicator
        const unreadIndicator = notificationItem.querySelector('.unread-indicator');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
        
        // Update button
        button.textContent = 'Read';
        button.disabled = true;
        button.classList.add('disabled');
        
        // Update notification count
        const currentUnread = document.querySelectorAll('.notification-item.unread').length;
        updateNotificationBadge(currentUnread);
        
        // Update filter chips
        updateFilterChips();
        
        console.log('Notification marked as read');
    }
}

// Update notification badge count
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
    
    console.log(`Notification badge updated to: ${count}`);
}

// Update filter chip counts
function updateFilterChips() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    // Count notifications by category
    const counts = {
        all: document.querySelectorAll('.notification-item').length,
        blueprint: document.querySelectorAll('.notification-item[data-category="blueprint"]').length,
        events: document.querySelectorAll('.notification-item[data-category="events"]').length,
        projects: document.querySelectorAll('.notification-item[data-category="projects"]').length,
        rewards: document.querySelectorAll('.notification-item[data-category="rewards"]').length
    };
    
    filterChips.forEach(chip => {
        const filter = chip.getAttribute('data-filter');
        const count = counts[filter] || 0;
        
        // Update chip text with count
        const chipText = chip.textContent.replace(/\s*\(\d+\)/, '');
        chip.textContent = `${chipText} (${count})`;
    });
}

// Update notification count display
function updateNotificationCount() {
    const totalNotifications = document.querySelectorAll('.notification-item').length;
    const countDisplay = document.querySelector('.notifications-count');
    
    if (countDisplay) {
        countDisplay.textContent = `Showing ${totalNotifications} notifications`;
    }
}

// Set up notification settings toggles
function setupNotificationSettings() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingOption = this.closest('.setting-option');
            const settingName = settingOption.querySelector('h4').textContent;
            
            console.log(`${settingName} setting ${this.checked ? 'enabled' : 'disabled'}`);
            
            // Here you would typically save the setting to the backend
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification(
                    `${settingName} ${this.checked ? 'enabled' : 'disabled'}`,
                    'success'
                );
            }
        });
    });
}

// RSVP to event
function rsvpToEvent(eventId) {
    console.log(`RSVPing to event: ${eventId}`);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('RSVP confirmed! Event added to your calendar.', 'success');
    }
    
    // Mark notification as read
    const button = event.target;
    const notificationItem = button.closest('.notification-item');
    if (notificationItem) {
        markAsRead(notificationItem.querySelector('[onclick*="markAsRead"]'));
    }
}

// Request reference letter
function requestReference(company) {
    console.log(`Requesting reference from: ${company}`);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Reference request sent to ${company}!`, 'success');
    }
}

// Download certificate
function downloadCertificate(projectId) {
    console.log(`Downloading certificate for: ${projectId}`);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Certificate downloaded successfully!', 'success');
    }
}

// Join Teams channel
function joinTeamsChannel(channelId) {
    console.log(`Opening Teams channel: ${channelId}`);
    
    // Simulate opening Teams
    window.open(`https://teams.microsoft.com/l/channel/${channelId}`, '_blank');
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Opening Microsoft Teams...', 'info');
    }
}

// Claim reward
function claimReward(rewardId) {
    console.log(`Claiming reward: ${rewardId}`);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Reward claimed successfully! +500 XP added.', 'success');
    }
    
    // Mark notification as read
    const button = event.target;
    const notificationItem = button.closest('.notification-item');
    if (notificationItem) {
        markAsRead(notificationItem.querySelector('[onclick*="markAsRead"]'));
    }
}

// Register for workshop
function registerForWorkshop(workshopId) {
    console.log(`Registering for workshop: ${workshopId}`);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Workshop registration successful!', 'success');
    }
}

// Schedule mentor meeting
function scheduleMentorMeeting() {
    console.log('Scheduling mentor meeting...');
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Redirecting to calendar to schedule mentor meeting...', 'info');
    }
}

// Load more notifications
function loadMoreNotifications() {
    console.log('Loading more notifications...');
    
    // Simulate loading more notifications
    setTimeout(() => {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('No more notifications to load.', 'info');
        }
    }, 1000);
}

// Export notification history
function exportNotificationHistory() {
    console.log('Exporting notification history...');
    
    // Create a simple CSV export simulation
    const notifications = document.querySelectorAll('.notification-item');
    let csvContent = "Date,Title,Category,Status\\n";
    
    notifications.forEach(notification => {
        const title = notification.querySelector('.notification-title').textContent;
        const category = notification.getAttribute('data-category');
        const status = notification.classList.contains('read') ? 'Read' : 'Unread';
        const timestamp = notification.getAttribute('data-timestamp');
        const date = timestamp ? new Date(timestamp).toLocaleDateString() : 'Unknown';
        
        csvContent += `"${date}","${title}","${category}","${status}"\\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'notification-history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Notification history exported!', 'success');
    }
}

// Load notifications content when page is shown
function loadNotificationsContent() {
    console.log('Loading notifications content...');
    
    // Initialize if not already done
    if (typeof initializeNotifications === 'function') {
        initializeNotifications();
    }
    
    // Update counts and filters
    updateFilterChips();
    updateNotificationCount();
}

// Export functions for global use
window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.clearReadNotifications = clearReadNotifications;
window.rsvpToEvent = rsvpToEvent;
window.requestReference = requestReference;
window.downloadCertificate = downloadCertificate;
window.joinTeamsChannel = joinTeamsChannel;
window.claimReward = claimReward;
window.registerForWorkshop = registerForWorkshop;
window.scheduleMentorMeeting = scheduleMentorMeeting;
window.loadMoreNotifications = loadMoreNotifications;
window.exportNotificationHistory = exportNotificationHistory;
window.initializeNotifications = initializeNotifications;
window.loadNotificationsContent = loadNotificationsContent;
