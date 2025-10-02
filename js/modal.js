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
                    <p><i class="fa-solid fa-camera"></i> Drop photos here or click to browse</p>
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

// Connection data
const connectionData = {
    'michael-smith': {
        name: 'Michael Smith',
        title: 'CEO at TechCorp',
        avatar: 'MS',
        tags: ['Mentor', 'Reference Available'],
        notes: `Met at Q3 networking event on September 15, 2024. Had an engaging discussion about AI applications in healthcare. Michael showed interest in my project on predictive analytics for patient care. He offered to mentor me on product strategy and scaling technology solutions.`,
        followUp: 'Scheduled monthly mentorship calls. Michael provided contacts at two healthcare AI startups.',
        topics: ['AI in Healthcare', 'Product Strategy', 'Mentorship', 'Scaling Solutions'],
        photos: 3,
        eventContext: 'Tech Networking Event • Q3 2024',
        hasReference: true
    },
    'sarah-johnson': {
        name: 'Sarah Johnson',
        title: 'Marketing Director at StartupXYZ',
        avatar: 'SJ',
        tags: ['Project Supervisor'],
        notes: `Supervised my social media campaign project during my co-op at StartupXYZ. Provided excellent guidance on creative strategy and campaign optimization. Sarah gave very positive feedback on my creative approach and ability to adapt to target audience preferences.`,
        followUp: 'Completed successful 3-month project resulting in 40% increase in social media engagement.',
        topics: ['Social Media Marketing', 'Creative Strategy', 'Campaign Optimization', 'Brand Development'],
        photos: 2,
        eventContext: 'StartupXYZ Office • Summer 2024',
        hasReference: false
    },
    'jamie-wright': {
        name: 'Jamie Wright',
        title: 'Computer Science Student',
        company: 'Same University',
        avatar: 'JW',
        tags: ['Study Partner', 'Fellow Student'],
        notes: `Met during CS50 study sessions in the library. We formed a great partnership working on problem sets and the final project. Jamie is incredibly skilled at debugging and algorithm optimization. Currently job hunting together and sharing interview prep resources.`,
        followUp: 'Planning to continue collaboration on open-source projects and interview preparation.',
        topics: ['Algorithms', 'Data Structures', 'Web Development', 'Problem Solving', 'Interview Prep'],
        photos: 2,
        eventContext: 'University Library • Fall 2024',
        hasReference: false
    }
};

function openConnectionModal(connectionId) {
    console.log('Opening connection modal for:', connectionId);

    try {
        const connection = connectionData[connectionId];
        if (!connection) {
            console.error('Connection not found:', connectionId);
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification('Connection not found', 'error');
            }
            return;
        }

        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) {
            console.error('Modal elements not found');
            return;
        }

        // Set the modal content
        modalBody.innerHTML = getConnectionDetailModalContent(connection);
        
        // Show the modal using CSS classes
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        console.log('Connection modal opened for:', connection.name);
    } catch (error) {
        console.error('Error opening connection modal:', error);
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('Error opening connection details', 'error');
        }
    }
}

