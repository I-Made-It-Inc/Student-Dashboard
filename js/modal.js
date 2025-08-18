function getProfileModalContent() {
    return `
        <h2>Edit Your Profile</h2>
        <p style="color: #666; margin-bottom: 20px;">Update your public profile and interests</p>
        <form id="profile-form">
            <div class="form-group">
                <label>Display Name</label>
                <input type="text" value="Jane Doe" class="form-input">
            </div>
            <div class="form-group">
                <label>Bio</label>
                <textarea class="form-textarea" placeholder="Tell others about yourself...">High school student passionate about technology and sustainability. Currently exploring AI applications in environmental solutions.</textarea>
            </div>
            <div class="form-group">
                <label>Interests (for peer matching)</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" checked> Machine Learning</label>
                    <label><input type="checkbox" checked> Sustainability</label>
                    <label><input type="checkbox"> Marketing</label>
                    <label><input type="checkbox" checked> Data Science</label>
                    <label><input type="checkbox"> UX Design</label>
                    <label><input type="checkbox"> Finance</label>
                </div>
            </div>
            <div class="form-group">
                <label>LinkedIn Profile</label>
                <input type="url" placeholder="https://linkedin.com/in/..." class="form-input">
            </div>
            <div class="form-group">
                <label>Portfolio Website</label>
                <input type="url" placeholder="https://..." class="form-input">
            </div>
            <div class="button-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Profile</button>
            </div>
        </form>
    `;
}

function getAddConnectionModalContent() {
    return `
        <h2>Add New Connection</h2>
        <p style="color: #666; margin-bottom: 20px;">Record details about your professional connection</p>
        <form id="add-connection-form">
            <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Full name" class="form-input">
            </div>
            <div class="form-group">
                <label>Title & Company</label>
                <input type="text" placeholder="e.g., CEO at TechCorp" class="form-input">
            </div>
            <div class="form-group">
                <label>How did you meet?</label>
                <textarea class="form-textarea" placeholder="e.g., Met at Q3 networking event, discussed AI in healthcare..."></textarea>
            </div>
            <div class="form-group">
                <label>Key Topics Discussed</label>
                <input type="text" placeholder="e.g., AI, Product Strategy, Mentorship" class="form-input">
            </div>
            <div class="form-group">
                <label>Upload Photos</label>
                <div class="photo-upload-area">
                    <p>📷 Drop photos here or click to browse</p>
                    <input type="file" multiple accept="image/*" style="display: none;">
                </div>
            </div>
            <div class="form-group">
                <label><input type="checkbox"> Can provide reference letter</label>
            </div>
            <div class="button-group">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Connection</button>
            </div>
        </form>
    `;
}

function getConnectionDetailModalContent() {
    return `
        <h2>Michael Smith</h2>
        <p style="color: #666; margin-bottom: 20px;">CEO at TechCorp</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Connection Notes</h4>
            <p style="color: #666; line-height: 1.6;">Met at Q3 networking event on September 15, 2024. Had an engaging discussion about AI applications in healthcare. Michael showed interest in my project on predictive analytics for patient care. He offered to mentor me on product strategy and scaling technology solutions.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Key Topics</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span class="tag">AI in Healthcare</span>
                <span class="tag">Product Strategy</span>
                <span class="tag">Mentorship</span>
                <span class="tag">Scaling Solutions</span>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">Photos from Events</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div style="background: #e0e0e0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
                <div style="background: #e0e0e0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
                <div style="background: #e0e0e0; border-radius: 8px; padding: 30px; text-align: center;">📷</div>
            </div>
        </div>
        
        <div class="button-group">
            <button class="btn btn-primary">Request Reference</button>
            <button class="btn btn-secondary">Send Message</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
}

function getPerplexityTrainingModalContent() {
    return `
        <h2>Perplexity AI Training Guide</h2>
        <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 15px;">Getting Started with Perplexity</h3>
            
            <div class="training-section">
                <h4>1. Basic Search Queries</h4>
                <p>Learn how to formulate effective search queries to get accurate, sourced information. Perplexity excels at providing citations and multiple perspectives.</p>
            </div>
            
            <div class="training-section">
                <h4>2. Focus Modes</h4>
                <ul>
                    <li><strong>Web:</strong> Search across the entire internet</li>
                    <li><strong>Academic:</strong> Focus on scholarly articles</li>
                    <li><strong>Writing:</strong> Get help with content creation</li>
                    <li><strong>Wolfram|Alpha:</strong> For computational queries</li>
                </ul>
            </div>
            
            <div class="training-section">
                <h4>3. Best Practices</h4>
                <ul>
                    <li>Use specific, detailed queries</li>
                    <li>Ask follow-up questions to dive deeper</li>
                    <li>Verify important information with citations</li>
                    <li>Use collections to organize research</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary">Watch Video Tutorial</button>
                <button class="btn btn-secondary">Download PDF Guide</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

function getGeminiTrainingModalContent() {
    return `
        <h2>Google Gemini Training Guide</h2>
        <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 15px;">Mastering Gemini for Projects</h3>
            
            <div class="training-section">
                <h4>1. Creative Content Generation</h4>
                <p>Use Gemini for brainstorming, creative writing, and generating marketing content. Learn prompt engineering for better outputs.</p>
            </div>
            
            <div class="training-section">
                <h4>2. Code Assistance</h4>
                <p>Get help with coding projects, debugging, and understanding complex algorithms. Gemini can explain code in simple terms.</p>
            </div>
            
            <div class="training-section">
                <h4>3. Multimodal Capabilities</h4>
                <p>Upload images for analysis, generate visuals from descriptions, and work with multiple types of content simultaneously.</p>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary">Start Interactive Tutorial</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

function getNotebookTrainingModalContent() {
    return `
        <h2>NotebookLM Training Guide</h2>
        <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 15px;">Organize Your Research with NotebookLM</h3>
            
            <div class="training-section">
                <h4>1. Document Upload & Analysis</h4>
                <p>Upload PDFs, Google Docs, and other documents. NotebookLM will analyze and help you understand complex materials.</p>
            </div>
            
            <div class="training-section">
                <h4>2. AI-Powered Note Taking</h4>
                <p>Generate summaries, key points, and study guides from your uploaded materials automatically.</p>
            </div>
            
            <div class="training-section">
                <h4>3. Citation Management</h4>
                <p>Keep track of sources and generate proper citations for your research projects.</p>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary">Access Training Materials</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

// Setup modal-specific handlers
function setupModalHandlers(type) {
    const form = document.querySelector('#modal-body form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            window.IMI.utils.showNotification('Changes saved successfully!', 'success');
            closeModal();
        });
    }
    
    // Handle photo upload for connections
    if (type === 'add-connection') {
        const uploadArea = document.querySelector('.photo-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('click', function() {
                const fileInput = this.querySelector('input[type="file"]');
                if (fileInput) fileInput.click();
            });
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Export functions
window.openModal = openModal;
window.closeModal = closeModal;
window.initializeModal = initializeModal;