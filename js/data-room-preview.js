// js/data-room-preview.js - Data Room Preview/External View Functionality

// Show data room preview (both preview mode and external view)
function showDataRoomPreview(roomId, isPreviewMode = false) {
    console.log('🎬 === SHOW DATA ROOM PREVIEW STARTED ===');
    console.log('📥 Input params:', { roomId, isPreviewMode });

    // Check if dataRooms is available
    console.log('🔍 Checking dataRooms availability...');
    console.log('window.dataRooms exists:', typeof window.dataRooms !== 'undefined');
    console.log('dataRooms exists:', typeof dataRooms !== 'undefined');

    if (typeof window.dataRooms === 'undefined' && typeof dataRooms === 'undefined') {
        console.error('❌ dataRooms not available. Waiting for data-rooms.js to load...');

        // Retry after a delay to allow data-rooms.js to load
        setTimeout(() => {
            if (typeof window.dataRooms !== 'undefined' || typeof dataRooms !== 'undefined') {
                console.log('✅ dataRooms now available, retrying...');
                showDataRoomPreview(roomId, isPreviewMode);
            } else {
                console.error('❌ dataRooms still not available after delay');
                showRoomNotFound();
            }
        }, 500);
        return;
    }

    // Use global dataRooms or window.dataRooms
    const roomsData = window.dataRooms || dataRooms;
    console.log('📊 Using rooms data:', roomsData ? `${roomsData.length} rooms` : 'null');

    // Find the room data
    const room = roomsData.find(r => r.id === roomId);
    console.log('🔍 Found room:', room ? room.name : 'NOT FOUND');

    if (!room) {
        console.error('❌ Room not found:', roomId);
        showRoomNotFound();
        return;
    }

    console.log('🎯 === STARTING DOM MANIPULATION ===');

    // Hide the regular dashboard container
    console.log('🔍 Looking for main container...');
    const mainContainer = document.querySelector('.container');
    console.log('Main container found:', !!mainContainer);
    console.log('Main container current display:', mainContainer ? mainContainer.style.display : 'N/A');

    if (mainContainer) {
        mainContainer.style.display = 'none';
        console.log('✅ Main container hidden');
        console.log('Main container display after hiding:', mainContainer.style.display);
    } else {
        console.error('❌ Main container not found!');
    }

    // Create or update the preview container
    console.log('🔍 Looking for existing preview container...');
    let previewContainer = document.getElementById('data-room-preview-container');
    console.log('Existing preview container found:', !!previewContainer);

    if (!previewContainer) {
        console.log('📦 Creating new preview container...');
        previewContainer = document.createElement('div');
        previewContainer.id = 'data-room-preview-container';
        document.body.appendChild(previewContainer);
        console.log('✅ Preview container created and appended to body');
    }

    console.log('📝 Generating preview HTML...');
    console.log('Preview mode:', isPreviewMode);

    try {
        // Generate the preview HTML based on mode
        if (isPreviewMode) {
            console.log('🎨 Generating preview mode HTML...');
            previewContainer.innerHTML = generatePreviewModeHTML(room);
        } else {
            console.log('🎨 Generating external view HTML...');
            previewContainer.innerHTML = generateExternalViewHTML(room);
        }
        console.log('✅ HTML generated successfully');
    } catch (error) {
        console.error('❌ Error generating HTML:', error);
        return;
    }

    // Show the preview container
    console.log('🔧 Setting preview container display...');
    console.log('Preview container current display:', previewContainer.style.display);
    console.log('Preview container computed style before:', window.getComputedStyle(previewContainer).display);

    previewContainer.style.display = 'block';

    console.log('Preview container display after setting:', previewContainer.style.display);
    console.log('Preview container computed style after:', window.getComputedStyle(previewContainer).display);
    console.log('Preview container visible:', previewContainer.offsetHeight > 0);

    console.log('🎯 === DOM MANIPULATION COMPLETE ===');

    // Initialize interactions
    initializePreviewInteractions(room, isPreviewMode);

    // Track view (only for external view)
    if (!isPreviewMode) {
        trackRoomView(room);
    }

    // Update page title
    document.title = `${room.name} - IMI Student Portfolio`;
}

