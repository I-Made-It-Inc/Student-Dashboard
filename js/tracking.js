// js/tracking.js - Time Tracking Functionality

// Time tracking data structure
const timeTrackingData = {
    currentWeek: {
        innovationChallenge: 8.5,
        coopProjects: 22,
        personalReading: 5,
        total: 35.5
    },
    dailyHours: [
        { day: 'Mon', hours: 4.5 },
        { day: 'Tue', hours: 6 },
        { day: 'Wed', hours: 5.5 },
        { day: 'Thu', hours: 7 },
        { day: 'Fri', hours: 5.5 },
        { day: 'Today', hours: 4 }
    ],
    totalHours: 324,
    monthlyTrend: 'increasing',
    volunteerCertificateEligible: true
};

// Session tracking
let sessionData = {
    startTime: Date.now(),
    currentActivity: null,
    activityLog: []
};

// Initialize time tracking
function initializeTimeTracking() {
    console.log('Initializing time tracking...');
    
    // Set up time entry form
    setupTimeEntryForm();
    
    // Initialize charts
    initializeTimeCharts();
    
    // Start automatic tracking
    startAutomaticTracking();
    
    // Set up manual time entry
    setupManualTimeEntry();
    
    // Load historical data
    loadTimeData();
}

// Setup time entry form
function setupTimeEntryForm() {
    const form = document.querySelector('.time-entry-form');
    if (!form) return;
    
    form.addEventListener('submit', handleTimeEntry);
    
    // Set default date to today
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Add validation
    const hoursInput = form.querySelector('input[type="number"]');
    if (hoursInput) {
        hoursInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value < 0) e.target.value = 0;
            if (value > 24) e.target.value = 24;
        });
    }
    
    // Setup file upload handler
    setupProofOfWorkHandlers();
}

// Handle time entry submission
function handleTimeEntry(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const entry = {
        activity: formData.get('activity'),
        date: formData.get('date'),
        hours: parseFloat(formData.get('hours')),
        description: formData.get('description'),
        timestamp: Date.now()
    };
    
    console.log('Time entry:', entry);
    
    // Validate entry
    if (!entry.activity) {
        window.IMI.utils.showNotification('Please select an activity type', 'warning');
        return;
    }
    
    if (!entry.hours || entry.hours <= 0) {
        window.IMI.utils.showNotification('Please enter valid hours', 'warning');
        return;
    }
    
    if (!entry.description || entry.description.trim().length < 10) {
        window.IMI.utils.showNotification('Please provide a detailed description (minimum 10 characters)', 'warning');
        return;
    }
    
    // Validate proof of work
    const proofValidation = validateProofOfWork(formData);
    if (!proofValidation.valid) {
        window.IMI.utils.showNotification(proofValidation.message, 'warning');
        return;
    }
    
    // Add proof of work to entry
    entry.proofOfWork = proofValidation.proof;
    
    // Show loading state
    const submitButton = document.getElementById('submit-time-entry');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Simulate processing time for file uploads
    setTimeout(() => {
        // Save entry
        saveTimeEntry(entry);
        
        // Update displays
        updateTimeDisplays();
        
        // Update volunteer hours
        updateVolunteerHours(entry.hours);
        
        // Show success
        window.IMI.utils.showNotification(
            `${entry.hours} hours logged successfully with proof of work! Your volunteer certificate has been updated.`,
            'success'
        );
        
        // Reset form
        e.target.reset();
        resetProofOfWorkSection();
        const dateInput = e.target.querySelector('input[type="date"]');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1500);
}

// Save time entry
function saveTimeEntry(entry) {
    // Get existing entries from localStorage
    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    entries.push(entry);
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    
    // Update current week data
    updateCurrentWeekData(entry);
    
    // In production, send to API
    console.log('Saving time entry to backend...', entry);
}

// Update current week data
function updateCurrentWeekData(entry) {
    const activityMap = {
        'Innovation Challenge Writing': 'innovationChallenge',
        'Co-op Project Work': 'coopProjects',
        'Personal Reading/Research': 'personalReading'
    };
    
    const category = activityMap[entry.activity];
    if (category) {
        timeTrackingData.currentWeek[category] += entry.hours;
        timeTrackingData.currentWeek.total += entry.hours;
        timeTrackingData.totalHours += entry.hours;
    }
}

// Initialize time charts
function initializeTimeCharts() {
    console.log('Initializing time charts...');
    
    // Create weekly bar chart
    createWeeklyBarChart();
    
    // Create category pie chart
    createCategoryPieChart();
    
    // Update trend indicators
    updateTrendIndicators();
}

// Create weekly bar chart
function createWeeklyBarChart() {
    const chartContainer = document.querySelector('.time-bar-chart');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = '';
    
    timeTrackingData.dailyHours.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'time-bar';
        if (day.day === 'Today') {
            bar.classList.add('today');
        }
        
        const maxHeight = Math.max(...timeTrackingData.dailyHours.map(d => d.hours));
        const heightPercent = (day.hours / maxHeight) * 100;
        
        bar.style.height = `${heightPercent}%`;
        bar.innerHTML = `
            <span class="bar-value">${day.hours}h</span>
            <span class="bar-label">${day.day}</span>
        `;
        
        // Add animation
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
        }, index * 100);
        
        chartContainer.appendChild(bar);
    });
}