function getConnectionDetailModalContent(connection) {
    const isPeerConnection = connection.tags && connection.tags.includes('Fellow Student');
    
    return `
        <div class="connection-detail-modal">
            <div class="connection-detail-header">
                <div class="connection-detail-avatar">${connection.avatar}</div>
                <div class="connection-detail-info">
                    <h2>${connection.name}</h2>
                    <p class="title">${connection.title}</p>
                    <div class="connection-meta">
                        ${connection.tags.map(tag => `<span class="connection-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="btn-edit-connection" onclick="editConnection('${getConnectionIdFromName(connection.name)}')">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
            </div>
            
            <div class="connection-notes-section">
                <h3>Connection Notes</h3>
                <p>${connection.notes}</p>
                ${connection.followUp ? `<p style="margin-top: 15px;"><strong>Follow-up:</strong> ${connection.followUp}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--imi-blue); margin-bottom: 10px;">Key Topics & Expertise</h3>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${connection.topics.map(topic => 
                        `<span class="connection-tag" style="background: rgba(255, 213, 2, 0.2); border-color: var(--imi-yellow);">${topic}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: var(--imi-blue); margin-bottom: 15px;">Photos from Events</h3>
                <div class="connection-photos-grid">
                    ${Array(connection.photos).fill().map(() => '<div class="connection-photo"><i class="fa-solid fa-camera"></i></div>').join('')}
                </div>
                <p style="font-size: 12px; color: var(--text-gray); margin-top: 8px; text-align: center;">${connection.eventContext}</p>
            </div>
            
            <div class="button-group centered-buttons">
                ${isPeerConnection ?
                    `<button class="btn btn-primary" onclick="viewProfile('${connection.name}')">View Profile</button>
                     <button class="btn btn-secondary" onclick="sendMessage('${connection.name}')">Send Message</button>` :
                    `${getRequestReferenceButton(connection.name)}
                     <button class="btn ${connection.hasReference ? 'btn-secondary' : 'btn-secondary disabled'}"
                            ${connection.hasReference ? '' : 'disabled'}
                            onclick="viewReference('${connection.name}')">View Reference(s)</button>
                     <button class="btn btn-secondary" onclick="sendMessage('${connection.name}')">Send Message</button>`
                }
            </div>
        </div>
    `;
}

function getRequestReferenceButton(contactName) {
    // Ensure the state object exists
    if (!window.requestedReferences) {
        window.requestedReferences = new Set();
    }

    // Check if reference has already been requested
    const isRequested = window.requestedReferences.has(contactName);

    if (isRequested) {
        return `<button class="btn btn-primary requested" data-contact="${contactName}" disabled>Requested</button>`;
    } else {
        return `<button class="btn btn-primary" data-contact="${contactName}" onclick="requestReference('${contactName}')">Request Reference</button>`;
    }
}

function getConnectionIdFromName(name) {
    // Helper function to get connection ID from name
    for (const [id, connection] of Object.entries(connectionData)) {
        if (connection.name === name) {
            return id;
        }
    }
    return null;
}

function viewProfile(personName) {
    console.log(`Viewing profile for ${personName}`);
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Opening profile for ${personName}...`, 'info');
    }
    // Here you would typically navigate to their profile page
    closeModal();
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

function getYoungEntrepreneursModalContent() {
    return `
        <div class="course-modal">
            <div class="course-header">
                <div class="course-icon-large">
                    <img src="images/courses_Young_Entrepreneurs.png" alt="Young Entrepreneurs Course" class="course-modal-image">
                </div>
                <div class="course-info">
                    <h2>Young Entrepreneurs</h2>
                    <p class="course-subtitle">Turn curiosity into real-world literacy</p>
                    <div class="course-details">
                        <span class="course-detail-item"><i class="fa-regular fa-calendar"></i> 3 months</span>
                        <span class="course-detail-item"><i class="fa-solid fa-chalkboard-teacher"></i> Instructor-led</span>
                        <span class="course-detail-item"><i class="fa-solid fa-mobile"></i> Weekly meetings</span>
                    </div>
                </div>
            </div>
            
            <div class="course-description">
                <h3>Course Overview</h3>
                <p>Students learn how companies work, practice basic finance with a mock portfolio, and use pro-grade AI tools to research and create. This comprehensive program transforms curiosity into practical business literacy through hands-on experience and real-world applications.</p>
            </div>
            
            <div class="course-highlights">
                <h3>What You'll Learn</h3>
                <ul>
                    <li>How companies operate and generate revenue</li>
                    <li>Basic finance principles and portfolio management</li>
                    <li>Professional-grade AI tools for research and content creation</li>
                    <li>Business communication and presentation skills</li>
                    <li>Market analysis and competitive research</li>
                    <li>Entrepreneurial mindset and opportunity identification</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary" onclick="registerForCourse('young-entrepreneurs')">Register for Course</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

function getBlueOceanModalContent() {
    return `
        <div class="course-modal">
            <div class="course-header">
                <div class="course-icon-large">
                    <img src="images/courses_Blue_Ocean.png" alt="Blue Ocean Innovation Course" class="course-modal-image">
                </div>
                <div class="course-info">
                    <h2>Blue Ocean Innovation & AI Applications</h2>
                    <p class="course-subtitle">Apply Blue Ocean strategy to design ideas that create new value</p>
                    <div class="course-details">
                        <span class="course-detail-item"><i class="fa-regular fa-calendar"></i> 3 months</span>
                        <span class="course-detail-item"><i class="fa-solid fa-chalkboard-teacher"></i> Instructor-led</span>
                        <span class="course-detail-item"><i class="fa-solid fa-trophy"></i> Global challenge</span>
                    </div>
                </div>
            </div>
            
            <div class="course-description">
                <h3>Course Overview</h3>
                <p>With access to advanced AI tools, students analyze trends, prototype quickly, and team up to submit to a global innovation challenge. This program combines strategic thinking with cutting-edge technology to develop breakthrough solutions that create uncontested market spaces.</p>
            </div>
            
            <div class="course-highlights">
                <h3>What You'll Learn</h3>
                <ul>
                    <li>Blue Ocean Strategy principles and framework</li>
                    <li>Advanced AI tools for trend analysis and market research</li>
                    <li>Rapid prototyping techniques and methodologies</li>
                    <li>Team collaboration and project management</li>
                    <li>Innovation challenge preparation and submission</li>
                    <li>Value innovation and competitive differentiation</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary" onclick="registerForCourse('blue-ocean')">Register for Course</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
}