// Generate HTML for preview mode (student viewing their own room)
function generatePreviewModeHTML(room) {
    const documentsHTML = generateDocumentsHTML(room, true);

    return `
        <div class="preview-wrapper preview-mode">
            <!-- Preview Mode Header -->
            <header class="preview-header">
                <div class="preview-header-content">
                    <div class="preview-brand">
                        <img src="https://imadeit.ai/wp-content/uploads/2024/12/IMI-logo.png" alt="IMI Logo" class="preview-logo">
                        <span class="preview-title">Student Portfolio Preview</span>
                    </div>
                    <div class="preview-actions">
                        <button class="btn btn-primary" onclick="exitPreviewMode()">← Exit Preview</button>
                    </div>
                </div>
            </header>

            <!-- Preview Content -->
            <main class="preview-main">
                <div class="preview-container">
                    <!-- Room Header -->
                    <div class="room-header-card">
                        <div class="room-header-top">
                            <h1 class="room-title">${room.name}</h1>
                            <span class="privacy-badge privacy-${room.privacy}">${getPrivacyLabel(room.privacy)}</span>
                        </div>
                        <p class="room-description">${room.description}</p>

                        <!-- Student Info -->
                        <div class="student-info-section">
                            <div class="student-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JaneDoe" alt="Student Avatar">
                            </div>
                            <div class="student-details">
                                <h3 class="student-name">Jane Doe</h3>
                                <p class="student-title">High School Senior • IMI Co-op Student</p>
                                <div class="student-meta">
                                    <span class="meta-item">📍 Toronto, ON</span>
                                    <span class="meta-item">📧 jane.doe@example.com</span>
                                    <span class="meta-item">💼 8 months with IMI</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="room-stats">
                            <div class="stat">
                                <span class="stat-number">${room.stats.views}</span>
                                <span class="stat-label">Views</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${room.documents.filter(d => d.selected).length}</span>
                                <span class="stat-label">Documents</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${room.stats.downloads}</span>
                                <span class="stat-label">Downloads</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${room.stats.uniqueVisitors || 0}</span>
                                <span class="stat-label">Unique Visitors</span>
                            </div>
                        </div>
                    </div>

                    <!-- Documents Section -->
                    <div class="documents-section">
                        <h2 class="section-title">Portfolio Documents</h2>
                        ${documentsHTML}
                    </div>

                    <!-- Preview Notice -->
                    <div class="preview-notice">
                        <div class="notice-icon">ℹ️</div>
                        <div class="notice-content">
                            <strong>Preview Mode:</strong> This is how your data room will appear to external viewers.
                            Interaction features are disabled in preview mode.
                        </div>
                    </div>
                </div>
            </main>

            <!-- Preview Watermark -->
            <div class="preview-watermark">PREVIEW</div>
        </div>
    `;
}

