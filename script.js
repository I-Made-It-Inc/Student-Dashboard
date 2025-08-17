// Navigation functionality
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(page + '-page');
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Add active class to selected nav link
    const selectedNav = document.getElementById('nav-' + page);
    if (selectedNav) {
        selectedNav.classList.add('active');
    }
    
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
}

// Modal functionality
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let content = '';
    
    switch(type) {
        case 'profile':
            content = `
                <h2>Edit Your Profile</h2>
                <p style="color: #718096; margin-bottom: 20px;">Update your public profile and interests</p>
                <form>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Display Name</label>
                        <input type="text" value="Jane Doe" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Bio</label>
                        <textarea style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; height: 100px;" placeholder="Tell others about yourself...">High school student passionate about technology and sustainability. Currently exploring AI applications in environmental solutions.</textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Interests (for peer matching)</label>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Machine Learning
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Sustainability
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> Marketing
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Data Science
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> UX Design
                            </label>
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> Finance
                            </label>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">LinkedIn Profile</label>
                        <input type="url" placeholder="https://linkedin.com/in/..." style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Portfolio Website</label>
                        <input type="url" placeholder="https://..." style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Save Profile</button>
                </form>
            `;
            break;
            
        case 'add-connection':
            content = `
                <h2>Add New Connection</h2>
                <p style="color: #718096; margin-bottom: 20px;">Record details about your professional connection</p>
                <form>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Name</label>
                        <input type="text" placeholder="Full name" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Title & Company</label>
                        <input type="text" placeholder="e.g., CEO at TechCorp" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">How did you meet?</label>
                        <textarea style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; height: 80px;" placeholder="e.g., Met at Q3 networking event, discussed AI in healthcare..."></textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Key Topics Discussed</label>
                        <input type="text" placeholder="e.g., AI, Product Strategy, Mentorship" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Upload Photos</label>
                        <div style="border: 2px dashed #e2e8f0; border-radius: 10px; padding: 20px; text-align: center;">
                            <p style="color: #718096;">📷 Drop photos here or click to browse</p>
                            <input type="file" multiple accept="image/*" style="display: none;">
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox"> Can provide reference letter
                        </label>
                    </div>
                    <button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Add Connection</button>
                </form>
            `;
            break;
            
        case 'connection-detail':
            content = `
                <h2>Michael Smith</h2>
                <p style="color: #718096; margin-bottom: 20px;">CEO at TechCorp</p>
                
                <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px;">Connection Notes</h4>
                    <p style="color: #4a5568; line-height: 1.6;">Met at Q3 networking event on September 15, 2024. Had an engaging discussion about AI applications in healthcare. Michael showed interest in my project on predictive analytics for patient care. He offered to mentor me on product strategy and scaling technology solutions.</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px;">Key Topics</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="padding: 5px 12px; background: #e8ecff; color: #667eea; border-radius: 15px; font-size: 13px;">AI in Healthcare</span>
                        <span style="padding: 5px 12px; background: #e8ecff; color: #667eea; border-radius: 15px; font-size: 13px;">Product Strategy</span>
                        <span style="padding: 5px 12px; background: #e8ecff; color: #667eea; border-radius: 15px; font-size: 13px;">Mentorship</span>
                        <span style="padding: 5px 12px; background: #e8ecff; color: #667eea; border-radius: 15px; font-size: 13px;">Scaling Solutions</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 10px;">Photos from Events</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div style="background: #e2e8f0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
                        <div style="background: #e2e8f0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
                        <div style="background: #e2e8f0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Request Reference</button>
                    <button style="background: white; color: #667eea; padding: 12px 24px; border: 2px solid #667eea; border-radius: 10px; font-weight: 600; cursor: pointer;">Send Message</button>
                </div>
            `;
            break;
            
        case 'perplexity-training':
            content = `
                <h2>Perplexity AI Training Guide</h2>
                <div style="margin: 20px 0;">
                    <h3 style="margin-bottom: 15px;">Getting Started with Perplexity</h3>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">1. Basic Search Queries</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Learn how to formulate effective search queries to get accurate, sourced information. Perplexity excels at providing citations and multiple perspectives.</p>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">2. Focus Modes</h4>
                        <ul style="color: #4a5568; margin-left: 20px; line-height: 1.8;">
                            <li><strong>Web:</strong> Search across the entire internet</li>
                            <li><strong>Academic:</strong> Focus on scholarly articles</li>
                            <li><strong>Writing:</strong> Get help with content creation</li>
                            <li><strong>Wolfram|Alpha:</strong> For computational queries</li>
                        </ul>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">3. Best Practices</h4>
                        <ul style="color: #4a5568; margin-left: 20px; line-height: 1.8;">
                            <li>Use specific, detailed queries</li>
                            <li>Ask follow-up questions to dive deeper</li>
                            <li>Verify important information with citations</li>
                            <li>Use collections to organize research</li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-right: 10px;">Watch Video Tutorial</button>
                        <button style="background: white; color: #667eea; padding: 12px 24px; border: 2px solid #667eea; border-radius: 10px; font-weight: 600; cursor: pointer;">Download PDF Guide</button>
                    </div>
                </div>
            `;
            break;
            
        case 'gemini-training':
            content = `
                <h2>Google Gemini Training Guide</h2>
                <div style="margin: 20px 0;">
                    <h3 style="margin-bottom: 15px;">Mastering Gemini for Projects</h3>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">1. Creative Content Generation</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Use Gemini for brainstorming, creative writing, and generating marketing content. Learn prompt engineering for better outputs.</p>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">2. Code Assistance</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Get help with coding projects, debugging, and understanding complex algorithms. Gemini can explain code in simple terms.</p>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">3. Multimodal Capabilities</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Upload images for analysis, generate visuals from descriptions, and work with multiple types of content simultaneously.</p>
                    </div>
                    
                    <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Start Interactive Tutorial</button>
                </div>
            `;
            break;
            
        case 'notebook-training':
            content = `
                <h2>NotebookLM Training Guide</h2>
                <div style="margin: 20px 0;">
                    <h3 style="margin-bottom: 15px;">Organize Your Research with NotebookLM</h3>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">1. Document Upload & Analysis</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Upload PDFs, Google Docs, and other documents. NotebookLM will analyze and help you understand complex materials.</p>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">2. AI-Powered Note Taking</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Generate summaries, key points, and study guides from your uploaded materials automatically.</p>
                    </div>
                    
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <h4 style="color: #667eea; margin-bottom: 10px;">3. Citation Management</h4>
                        <p style="color: #4a5568; line-height: 1.6;">Keep track of sources and generate proper citations for your research projects.</p>
                    </div>
                    
                    <button style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Access Training Materials</button>
                </div>
            `;
            break;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
    
    // Prevent form submission for demo
    const form = modalBody.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Changes saved successfully! (Demo)');
            closeModal();
        });
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Innovation Challenge Functions
function updateWordCount(textarea) {
    const wordCount = textarea.value.split(/\s+/).filter(word => word.length > 0).length;
    const maxWords = 100;
    const countElement = textarea.parentElement.querySelector('.word-count');
    if (countElement) {
        countElement.textContent = `${wordCount}/${maxWords} words`;
    }
    
    // Update section status
    const statusElement = textarea.parentElement.querySelector('.section-status');
    if (statusElement && wordCount > 0) {
        statusElement.textContent = '✓ In progress';
        statusElement.classList.add('in-progress');
    }
}