// Create category pie chart (simplified text version)
function createCategoryPieChart() {
    const container = document.querySelector('.time-breakdown');
    if (!container) return;
    
    const categories = [
        { name: 'Innovation Challenge', hours: timeTrackingData.currentWeek.innovationChallenge },
        { name: 'Co-op Projects', hours: timeTrackingData.currentWeek.coopProjects },
        { name: 'Personal Reading', hours: timeTrackingData.currentWeek.personalReading }
    ];
    
    container.innerHTML = categories.map(cat => `
        <div class="time-item">
            <span class="time-category">${cat.name}</span>
            <span class="time-hours">${cat.hours} hrs</span>
        </div>
    `).join('') + `
        <div class="time-total">
            <strong>Total: ${timeTrackingData.currentWeek.total} hrs</strong>
        </div>
    `;
}

// Update trend indicators
function updateTrendIndicators() {
    const trendElement = document.querySelector('.trend-comparison');
    if (!trendElement) return;
    
    const lastWeekTotal = 30; // Mock data
    const thisWeekTotal = timeTrackingData.currentWeek.total;
    const change = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(0);
    
    trendElement.innerHTML = `
        <span class="${change >= 0 ? 'positive' : 'negative'}">
            ${change >= 0 ? '↑' : '↓'} ${Math.abs(change)}% from last week
        </span>
    `;
}

// Start automatic tracking
function startAutomaticTracking() {
    console.log('Starting automatic time tracking...');
    
    // Track page focus time
    let focusStartTime = Date.now();
    let isPageFocused = true;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page lost focus
            if (isPageFocused) {
                const duration = Date.now() - focusStartTime;
                logAutomaticTime(duration);
                isPageFocused = false;
            }
        } else {
            // Page gained focus
            focusStartTime = Date.now();
            isPageFocused = true;
        }
    });
    
    // Track activity changes
    document.addEventListener('pageChange', (e) => {
        if (sessionData.currentActivity) {
            // Log time for previous activity
            const duration = Date.now() - sessionData.startTime;
            logActivityTime(sessionData.currentActivity, duration);
        }
        
        // Start tracking new activity
        sessionData.currentActivity = e.detail.page;
        sessionData.startTime = Date.now();
    });
    
    // Save session data periodically
    setInterval(saveSessionData, 60000); // Every minute
}

// Log automatic time
function logAutomaticTime(duration) {
    const minutes = Math.floor(duration / 60000);
    if (minutes > 0) {
        console.log(`Auto-tracked ${minutes} minutes of activity`);
        
        sessionData.activityLog.push({
            activity: sessionData.currentActivity || 'dashboard',
            duration: minutes,
            timestamp: Date.now()
        });
    }
}

// Log activity time
function logActivityTime(activity, duration) {
    const minutes = Math.floor(duration / 60000);
    if (minutes > 0) {
        console.log(`Activity "${activity}" tracked for ${minutes} minutes`);
        
        // Map page to activity category
        const activityMap = {
            'innovation': 'innovationChallenge',
            'projects': 'coopProjects',
            'resources': 'personalReading'
        };
        
        const category = activityMap[activity];
        if (category) {
            // Update in-memory data (in production, send to API)
            timeTrackingData.currentWeek[category] += minutes / 60;
            timeTrackingData.currentWeek.total += minutes / 60;
        }
    }
}