// Generate HTML for external view (recruiters/companies)
function generateExternalViewHTML(room) {
    // Check access permissions
    const hasAccess = checkRoomAccess(room);

    if (room.privacy === 'private' && !hasAccess) {
        return generatePrivateRoomHTML();
    }

    if (room.privacy === 'request' && !hasAccess) {
        return generateRequestAccessHTML(room);
    }

    // Public room or has access
    const documentsHTML = generateDocumentsHTML(room, false);

    return `
        <div class="preview-wrapper external-view">
            <!-- External View Header -->
            <header class="preview-header external">
                <div class="preview-header-content">
                    <div class="preview-brand">
                        <img src="https://imadeit.ai/wp-content/uploads/2024/12/IMI-logo.png" alt="IMI Logo" class="preview-logo">
                        <span class="preview-title">IMI Student Portfolio</span>
                    </div>
                    <div class="preview-actions">
                        <button class="btn btn-outline" onclick="printDataRoom()">🖨️ Print</button>
                        <button class="btn btn-primary" onclick="contactStudent('${room.id}')">📧 Contact Student</button>
                    </div>
                </div>
            </header>

            <!-- External Content -->
            <main class="preview-main">
                <div class="preview-container">
                    <!-- Room Header -->
                    <div class="room-header-card">
                        <div class="room-header-top">
                            <h1 class="room-title">${room.name}</h1>
                            ${room.privacy === 'request' ? '<span class="access-granted-badge">✓ Access Granted</span>' : ''}
                        </div>
                        <p class="room-description">${room.description}</p>

                        <!-- Student Info -->
                        <div class="student-info-section">
                            <div class="student-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JaneDoe" alt="Student Avatar">
                            </div>
                            <div class="student-details">
                                <h3 class="student-name">Jane Doe</h3>
                                <p class="student-title">High School Senior • IMI Co-op Student</p>
                                <div class="student-meta">
                                    <span class="meta-item">📍 Toronto, ON</span>
                                    <span class="meta-item">🎓 Expected Graduation: June 2025</span>
                                    <span class="meta-item">💼 ${room.industry.join(', ')}</span>
                                </div>
                                <div class="student-bio">
                                    <p>Passionate about technology and innovation, with hands-on experience in AI/ML projects
                                    through IMI's co-op program. Seeking opportunities to apply my skills in data analysis
                                    and software development.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Key Achievements -->
                        <div class="achievements-section">
                            <h3 class="subsection-title">Key Achievements</h3>
                            <div class="achievement-badges">
                                <div class="achievement-badge">
                                    <span class="badge-icon">🏆</span>
                                    <span class="badge-text">Top 5% IMI Student</span>
                                </div>
                                <div class="achievement-badge">
                                    <span class="badge-icon">💡</span>
                                    <span class="badge-text">3 Innovation Awards</span>
                                </div>
                                <div class="achievement-badge">
                                    <span class="badge-icon">🚀</span>
                                    <span class="badge-text">12 Completed Projects</span>
                                </div>
                                <div class="achievement-badge">
                                    <span class="badge-icon">⭐</span>
                                    <span class="badge-text">4.9/5 Company Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Documents Section -->
                    <div class="documents-section">
                        <h2 class="section-title">Portfolio Documents</h2>
                        ${documentsHTML}
                    </div>

                    <!-- Comments Section -->
                    <div class="comments-section">
                        <h2 class="section-title">Leave a Comment</h2>
                        <div class="comment-form-card">
                            <form id="comment-form" onsubmit="submitComment(event, '${room.id}')">
                                <div class="form-group">
                                    <label>Your Name *</label>
                                    <input type="text" class="form-input" placeholder="John Smith" required>
                                </div>
                                <div class="form-group">
                                    <label>Company/Organization *</label>
                                    <input type="text" class="form-input" placeholder="Microsoft" required>
                                </div>
                                <div class="form-group">
                                    <label>Email *</label>
                                    <input type="email" class="form-input" placeholder="john.smith@company.com" required>
                                </div>
                                <div class="form-group">
                                    <label>Document (Optional)</label>
                                    <select class="form-select">
                                        <option value="">General Comment</option>
                                        ${room.documents.filter(d => d.selected).map(doc =>
                                            `<option value="${doc.id}">${doc.name}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Comment *</label>
                                    <textarea class="form-textarea" rows="4" placeholder="Your feedback or questions..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Comment</button>
                            </form>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="preview-footer">
                        <p>This portfolio is powered by <a href="https://imadeit.ai" target="_blank">I Made It (IMI)</a></p>
                        <p class="footer-meta">Room created: ${formatDate(room.createdAt)} • Last updated: ${formatDate(room.updatedAt)}</p>
                    </div>
                </div>
            </main>
        </div>
    `;
}

// Generate request access HTML
function generateRequestAccessHTML(room) {
    return `
        <div class="preview-wrapper request-access-view">
            <!-- Header -->
            <header class="preview-header external">
                <div class="preview-header-content">
                    <div class="preview-brand">
                        <img src="https://imadeit.ai/wp-content/uploads/2024/12/IMI-logo.png" alt="IMI Logo" class="preview-logo">
                        <span class="preview-title">IMI Student Portfolio</span>
                    </div>
                </div>
            </header>

            <!-- Request Access Content -->
            <main class="preview-main">
                <div class="preview-container centered">
                    <div class="request-access-card">
                        <div class="lock-icon">🔒</div>
                        <h1 class="request-title">Access Required</h1>
                        <p class="request-description">This portfolio requires permission to view</p>

                        <!-- Room Preview Info -->
                        <div class="room-preview-info">
                            <h2 class="room-name">${room.name}</h2>
                            <p class="room-desc">${room.description}</p>

                            <div class="student-preview">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=JaneDoe" alt="Student" class="student-avatar-small">
                                <div class="student-preview-info">
                                    <strong>Jane Doe</strong>
                                    <span>IMI Co-op Student</span>
                                </div>
                            </div>

                            <div class="room-preview-stats">
                                <span class="preview-stat">📄 ${room.documents.filter(d => d.selected).length} Documents</span>
                                <span class="preview-stat">🏢 ${room.industry.join(', ')}</span>
                            </div>
                        </div>

                        <!-- Request Form -->
                        <form id="access-request-form" onsubmit="submitAccessRequest(event, '${room.id}')">
                            <h3>Request Access</h3>
                            <div class="form-group">
                                <label>Your Name *</label>
                                <input type="text" class="form-input" placeholder="John Smith" required>
                            </div>
                            <div class="form-group">
                                <label>Title/Position *</label>
                                <input type="text" class="form-input" placeholder="Senior Recruiter" required>
                            </div>
                            <div class="form-group">
                                <label>Company/Organization *</label>
                                <input type="text" class="form-input" placeholder="Microsoft" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" class="form-input" placeholder="john.smith@company.com" required>
                            </div>
                            <div class="form-group">
                                <label>Reason for Access *</label>
                                <textarea class="form-textarea" rows="3" placeholder="Please describe why you'd like to view this portfolio..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-large">Send Access Request</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    `;
}

// Generate private room HTML
function generatePrivateRoomHTML() {
    return `
        <div class="preview-wrapper private-room-view">
            <!-- Header -->
            <header class="preview-header external">
                <div class="preview-header-content">
                    <div class="preview-brand">
                        <img src="https://imadeit.ai/wp-content/uploads/2024/12/IMI-logo.png" alt="IMI Logo" class="preview-logo">
                        <span class="preview-title">IMI Student Portfolio</span>
                    </div>
                </div>
            </header>

            <!-- Private Room Content -->
            <main class="preview-main">
                <div class="preview-container centered">
                    <div class="private-room-card">
                        <div class="lock-icon">🔐</div>
                        <h1 class="private-title">Private Portfolio</h1>
                        <p class="private-description">This portfolio is private and cannot be accessed</p>
                        <p class="private-help">If you believe you should have access, please contact the student directly.</p>
                        <button class="btn btn-outline" onclick="window.history.back()">← Go Back</button>
                    </div>
                </div>
            </main>
        </div>
    `;
}

// Generate documents HTML based on room configuration
function generateDocumentsHTML(room, isPreviewMode) {
    const categoryMeta = {
        resumes: { title: 'Resumes', icon: '📋' },
        certificates: { title: 'Certificates', icon: '🏆' },
        references: { title: 'References', icon: '📝' },
        projects: { title: 'Projects', icon: '💼' }
    };

    // Get selected documents grouped by category
    const documentsByCategory = {};
    room.documents.filter(d => d.selected).forEach(doc => {
        if (!documentsByCategory[doc.category]) {
            documentsByCategory[doc.category] = [];
        }
        documentsByCategory[doc.category].push(doc);
    });

    // Use room's section order or default order
    const sectionOrder = room.sectionOrder || ['resumes', 'certificates', 'references', 'projects'];

    let html = '';

    // Show custom message if exists
    if (room.customMessage && room.customMessage.trim()) {
        html += `
            <div class="room-custom-message">
                <div class="message-icon">💬</div>
                <div class="message-content">
                    <p>${room.customMessage}</p>
                </div>
            </div>
        `;
    }

    html += '<div class="documents-grid">';

    // Generate sections in the specified order
    sectionOrder.forEach(categoryKey => {
        const documents = documentsByCategory[categoryKey];
        const categoryInfo = categoryMeta[categoryKey];

        if (documents && documents.length > 0 && categoryInfo) {
            html += `
                <div class="document-category-card">
                    <h3 class="category-title">
                        <span class="category-icon">${categoryInfo.icon}</span>
                        ${categoryInfo.title}
                        <span class="category-count">(${documents.length})</span>
                    </h3>
                    <div class="document-list">
            `;

            documents.forEach(doc => {
                const canDownload = doc.permission === 'download';
                const fileSize = getDocumentFileSize(doc.name);
                const fileType = getDocumentFileType(doc.name);

                const actionButton = isPreviewMode ?
                    '<button class="btn-document disabled">Preview Mode</button>' :
                    canDownload ?
                        `<button class="btn-document download" onclick="downloadDocument('${doc.id}', '${doc.name}')">⬇️ Download</button>` :
                        `<button class="btn-document view" onclick="viewDocument('${doc.id}', '${doc.name}')">👁️ View</button>`;

                html += `
                    <div class="document-item-card">
                        <div class="document-preview">
                            <div class="document-icon">${getDocumentIcon(doc.name)}</div>
                            <div class="document-thumbnail">
                                ${generateDocumentThumbnail(doc)}
                            </div>
                        </div>
                        <div class="document-info">
                            <span class="document-name">${doc.name}</span>
                            <div class="document-meta">
                                <span class="file-size">${fileSize}</span>
                                <span class="file-type">${fileType}</span>
                                <span class="permission-badge ${doc.permission}">${doc.permission === 'download' ? '⬇️ Downloadable' : '👁️ View Only'}</span>
                            </div>
                            ${generateDocumentDescription(doc)}
                        </div>
                        <div class="document-action">
                            ${actionButton}
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';

    // Show empty state if no documents selected
    if (Object.keys(documentsByCategory).length === 0) {
        html = `
            <div class="empty-documents-state">
                <div class="empty-icon">📄</div>
                <h3>No Documents Selected</h3>
                <p>This portfolio doesn't have any documents configured yet.</p>
            </div>
        `;
    }

    return html;
}

