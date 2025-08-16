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
        case 'idea':
            content = `
                <h2>Submit New Idea</h2>
                <p style="color: #718096; margin-bottom: 20px;">Share your innovative ideas for projects or improvements</p>
                <form>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Idea Title</label>
                        <input type="text" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;" placeholder="Enter your idea title">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Category</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <option>Product Improvement</option>
                            <option>New Business Idea</option>
                            <option>Marketing Strategy</option>
                            <option>Process Optimization</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Description</label>
                        <textarea style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; height: 100px;" placeholder="Describe your idea in detail"></textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Collaborate with peers?</label>
                        <input type="checkbox" id="collaborate"> <label for="collaborate">Open for collaboration</label>
                    </div>
                    <button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Submit Idea</button>
                </form>
            `;
            break;
            
        case 'reference':
            content = `
                <h2>Request Reference Letter</h2>
                <p style="color: #718096; margin-bottom: 20px;">Request a reference letter from your mentors or supervisors</p>
                <form>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Select Referee</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <option>Michael Smith - CEO at TechCorp</option>
                            <option>Sarah Johnson - Marketing Director at StartupXYZ</option>
                            <option>David Lee - Data Analyst at DataCo</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Purpose</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <option>University Application</option>
                            <option>Internship Application</option>
                            <option>Job Application</option>
                            <option>Scholarship Application</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Deadline</label>
                        <input type="date" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Additional Notes</label>
                        <textarea style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; height: 80px;" placeholder="Any specific points to highlight?"></textarea>
                    </div>
                    <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="font-size: 14px; color: #4a5568;"><strong>Note:</strong> Your achievements and projects will be automatically included in the request.</p>
                    </div>
                    <button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Send Request</button>
                </form>
            `;
            break;
            
        case 'apply':
            content = `
                <h2>Apply for Co-op Position</h2>
                <p style="color: #718096; margin-bottom: 20px;">Apply for upcoming co-op opportunities</p>
                <form>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Select Stream</label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;">
                            <option>Summer 2025 - Technology Stream</option>
                            <option>Summer 2025 - Business Stream</option>
                            <option>Fall 2025 - Marketing Stream</option>
                            <option>Fall 2025 - Data Analytics Stream</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Preferred Companies (Select up to 3)</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label><input type="checkbox"> TechCorp</label>
                            <label><input type="checkbox"> StartupXYZ</label>
                            <label><input type="checkbox"> DataCo</label>
                            <label><input type="checkbox"> InnovateCo</label>
                            <label><input type="checkbox"> MarketPro</label>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Why do you want to join this co-op?</label>
                        <textarea style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; height: 100px;" placeholder="Tell us about your motivation and goals"></textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Resume</label>
                        <div style="background: #f7fafc; padding: 15px; border-radius: 10px; border: 2px dashed #e2e8f0; text-align: center;">
                            <p style="color: #718096;">📄 Your current resume on file</p>
                            <button type="button" style="margin-top: 10px; padding: 5px 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">Update Resume</button>
                        </div>
                    </div>
                    <button type="submit" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer;">Submit Application</button>
                </form>
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
            alert('Form submitted successfully! (Demo)');
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

// Animate progress bars on load
window.addEventListener('load', () => {
    // Animate all progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 100);
    
    // Add hover effects to cards
    addCardHoverEffects();
    
    // Initialize filter buttons
    initializeFilterButtons();
});

// Add hover effects to interactive cards
function addCardHoverEffects() {
    // Add click feedback to cards
    const clickableCards = document.querySelectorAll('.task-item, .article-item, .connection-card, .job-item');
    clickableCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// Initialize filter buttons functionality
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically filter the content
            // For demo purposes, we're just changing the active state
            console.log('Filter applied: ' + this.textContent);
        });
    });
}

// Simulate notification updates
function updateNotifications() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        setInterval(() => {
            const count = Math.floor(Math.random() * 10);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }, 30000); // Update every 30 seconds
    }
}

// Initialize notifications
updateNotifications();

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simulate real-time updates for demonstration
function simulateRealTimeUpdates() {
    // Update task count periodically
    setInterval(() => {
        const taskCount = document.querySelector('.stat-value');
        if (taskCount && Math.random() > 0.7) {
            const currentCount = parseInt(taskCount.textContent);
            taskCount.textContent = currentCount + 1;
        }
    }, 60000); // Update every minute
}

// Initialize real-time updates
simulateRealTimeUpdates();

// Handle search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Here you would implement actual search functionality
            console.log('Searching for: ' + searchTerm);
        });
    }
});

// Mobile menu toggle (for responsive design)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Print current date for demo
console.log('IMI Student Dashboard loaded successfully');
console.log('Current date:', new Date().toLocaleDateString());