// Save session data
function saveSessionData() {
    const sessionSummary = {
        date: new Date().toISOString(),
        activities: sessionData.activityLog,
        totalMinutes: sessionData.activityLog.reduce((sum, log) => sum + log.duration, 0)
    };
    
    if (sessionSummary.totalMinutes > 0) {
        console.log('Saving session data:', sessionSummary);
        
        // Save to localStorage (in production, send to API)
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        sessions.push(sessionSummary);
        localStorage.setItem('sessions', JSON.stringify(sessions));
        
        // Clear activity log
        sessionData.activityLog = [];
    }
}

// Setup manual time entry
function setupManualTimeEntry() {
    console.log('Setting up manual time entry...');
    
    // Add quick time buttons
    const quickButtons = [
        { label: '15 min', minutes: 15 },
        { label: '30 min', minutes: 30 },
        { label: '1 hour', minutes: 60 },
        { label: '2 hours', minutes: 120 }
    ];
    
    const container = document.querySelector('.quick-time-buttons');
    if (container) {
        container.innerHTML = quickButtons.map(btn => `
            <button class="btn btn-secondary" onclick="quickAddTime(${btn.minutes})">
                + ${btn.label}
            </button>
        `).join('');
    }
}

// Quick add time
function quickAddTime(minutes) {
    const hours = minutes / 60;
    const hoursInput = document.querySelector('input[name="hours"]');
    if (hoursInput) {
        hoursInput.value = hours;
        hoursInput.focus();
    }
}

// Load time data
function loadTimeData() {
    console.log('Loading time tracking data...');
    
    // Load from localStorage or API
    const savedEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    
    // Calculate totals
    calculateTotals(savedEntries);
    
    // Update displays
    updateTimeDisplays();
    
    // Check volunteer certificate eligibility
    checkVolunteerEligibility();
}

// Calculate totals
function calculateTotals(entries) {
    // Group by week
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()); // Start of week
    
    entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= thisWeek) {
            // This week's entry
            updateCurrentWeekData(entry);
        }
    });
}

// Update time displays
function updateTimeDisplays() {
    // Update weekly total
    const weeklyTotalElement = document.querySelector('.weekly-total');
    if (weeklyTotalElement) {
        weeklyTotalElement.textContent = `${timeTrackingData.currentWeek.total.toFixed(1)} hrs`;
    }
    
    // Update total hours
    const totalHoursElement = document.querySelector('.total-hours-value');
    if (totalHoursElement) {
        totalHoursElement.textContent = timeTrackingData.totalHours;
    }
    
    // Update charts
    createWeeklyBarChart();
    createCategoryPieChart();
    updateTrendIndicators();
}

// Update volunteer hours
function updateVolunteerHours(additionalHours) {
    timeTrackingData.totalHours += additionalHours;
    
    // Update certificate eligibility
    checkVolunteerEligibility();
    
    // Update display
    const volunteerStatsElement = document.querySelector('.big-number');
    if (volunteerStatsElement) {
        volunteerStatsElement.textContent = Math.floor(timeTrackingData.totalHours);
    }
}

// Check volunteer certificate eligibility
function checkVolunteerEligibility() {
    const eligibilityThreshold = 100; // Hours needed for certificate
    
    if (timeTrackingData.totalHours >= eligibilityThreshold) {
        timeTrackingData.volunteerCertificateEligible = true;
        
        // Enable certificate button
        const certButton = document.querySelector('.btn-generate-certificate');
        if (certButton) {
            certButton.disabled = false;
            certButton.textContent = 'Generate Certificate';
        }
    }
}

// Generate volunteer certificate
function generateVolunteerCertificate() {
    if (!timeTrackingData.volunteerCertificateEligible) {
        window.IMI.utils.showNotification(
            'You need at least 100 volunteer hours to generate a certificate',
            'warning'
        );
        return;
    }
    
    console.log('Generating volunteer certificate...');
    
    // In production, generate PDF certificate
    const certificateData = {
        studentName: 'Jane Doe',
        totalHours: timeTrackingData.totalHours,
        activities: {
            innovation: timeTrackingData.currentWeek.innovationChallenge,
            projects: timeTrackingData.currentWeek.coopProjects,
            reading: timeTrackingData.currentWeek.personalReading
        },
        dateIssued: new Date().toLocaleDateString()
    };
    
    console.log('Certificate data:', certificateData);
    
    window.IMI.utils.showNotification(
        'Volunteer certificate generated! Check your downloads.',
        'success'
    );
}