// Company Filtering
function filterCompanies() {
    const searchInput = document.querySelector('.company-search');
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Toggle active state
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                // Remove active from all chips if selecting a specific filter
                if (this.textContent !== 'All') {
                    document.querySelector('.chip:first-child').classList.remove('active');
                }
                this.classList.add('active');
            }
            
            // Here you would filter the actual company cards
            console.log('Filter applied:', this.textContent);
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching companies for:', searchTerm);
            // Implement actual search functionality here
        });
    }
}

// Time Tracking Functions
function initTimeTracking() {
    // Auto-track time on page
    let startTime = Date.now();
    let currentPage = 'dashboard';
    
    setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        // Update session timer in UI if needed
    }, 60000); // Update every minute
    
    // Track page changes
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            const page = this.id.replace('nav-', '');
            logPageTime(currentPage, Date.now() - startTime);
            currentPage = page;
            startTime = Date.now();
        });
    });
}

function logPageTime(page, duration) {
    // Log time spent on each page
    console.log(`Time spent on ${page}: ${Math.floor(duration / 1000)} seconds`);
    // Here you would send this data to your backend
}

// Initialize all features on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize word counters for Innovation Challenge
    const textareas = document.querySelectorAll('.submission-textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            updateWordCount(this);
        });
    });
    
    // Initialize company filtering
    filterCompanies();
    
    // Initialize time tracking
    initTimeTracking();
    
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 100);
    
    // Handle collaboration requests
    document.querySelectorAll('.btn-collaborate').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Collaboration request sent! The project owner will be notified. (Demo)');
        });
    });
    
    // Handle RSVP buttons
    document.querySelectorAll('.btn-primary-small').forEach(btn => {
        if (btn.textContent === 'RSVP') {
            btn.addEventListener('click', function() {
                this.textContent = 'Registered ✓';
                this.style.background = '#48bb78';
            });
        }
    });
    
    // Handle peer connection requests
    document.querySelectorAll('.btn-connect').forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Request Sent';
            this.disabled = true;
            this.style.opacity = '0.6';
        });
    });
    
    // Handle referral program buttons
    document.querySelectorAll('.btn-referral').forEach(btn => {
        btn.addEventListener('click', function() {
            openModal('referral-details');
        });
    });
    
    // Leaderboard tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Switch leaderboard content based on selected tab
            if (this.textContent === 'Streaks') {
                updateLeaderboardForStreaks();
            } else {
                updateLeaderboardForPoints();
            }
        });
    });
    
    // Auto-save Innovation Challenge drafts
    let autoSaveTimer;
    document.querySelectorAll('.submission-textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            const statusElement = this.parentElement.querySelector('.section-status');
            
            autoSaveTimer = setTimeout(() => {
                if (this.value.length > 0) {
                    statusElement.textContent = '✓ Saved';
                    statusElement.classList.add('completed');
                    console.log('Auto-saved section:', this.parentElement.querySelector('h4').textContent);
                }
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
    
    // Handle time entry form submission
    const timeEntryForm = document.querySelector('.time-entry-form');
    if (timeEntryForm) {
        timeEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Hours logged successfully! Your volunteer hours certificate has been updated. (Demo)');
            this.reset();
        });
    }
    
    // Simulate real-time updates
    simulateRealTimeUpdates();
});