function getAIHighSchoolModalContent() {
    return `
        <div class="course-modal">
            <div class="course-header">
                <div class="course-icon-large">
                    <img src="images/courses_AI.jpg" alt="AI Application Course" class="course-modal-image">
                </div>
                <div class="course-info">
                    <h2>AI Application for High School Students</h2>
                    <p class="course-subtitle">A Practical Guide</p>
                    <div class="course-details">
                        <span class="course-detail-item"><i class="fa-solid fa-stopwatch"></i> 4 hours</span>
                        <span class="course-detail-item"><i class="fa-solid fa-bullseye"></i> Self-paced</span>
                        <span class="course-detail-item"><i class="fa-solid fa-laptop"></i> Online course</span>
                    </div>
                </div>
            </div>
            
            <div class="course-description">
                <h3>Course Overview</h3>
                <p>This fast-paced, 4-hour online course will equip you with the essential skills to leverage the power of Artificial Intelligence for academic excellence and real-world success. No prior experience with AI is needed—just a curiosity to learn and a readiness to create.</p>
            </div>
            
            <div class="course-highlights">
                <h3>What You'll Learn</h3>
                <ul>
                    <li>Essential AI tools for academic research and writing</li>
                    <li>Prompt engineering for better AI outputs</li>
                    <li>AI-assisted study techniques and note-taking</li>
                    <li>Creative applications of AI in school projects</li>
                    <li>Ethical considerations and responsible AI use</li>
                    <li>Future career opportunities in AI and technology</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button class="btn btn-primary" onclick="registerForCourse('ai-high-school')">Register for Course</button>
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

// Core modal functions
function openModal(type, title, content) {
    try {
        const modal = document.getElementById('modal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        
        let modalContent = '';
        
        // Get content based on type
        switch (type) {
            case 'profile':
                modalContent = getProfileModalContent();
                break;
            case 'add-connection':
                modalContent = getAddConnectionModalContent();
                break;
            case 'perplexity-training':
                modalContent = getPerplexityTrainingModalContent();
                break;
            case 'gemini-training':
                modalContent = getGeminiTrainingModalContent();
                break;
            case 'notebook-training':
                modalContent = getNotebookTrainingModalContent();
                break;
            case 'young-entrepreneurs-course':
                modalContent = getYoungEntrepreneursModalContent();
                break;
            case 'blue-ocean-course':
                modalContent = getBlueOceanModalContent();
                break;
            case 'ai-high-school-course':
                modalContent = getAIHighSchoolModalContent();
                break;
            default:
                modalContent = content || '<h2>Modal Content</h2>';
        }
        
        const modalBody = modal.querySelector('#modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalContent;
        }
        
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Setup handlers for this modal type
        setupModalHandlers(type);
        
        console.log(`Modal opened: ${type}`);
    } catch (error) {
        console.error('Error opening modal:', error);
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('Error opening modal', 'error');
        }
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        // Clear any inline styles that might have been set
        modal.removeAttribute('style');
        document.body.classList.remove('modal-open');

        // Clean up any data room editing state
        if (window.currentEditingRoom) {
            console.log('Clearing currentEditingRoom on modal close');
            window.currentEditingRoom = null;
        }

        // Debug: Check if user avatar is still clickable after modal close
        console.log('🔍 Modal closed, checking user avatar state...');
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            console.log('✅ User avatar element exists after modal close');
            console.log('Avatar classes:', userAvatar.className);
            console.log('Avatar style:', userAvatar.style.cssText);

            // Check for invisible overlays or blocking elements
            console.log('🔍 Checking for invisible overlays...');
            const rect = userAvatar.getBoundingClientRect();
            const elementAtCenter = document.elementFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
            console.log('Element at avatar center:', elementAtCenter);
            console.log('Is element the avatar itself?', elementAtCenter === userAvatar);

            if (elementAtCenter !== userAvatar) {
                console.log('🚨 Avatar is being blocked by:', elementAtCenter);
                console.log('Blocking element classes:', elementAtCenter?.className);
                console.log('Blocking element style:', elementAtCenter?.style.cssText);
                console.log('Blocking element z-index:', window.getComputedStyle(elementAtCenter).zIndex);
            }

            // Test and fix navigation if needed
            if (window.testAvatarNavigation) {
                setTimeout(() => window.testAvatarNavigation(), 100);
            }
        } else {
            console.error('❌ User avatar element not found after modal close');
        }
    }
}

// Global state to track requested references
window.requestedReferences = window.requestedReferences || new Set();

// Connection action functions
function requestReference(contactName) {
    console.log(`Requesting reference from "${contactName}"`);

    // Ensure the state object exists
    if (!window.requestedReferences) {
        window.requestedReferences = new Set();
    }

    // Mark this contact as having a requested reference
    window.requestedReferences.add(contactName);

    // Update the clicked button
    const button = event.target;
    if (button) {
        button.disabled = true;
        button.textContent = 'Requested';
        button.classList.add('requested');
    }

    // Find and disable ALL corresponding buttons with the same contact name
    const allReferenceButtons = document.querySelectorAll(`button[data-contact="${contactName}"]`);
    allReferenceButtons.forEach(btn => {
        if (btn.textContent.includes('Request Reference')) {
            btn.disabled = true;
            btn.textContent = 'Requested';
            btn.classList.add('requested');
        }
    });

    // Show notification
    if (window.showToast) {
        window.showToast(`Reference request sent to ${contactName}!`, 'success');
    } else if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Reference request sent to ${contactName}!`, 'success');
    }

    // Close modal if this was called from a modal
    if (document.querySelector('#modal.active')) {
        closeModal();
    }
}