// Update time charts (called from other modules)
function updateTimeCharts() {
    createWeeklyBarChart();
    createCategoryPieChart();
    updateTrendIndicators();
}

// Export functions
window.initializeTimeTracking = initializeTimeTracking;
window.quickAddTime = quickAddTime;
window.generateVolunteerCertificate = generateVolunteerCertificate;
window.updateTimeCharts = updateTimeCharts;
window.loadTimeData = loadTimeData;
window.setupProofOfWorkHandlers = setupProofOfWorkHandlers;
window.validateProofOfWork = validateProofOfWork;
window.resetProofOfWorkSection = resetProofOfWorkSection;

// Setup proof of work handlers
function setupProofOfWorkHandlers() {
    console.log('Setting up proof of work handlers...');
    
    // File upload handler
    const fileInput = document.getElementById('proof-files');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUploads);
    }
    
    // Drag and drop for upload zone
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            handleFileSelection(files);
        });
    }
}

// Handle file uploads
function handleFileUploads(e) {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
}

// Handle file selection (from input or drag/drop)
function handleFileSelection(files) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'text/plain'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;
    
    // Validate files
    const validFiles = [];
    const errors = [];
    
    if (files.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
    }
    
    files.forEach(file => {
        if (!allowedTypes.includes(file.type)) {
            errors.push(`${file.name}: File type not allowed`);
        } else if (file.size > maxSize) {
            errors.push(`${file.name}: File too large (max 10MB)`);
        } else {
            validFiles.push(file);
        }
    });
    
    if (errors.length > 0) {
        window.IMI.utils.showNotification(errors.join('\n'), 'warning');
        return;
    }
    
    // Display uploaded files
    displayUploadedFiles(validFiles);
}

// Display uploaded files
function displayUploadedFiles(files) {
    const filesList = document.querySelector('.uploaded-files-list');
    if (!filesList) return;
    
    // Clear existing files
    filesList.innerHTML = '';
    
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file-item';
        fileItem.dataset.fileIndex = index;
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = (file.size / 1024 / 1024).toFixed(1);
        
        fileItem.innerHTML = `
            <span class="file-icon">${fileIcon}</span>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-meta">${fileSize} MB</span>
            </div>
            <button type="button" class="btn-remove-file" onclick="removeUploadedFile(${index})" title="Remove file">
                ✕
            </button>
        `;
        
        filesList.appendChild(fileItem);
    });
    
    // Store files for validation
    window.uploadedProofFiles = files;
}

// Get file icon based on type
function getFileIcon(type) {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📄';
    return '📁';
}

// Remove uploaded file
function removeUploadedFile(index) {
    if (!window.uploadedProofFiles) return;
    
    window.uploadedProofFiles.splice(index, 1);
    displayUploadedFiles(window.uploadedProofFiles);
}

// Validate proof of work
function validateProofOfWork(formData) {
    const files = window.uploadedProofFiles || [];
    const links = [
        formData.get('workLink1'),
        formData.get('workLink2'),
        formData.get('workLink3')
    ].filter(link => link && link.trim());
    
    // Check if any proof is provided
    if (files.length === 0 && links.length === 0) {
        return {
            valid: false,
            message: 'Proof of work is required. Please upload files or provide links to your work.'
        };
    }
    
    // Validate links format
    const urlPattern = /^https?:\/\/.+/;
    for (const link of links) {
        if (!urlPattern.test(link)) {
            return {
                valid: false,
                message: `Invalid URL format: ${link}`
            };
        }
    }
    
    return {
        valid: true,
        proof: {
            files: files.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size
            })),
            links: links
        }
    };
}

// Reset proof of work section
function resetProofOfWorkSection() {
    // Clear uploaded files
    const filesList = document.querySelector('.uploaded-files-list');
    if (filesList) {
        filesList.innerHTML = '';
    }
    
    // Clear file input
    const fileInput = document.getElementById('proof-files');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Clear stored files
    window.uploadedProofFiles = [];
}

// Make remove function global
window.removeUploadedFile = removeUploadedFile;