// Helper function to get document icon
function getDocumentIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
    if (['doc', 'docx'].includes(ext)) return '📝';
    return '📄';
}

// Helper function to get document-specific file size
function getDocumentFileSize(filename) {
    const sizeMap = {
        // Resumes - typically 1-2 pages
        'Jane_Doe_Resume_2024.pdf': '1.2 MB',
        'Jane_Doe_Tech_Resume.pdf': '1.1 MB',
        'Jane_Doe_Finance_Resume.pdf': '1.3 MB',
        'Jane_Doe_Academic_Resume.pdf': '1.4 MB',

        // Certificates - varies
        'AWS_Cloud_Practitioner.pdf': '856 KB',
        'Google_Data_Analytics.pdf': '934 KB',
        'Microsoft_AI_Fundamentals.pdf': '1.1 MB',
        'CFA_Level_I.pdf': '2.3 MB',
        'Financial_Modeling_Certificate.pdf': '1.8 MB',
        'Science_Fair_First_Place.jpg': '2.1 MB',
        'Research_Excellence_Award.pdf': '743 KB',

        // References - typically 1 page
        'Reference_TechCorp_CEO.pdf': '623 KB',
        'Reference_Professor_Smith.pdf': '534 KB',
        'Reference_Goldman_Sachs_VP.pdf': '687 KB',
        'Reference_Professor_Johnson.pdf': '598 KB',
        'Reference_Research_Supervisor.pdf': '612 KB',

        // Projects - varies widely
        'ML_Sentiment_Analysis_Project.pdf': '4.2 MB',
        'React_Dashboard_Portfolio.pdf': '3.1 MB',
        'Data_Pipeline_Architecture.pdf': '2.8 MB',
        'Investment_Portfolio_Analysis.pdf': '3.5 MB',
        'Neural_Network_Research_Paper.pdf': '5.1 MB',
        'Lab_Research_Portfolio.pdf': '6.3 MB'
    };

    return sizeMap[filename] || '1.5 MB';
}