// Update leaderboard functions
function updateLeaderboardForStreaks() {
    console.log('Showing streak leaderboard');
    // Update leaderboard display for streaks
}

function updateLeaderboardForPoints() {
    console.log('Showing points leaderboard');
    // Update leaderboard display for points
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update notification badge
    setInterval(() => {
        const badge = document.querySelector('.notification-badge');
        if (badge && Math.random() > 0.8) {
            const currentCount = parseInt(badge.textContent);
            badge.textContent = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        }
    }, 30000);
    
    // Update leaderboard positions
    setInterval(() => {
        if (document.getElementById('innovation-page').classList.contains('active')) {
            // Simulate minor position changes
            const positions = document.querySelectorAll('.leaderboard-item .points');
            positions.forEach(pos => {
                if (Math.random() > 0.7) {
                    const current = parseInt(pos.textContent);
                    pos.textContent = current + Math.floor(Math.random() * 20);
                }
            });
        }
    }, 60000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.company-search');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Ctrl/Cmd + S to save Innovation Challenge draft
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (document.getElementById('innovation-page').classList.contains('active')) {
            const statusElements = document.querySelectorAll('.section-status');
            statusElements.forEach(status => {
                if (status.parentElement.querySelector('textarea').value.length > 0) {
                    status.textContent = '✓ Saved';
                    status.classList.add('completed');
                }
            });
            alert('All sections saved! (Demo)');
        }
    }
});

// Track active project switching
function switchActiveProject(projectElement) {
    // Remove active state from all projects
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active state to selected project
    projectElement.classList.add('active');
    
    // Update the dashboard view
    updateDashboardActiveProject();
}

function updateDashboardActiveProject() {
    // Update the active project shown on the dashboard
    console.log('Active project switched');
}

// Initialize tooltips for help icons
function initTooltips() {
    // Add tooltips for various UI elements
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

console.log('IMI Student Dashboard v0.2 loaded successfully');
console.log('Current date:', new Date().toLocaleDateString());