function viewReference(contactName) {
    console.log(`Viewing reference from ${contactName}`);
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Opening reference letter from ${contactName}...`, 'info');
    }
    // Here you could open another modal or navigate to a reference page
    closeModal();
}

function sendMessage(contactName) {
    console.log(`Opening message to ${contactName}`);
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Opening message to ${contactName}...`, 'info');
    }
    closeModal();
}

function editConnection(connectionId) {
    console.log(`Editing connection: ${connectionId}`);
    
    // Get current connection data
    const connection = connectionData[connectionId];
    
    if (!connection) {
        console.error('Connection not found:', connectionId);
        return;
    }
    
    // Open edit modal with current connection data
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        <h2>Edit Connection</h2>
        <form id="edit-connection-form">
            <div class="form-group">
                <label for="edit-name">Name</label>
                <input type="text" id="edit-name" class="form-input" value="${connection.name}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-title">Title/Position</label>
                <input type="text" id="edit-title" class="form-input" value="${connection.title}" required>
            </div>
            
            <div class="form-group">
                <label for="edit-company">Company</label>
                <input type="text" id="edit-company" class="form-input" value="${connection.company || ''}">
            </div>
            
            <div class="form-group">
                <label for="edit-notes">Connection Notes</label>
                <textarea id="edit-notes" class="form-textarea" rows="4" placeholder="How did you meet? What did you discuss?">${connection.notes}</textarea>
            </div>
            
            <div class="form-group">
                <label for="edit-followup">Follow-up Notes</label>
                <textarea id="edit-followup" class="form-textarea" rows="2" placeholder="Next steps or follow-up actions">${connection.followUp || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Key Topics & Expertise</label>
                <div class="checkbox-group">
                    ${['AI/ML', 'Healthcare', 'Finance', 'Marketing', 'Product Management', 'Leadership', 'Sustainability', 'Entrepreneurship'].map(topic => 
                        `<label><input type="checkbox" value="${topic}" ${connection.topics.includes(topic) ? 'checked' : ''}> ${topic}</label>`
                    ).join('')}
                </div>
            </div>
            
            <div class="form-group">
                <label>Photo Upload</label>
                <div class="photo-upload-area">
                    <input type="file" multiple accept="image/*" style="display: none;">
                    <p>Click to upload photos from events</p>
                    <p style="font-size: 12px; color: var(--text-gray);">${connection.photos} photos currently stored</p>
                </div>
            </div>
            
            <div class="edit-modal-actions">
                <button type="button" class="btn btn-danger" onclick="deleteConnection('${connectionId}')" id="delete-btn">Delete Connection</button>
                <div class="action-group">
                    <button type="button" class="btn btn-secondary" onclick="openConnectionModal('${connectionId}')">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </form>
    `;
    
    // Add form submission handler
    const form = document.getElementById('edit-connection-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveConnectionChanges(connectionId);
        });
    }
    
    // Setup photo upload
    const uploadArea = document.querySelector('.photo-upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            const fileInput = this.querySelector('input[type="file"]');
            if (fileInput) fileInput.click();
        });
    }
    
}

function saveConnectionChanges(connectionId) {
    const form = document.getElementById('edit-connection-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const updatedData = {
        name: form.querySelector('#edit-name').value,
        title: form.querySelector('#edit-title').value,
        company: form.querySelector('#edit-company').value,
        notes: form.querySelector('#edit-notes').value,
        followUp: form.querySelector('#edit-followup').value,
        topics: Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value)
    };
    
    console.log('Saving connection changes:', connectionId, updatedData);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Connection updated successfully!', 'success');
    }
    
    // Here you would typically save to a database or local storage
    // After saving, return to the connection details view
    openConnectionModal(connectionId);
}

function deleteConnection(connectionId) {
    if (confirm(`Are you sure you want to delete this connection? This action cannot be undone.`)) {
        console.log('Deleting connection:', connectionId);
        
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification('Connection deleted successfully!', 'success');
        }
        
        // Here you would typically delete from database or local storage
        // For now, we'll just close the modal and show success
        closeModal();
    }
}

function registerForCourse(courseId) {
    console.log(`Registering for course: ${courseId}`);
    
    // Course registration logic
    const courseNames = {
        'young-entrepreneurs': 'Young Entrepreneurs',
        'blue-ocean': 'Blue Ocean Innovation & AI Applications',
        'ai-high-school': 'AI Application for High School Students'
    };
    
    const courseName = courseNames[courseId] || 'Selected Course';
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`Registration request submitted for ${courseName}! You will receive enrollment details via email.`, 'success');
    }
    
    // Here you would typically:
    // 1. Send registration data to server
    // 2. Create invoice for course
    // 3. Send confirmation email
    // 4. Update user's course enrollment status
    
    closeModal();
}

function initializeModal() {
    // Initialize modal functionality
    console.log('Modal system initialized');
    
    // Add ESC key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Export new functions
window.requestReference = requestReference;
window.viewReference = viewReference;
window.sendMessage = sendMessage;
window.openConnectionModal = openConnectionModal;
window.viewProfile = viewProfile;
window.deleteConnection = deleteConnection;
window.getConnectionIdFromName = getConnectionIdFromName;
window.registerForCourse = registerForCourse;

// Export functions
window.openModal = openModal;
window.closeModal = closeModal;
window.initializeModal = initializeModal;