// Helper function to get file type description
function getDocumentFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'PDF Document',
        'jpg': 'JPEG Image',
        'jpeg': 'JPEG Image',
        'png': 'PNG Image',
        'doc': 'Word Document',
        'docx': 'Word Document'
    };
    return typeMap[ext] || 'Document';
}

// Generate document thumbnail placeholder
function generateDocumentThumbnail(doc) {
    const ext = doc.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
        return `
            <div class="pdf-thumbnail">
                <div class="pdf-pages">
                    <div class="pdf-page"></div>
                    <div class="pdf-page"></div>
                </div>
            </div>
        `;
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
        return `
            <div class="image-thumbnail">
                <div class="image-placeholder">
                    <span class="image-icon">🖼️</span>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="doc-thumbnail">
                <div class="doc-placeholder">
                    <span class="doc-lines"></span>
                    <span class="doc-lines"></span>
                    <span class="doc-lines"></span>
                </div>
            </div>
        `;
    }
}

// Generate document description based on category and name
function generateDocumentDescription(doc) {
    const descriptions = {
        // Resumes
        'Jane_Doe_Resume_2024.pdf': 'General resume highlighting full-stack development and AI/ML experience',
        'Jane_Doe_Tech_Resume.pdf': 'Technical resume focused on software engineering and data science roles',
        'Jane_Doe_Finance_Resume.pdf': 'Finance-focused resume emphasizing quantitative analysis and modeling',
        'Jane_Doe_Academic_Resume.pdf': 'Academic CV showcasing research experience and publications',

        // Certificates
        'AWS_Cloud_Practitioner.pdf': 'Amazon Web Services Cloud Practitioner certification',
        'Google_Data_Analytics.pdf': 'Google Data Analytics Professional Certificate',
        'Microsoft_AI_Fundamentals.pdf': 'Microsoft Azure AI Fundamentals certification',
        'CFA_Level_I.pdf': 'Chartered Financial Analyst Level I certification',
        'Financial_Modeling_Certificate.pdf': 'Advanced Financial Modeling and Valuation certificate',
        'Science_Fair_First_Place.jpg': 'First place award from National Science Fair for AI research project',
        'Research_Excellence_Award.pdf': 'University Research Excellence Award for outstanding undergraduate research',

        // References
        'Reference_TechCorp_CEO.pdf': 'Letter of recommendation from TechCorp CEO highlighting leadership and technical skills',
        'Reference_Professor_Smith.pdf': 'Academic reference from Computer Science Professor Dr. Smith',
        'Reference_Goldman_Sachs_VP.pdf': 'Professional reference from Goldman Sachs Vice President',
        'Reference_Professor_Johnson.pdf': 'Research reference from AI Lab Director Professor Johnson',
        'Reference_Research_Supervisor.pdf': 'Reference letter from research project supervisor',

        // Projects
        'ML_Sentiment_Analysis_Project.pdf': 'Machine learning project analyzing social media sentiment using neural networks',
        'React_Dashboard_Portfolio.pdf': 'Full-stack web application built with React, Node.js, and MongoDB',
        'Data_Pipeline_Architecture.pdf': 'Big data processing pipeline designed for real-time analytics',
        'Investment_Portfolio_Analysis.pdf': 'Quantitative analysis of investment strategies using Python and R',
        'Neural_Network_Research_Paper.pdf': 'Research paper on novel neural network architectures for computer vision',
        'Lab_Research_Portfolio.pdf': 'Comprehensive portfolio of laboratory research projects and findings'
    };

    const description = descriptions[doc.name];
    if (description) {
        return `<div class="document-description">${description}</div>`;
    }
    return '';
}

// Helper function to get random file size (fallback)
function getFileSize() {
    const sizes = ['1.2 MB', '2.3 MB', '890 KB', '3.1 MB', '1.5 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// Helper function to get privacy label
function getPrivacyLabel(privacy) {
    const labels = {
        public: '🌐 Public',
        request: '🔑 Request Access',
        private: '🔒 Private'
    };
    return labels[privacy] || privacy;
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Check room access (simplified for demo)
function checkRoomAccess(room) {
    // In production, this would check against actual permissions
    // For demo, we'll simulate that some rooms have been granted access
    const grantedRooms = localStorage.getItem('grantedRoomAccess');
    if (grantedRooms) {
        const granted = JSON.parse(grantedRooms);
        return granted.includes(room.id);
    }
    return false;
}

// Initialize preview interactions
function initializePreviewInteractions(room, isPreviewMode) {
    // Add print detection
    if (!isPreviewMode) {
        window.addEventListener('beforeprint', () => {
            logPrintAttempt(room.id);
        });
    }

    // Add escape key handler for preview mode
    if (isPreviewMode) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                exitPreviewMode();
            }
        });
    }
}

// Exit preview mode
function exitPreviewMode() {
    // Hide preview container
    const previewContainer = document.getElementById('data-room-preview-container');
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }

    // Show main container
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.style.display = '';
    }

    // Navigate back to data rooms page
    window.location.hash = '#data-rooms';
}

// Submit access request
function submitAccessRequest(event, roomId) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        name: form.querySelector('input[placeholder="John Smith"]').value,
        title: form.querySelector('input[placeholder="Senior Recruiter"]').value,
        company: form.querySelector('input[placeholder="Microsoft"]').value,
        email: form.querySelector('input[type="email"]').value,
        reason: form.querySelector('textarea').value,
        roomId: roomId,
        timestamp: new Date().toISOString()
    };

    // In production, this would send to backend
    console.log('Access request submitted:', formData);

    // Show success message
    form.innerHTML = `
        <div class="success-message">
            <div class="success-icon">✅</div>
            <h3>Request Sent Successfully!</h3>
            <p>The student will be notified of your access request and will respond soon.</p>
            <p>You'll receive an email notification once your request is approved.</p>
        </div>
    `;

    // Optionally store request locally for demo
    const requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    requests.push(formData);
    localStorage.setItem('accessRequests', JSON.stringify(requests));
}

// Submit comment
function submitComment(event, roomId) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        name: form.querySelector('input[placeholder="John Smith"]').value,
        company: form.querySelector('input[placeholder="Microsoft"]').value,
        email: form.querySelector('input[type="email"]').value,
        document: form.querySelector('select').value,
        comment: form.querySelector('textarea').value,
        roomId: roomId,
        timestamp: new Date().toISOString()
    };

    // In production, this would send to backend
    console.log('Comment submitted:', formData);

    // Show success message
    if (window.showToast) {
        window.showToast('Comment submitted successfully!', 'success');
    }

    // Reset form
    form.reset();
}

// View document
function viewDocument(docId, docName) {
    // Track view
    console.log('Viewing document:', docName);

    // In production, this would open a document viewer
    if (window.showToast) {
        window.showToast(`Opening ${docName} for viewing...`, 'info');
    }

    // Simulate opening in new tab
    window.open(`https://example.com/view/${docId}`, '_blank');
}

// Download document
function downloadDocument(docId, docName) {
    // Track download
    console.log('Downloading document:', docName);

    // In production, this would trigger actual download
    if (window.showToast) {
        window.showToast(`Downloading ${docName}...`, 'success');
    }

    // Simulate download
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,Sample content for ${docName}`;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Contact student
function contactStudent(roomId) {
    // In production, this would open contact form or email client
    if (window.showToast) {
        window.showToast('Opening contact form...', 'info');
    }

    // For demo, could open mailto link
    window.location.href = 'mailto:jane.doe@example.com?subject=Regarding your portfolio';
}

// Print data room
function printDataRoom() {
    window.print();
}

// Log print attempt
function logPrintAttempt(roomId) {
    console.log('Print attempt logged for room:', roomId);

    // In production, this would send to backend
    const printLogs = JSON.parse(localStorage.getItem('printLogs') || '[]');
    printLogs.push({
        roomId: roomId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    localStorage.setItem('printLogs', JSON.stringify(printLogs));
}

// Track room view
function trackRoomView(room) {
    console.log('Tracking view for room:', room.id);

    // Increment view count (in production, this would be backend)
    room.stats.views++;

    // Store view log
    const viewLogs = JSON.parse(localStorage.getItem('viewLogs') || '[]');
    viewLogs.push({
        roomId: room.id,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    });
    localStorage.setItem('viewLogs', JSON.stringify(viewLogs));
}

// Show room not found
function showRoomNotFound() {
    // Hide the regular dashboard container
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }

    // Create or update the preview container
    let previewContainer = document.getElementById('data-room-preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'data-room-preview-container';
        document.body.appendChild(previewContainer);
    }

    previewContainer.innerHTML = `
        <div class="preview-wrapper not-found-view">
            <!-- Header -->
            <header class="preview-header external">
                <div class="preview-header-content">
                    <div class="preview-brand">
                        <img src="https://imadeit.ai/wp-content/uploads/2024/12/IMI-logo.png" alt="IMI Logo" class="preview-logo">
                        <span class="preview-title">IMI Student Portfolio</span>
                    </div>
                </div>
            </header>

            <!-- Not Found Content -->
            <main class="preview-main">
                <div class="preview-container centered">
                    <div class="not-found-card">
                        <div class="not-found-icon">❌</div>
                        <h1 class="not-found-title">Portfolio Not Found</h1>
                        <p class="not-found-description">The portfolio you're looking for doesn't exist or has been removed.</p>
                        <button class="btn btn-outline" onclick="window.location.hash = '#dashboard'">← Go to Dashboard</button>
                    </div>
                </div>
            </main>
        </div>
    `;

    previewContainer.style.display = 'block';
}

// Export functions for global use
console.log('📦 === EXPORTING DATA ROOM PREVIEW FUNCTIONS ===');
console.log('🔍 showDataRoomPreview function exists:', typeof showDataRoomPreview);

window.showDataRoomPreview = showDataRoomPreview;
window.exitPreviewMode = exitPreviewMode;
window.submitAccessRequest = submitAccessRequest;
window.submitComment = submitComment;
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.contactStudent = contactStudent;
window.printDataRoom = printDataRoom;

console.log('✅ showDataRoomPreview exported to window:', typeof window.showDataRoomPreview);
console.log('📦 === EXPORT COMPLETE ===');