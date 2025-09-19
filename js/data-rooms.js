// js/data-rooms.js - Virtual Data Rooms Management
// This file uses existing modal and toast systems to avoid conflicts

// Sample data - in production this would come from an API
let dataRooms = [
    {
        id: 'tech-roles',
        name: 'Tech Roles Portfolio',
        description: 'Portfolio tailored for software engineering and data science roles',
        privacy: 'public',
        industry: ['Technology'],
        customMessage: 'Welcome to my tech portfolio! I\'m passionate about AI/ML and full-stack development. Feel free to explore my projects and achievements below.',
        sectionOrder: ['resumes', 'projects', 'certificates', 'references'], // Custom section order
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Resume_2024.pdf', permission: 'download', selected: true },
            { id: 'resume-2', category: 'resumes', name: 'Jane_Doe_Tech_Resume.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'AWS_Cloud_Practitioner.pdf', permission: 'view', selected: true },
            { id: 'cert-2', category: 'certificates', name: 'Google_Data_Analytics.pdf', permission: 'view', selected: true },
            { id: 'cert-3', category: 'certificates', name: 'Microsoft_AI_Fundamentals.pdf', permission: 'view', selected: true },
            { id: 'ref-1', category: 'references', name: 'Reference_TechCorp_CEO.pdf', permission: 'view', selected: true },
            { id: 'ref-2', category: 'references', name: 'Reference_Professor_Smith.pdf', permission: 'view', selected: true },
            { id: 'proj-1', category: 'projects', name: 'ML_Sentiment_Analysis_Project.pdf', permission: 'download', selected: true },
            { id: 'proj-2', category: 'projects', name: 'React_Dashboard_Portfolio.pdf', permission: 'download', selected: true },
            { id: 'proj-3', category: 'projects', name: 'Data_Pipeline_Architecture.pdf', permission: 'download', selected: true }
        ],
        stats: {
            views: 47,
            uniqueVisitors: 23,
            downloads: 12,
            printAttempts: 3
        },
        createdAt: '2024-11-20',
        updatedAt: '2024-12-08'
    },
    {
        id: 'finance-roles',
        name: 'Finance & Consulting',
        description: 'Focused on finance, consulting, and business strategy positions',
        privacy: 'request',
        industry: ['Finance', 'Consulting'],
        customMessage: '',
        sectionOrder: ['resumes', 'projects', 'certificates', 'references'],
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Finance_Resume.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'CFA_Level_I.pdf', permission: 'view', selected: true },
            { id: 'cert-2', category: 'certificates', name: 'Financial_Modeling_Certificate.pdf', permission: 'view', selected: true },
            { id: 'ref-1', category: 'references', name: 'Reference_Goldman_Sachs_VP.pdf', permission: 'view', selected: true },
            { id: 'proj-1', category: 'projects', name: 'Investment_Portfolio_Analysis.pdf', permission: 'view', selected: true }
        ],
        stats: {
            views: 23,
            uniqueVisitors: 15,
            downloads: 8,
            printAttempts: 1
        },
        createdAt: '2024-11-15',
        updatedAt: '2024-12-05'
    },
    {
        id: 'research-roles',
        name: 'Research & Academia',
        description: 'Materials for research internships and academic programs',
        privacy: 'private',
        industry: ['Research', 'Education'],
        customMessage: 'Focused on advancing AI research and academic excellence.',
        sectionOrder: ['resumes', 'projects', 'certificates', 'references'],
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Academic_Resume.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'Science_Fair_First_Place.jpg', permission: 'view', selected: true },
            { id: 'cert-2', category: 'certificates', name: 'Research_Excellence_Award.pdf', permission: 'view', selected: true },
            { id: 'ref-1', category: 'references', name: 'Reference_Professor_Johnson.pdf', permission: 'view', selected: true },
            { id: 'ref-2', category: 'references', name: 'Reference_Research_Supervisor.pdf', permission: 'view', selected: true },
            { id: 'proj-1', category: 'projects', name: 'Neural_Network_Research_Paper.pdf', permission: 'download', selected: true },
            { id: 'proj-2', category: 'projects', name: 'Lab_Research_Portfolio.pdf', permission: 'view', selected: true }
        ],
        stats: {
            views: 12,
            uniqueVisitors: 8,
            downloads: 5,
            printAttempts: 0
        },
        createdAt: '2024-11-10',
        updatedAt: '2024-11-28'
    }
];

// Document library - represents documents uploaded to profile (synced with profile page)
let documentLibrary = {
    resumes: [
        { id: 'resume-1', name: 'Jane_Doe_Resume_2024.pdf', uploadDate: '2024-12-01', size: '1.2 MB' }
    ],
    projects: [
        { id: 'proj-1', name: 'ML_Sentiment_Analysis_Project.pdf', uploadDate: '2024-11-25', size: '4.2 MB' },
        { id: 'proj-2', name: 'React_Dashboard_Portfolio.pdf', uploadDate: '2024-11-20', size: '3.1 MB' }
    ],
    certificates: [
        { id: 'cert-1', name: 'AWS_Cloud_Practitioner.pdf', uploadDate: '2024-11-15', size: '856 KB' },
        { id: 'cert-2', name: 'Science_Fair_First_Place.jpg', uploadDate: '2024-06-10', size: '2.1 MB' }
    ],
    references: [
        { id: 'ref-1', name: 'Reference_TechCorp_CEO.pdf', uploadDate: '2024-12-05', size: '623 KB' }
    ]
};

// Current room being edited
let currentEditingRoom = null;

// Access requests data - persistent state
let accessRequests = [
    {
        id: 'req-1',
        name: 'Sarah Johnson',
        title: 'Senior Recruiter at Microsoft',
        email: 's.johnson@microsoft.com',
        room: 'tech-roles',
        roomName: 'Tech Roles Portfolio',
        message: 'Hi! I\'m interested in reviewing your portfolio for our Software Engineering internship program. We have several openings that align with your background.',
        timestamp: '2 hours ago',
        status: 'pending' // 'pending', 'approved', 'denied'
    },
    {
        id: 'req-2',
        name: 'David Chen',
        title: 'Engineering Manager at Google',
        email: 'dchen@google.com',
        room: 'tech-roles',
        roomName: 'Tech Roles Portfolio',
        message: 'Your background looks interesting for our team. Would love to review your projects and experience.',
        timestamp: '5 hours ago',
        status: 'pending'
    },
    {
        id: 'req-3',
        name: 'Emily Thompson',
        title: 'VP Talent Acquisition at Goldman Sachs',
        email: 'emily.thompson@gs.com',
        room: 'finance-roles',
        roomName: 'Finance & Consulting',
        message: 'We\'re recruiting for our summer analyst program. Your profile matches what we\'re looking for in quantitative finance roles.',
        timestamp: '1 day ago',
        status: 'pending'
    }
];

// Initialize data rooms page
function initializeDataRooms() {
    console.log('Initializing data rooms...');
    loadDataRooms();
    updateRoomStats();
    loadRecentActivity();
}

// Load and display data rooms
function loadDataRooms() {
    const roomsList = document.getElementById('rooms-list');
    if (!roomsList) return;

    roomsList.innerHTML = '';

    dataRooms.forEach(room => {
        const roomElement = createRoomElement(room);
        roomsList.appendChild(roomElement);
    });
}

// Create room element
function createRoomElement(room) {
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-item';
    roomDiv.setAttribute('data-room-id', room.id);

    const statusClass = room.privacy === 'public' ? 'status-public' :
                       room.privacy === 'request' ? 'status-request' : 'status-private';
    const statusText = room.privacy === 'public' ? 'Public' :
                      room.privacy === 'request' ? 'Request Access' : 'Private';

    roomDiv.innerHTML = `
        <div class="room-info">
            <div class="room-header">
                <h4 class="room-name" onclick="viewDataRoomActivity('${room.id}')">${room.name}</h4>
            </div>
            <p class="room-description">${room.description}</p>
            <div class="room-meta">
                <span class="meta-item">📄 ${room.documents.filter(d => d.selected).length} documents</span>
                <span class="meta-item">👀 ${room.stats.views} views</span>
                <span class="meta-item">📅 Updated ${formatDate(room.updatedAt)}</span>
            </div>
        </div>
        <div class="room-privacy">
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="room-actions">
            <button class="btn-icon btn-primary" onclick="previewDataRoom('${room.id}')" title="Preview">👁️ Preview</button>
            <button class="btn-icon" onclick="editDataRoom('${room.id}')" title="Edit">✏️ Edit</button>
            <button class="btn-icon" onclick="shareDataRoom('${room.id}')" title="Share">🔗 Share</button>
            <button class="btn-icon" onclick="viewDataRoomAnalytics('${room.id}')" title="Analytics">📊 Analytics</button>
        </div>
    `;

    return roomDiv;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Create new room
function createNewDataRoom() {
    const modalContent = `
        <h2>Create New Data Room</h2>
        <div style="margin: 20px 0;">
            <form id="create-data-room-form">
                <div class="form-group">
                    <label>Room Name *</label>
                    <input type="text" class="form-input" placeholder="e.g., Software Engineering Portfolio" required>
                    <small class="help-text">Choose a descriptive name for your data room</small>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-textarea" rows="3" placeholder="Brief description of this portfolio's purpose and target roles..."></textarea>
                </div>

                <div class="form-group">
                    <label>Privacy Setting *</label>
                    <select class="form-select" required>
                        <option value="">Select privacy level</option>
                        <option value="public">🌐 Public - Anyone with the link can view</option>
                        <option value="request">🔑 Request Access - Viewers must request permission</option>
                        <option value="private">🔒 Private - Only you can access</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Industry Focus</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label"><input type="checkbox"> Technology</label>
                        <label class="checkbox-label"><input type="checkbox"> Finance</label>
                        <label class="checkbox-label"><input type="checkbox"> Healthcare</label>
                        <label class="checkbox-label"><input type="checkbox"> Consulting</label>
                        <label class="checkbox-label"><input type="checkbox"> Research</label>
                        <label class="checkbox-label"><input type="checkbox"> Marketing</label>
                        <label class="checkbox-label"><input type="checkbox"> Education</label>
                        <label class="checkbox-label"><input type="checkbox"> Other</label>
                    </div>
                </div>

                <div class="button-group">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Room</button>
                </div>
            </form>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Create New Data Room', modalContent);

    // Setup form handler
    const form = document.getElementById('create-data-room-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateDataRoom(this);
        });
    }
}

// Handle create room form submission
function handleCreateDataRoom(form) {
    const roomData = {
        id: generateRoomId(),
        name: form.querySelector('input[type="text"]').value,
        description: form.querySelector('textarea').value,
        privacy: form.querySelector('select').value,
        industry: Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.closest('label').textContent.trim()),
        documents: [],
        stats: {
            views: 0,
            uniqueVisitors: 0,
            downloads: 0,
            printAttempts: 0
        },
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
    };

    // Add the new room
    dataRooms.unshift(roomData);

    // Refresh the display
    loadDataRooms();
    updateRoomStats();

    // Close modal and show success message using existing toast system
    closeModal();
    if (window.showToast) {
        window.showToast('Room created successfully!', 'success');
    }

    // Automatically open edit mode for the new room
    setTimeout(() => editDataRoom(roomData.id), 500);
}

// Generate unique room ID
function generateRoomId() {
    return 'room-' + Date.now();
}

// Preview room
function previewDataRoom(roomId) {
    console.log('🔍 PREVIEW FUNCTION CALLED with roomId:', roomId);

    const room = dataRooms.find(r => r.id === roomId);
    if (!room) {
        console.error('❌ Room not found:', roomId);
        return;
    }

    console.log('✅ Room found:', room.name);
    console.log('📍 Current location hash:', window.location.hash);

    // Navigate to preview mode
    const newHash = `#data-room-preview/${roomId}`;
    console.log('🔄 Setting hash to:', newHash);
    window.location.hash = newHash;

    console.log('📍 Hash after setting:', window.location.hash);

    // Also call the preview function directly as fallback
    console.log('⏳ Setting up direct call fallback...');
    setTimeout(() => {
        console.log('🚀 Executing direct call fallback');
        if (typeof window.showDataRoomPreview === 'function') {
            console.log('✅ showDataRoomPreview function exists, calling it...');
            window.showDataRoomPreview(roomId, true);
        } else {
            console.error('❌ showDataRoomPreview function not found on window object');
        }
    }, 100);
}

// Edit room
function editDataRoom(roomId) {
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    // Check if we're currently in preview mode and exit it first
    const previewContainer = document.getElementById('data-room-preview-container');
    if (previewContainer && previewContainer.style.display !== 'none') {
        console.log('🔄 Exiting preview mode before opening edit modal...');
        if (typeof window.exitPreviewMode === 'function') {
            window.exitPreviewMode();
        } else {
            // Fallback: manually exit preview mode
            previewContainer.style.display = 'none';
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.style.display = '';
            }
        }
    }

    currentEditingRoom = roomId;

    const modalContent = `
        <h2>Edit: ${room.name}</h2>
        <div style="margin: 20px 0;">
            <div class="edit-room-layout">
                <!-- Room Settings -->
                <div class="edit-room-settings">
                    <h4>Room Settings</h4>
                    <form id="edit-data-room-form">
                        <div class="form-group">
                            <label>Room Name</label>
                            <input type="text" class="form-input" id="edit-room-name" value="${room.name}" required>
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-textarea" rows="3" id="edit-room-description">${room.description}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Privacy Setting</label>
                            <select class="form-select" id="edit-room-privacy" required>
                                <option value="public" ${room.privacy === 'public' ? 'selected' : ''}>🌐 Public</option>
                                <option value="request" ${room.privacy === 'request' ? 'selected' : ''}>🔑 Request Access</option>
                                <option value="private" ${room.privacy === 'private' ? 'selected' : ''}>🔒 Private</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Custom Message for Viewers</label>
                            <textarea class="form-textarea" rows="2" id="edit-room-message" placeholder="Optional welcome message for people viewing this room...">${room.customMessage || ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Section Order</label>
                            <div class="section-order-container" id="section-order-list">
                                ${generateSectionOrderHTML(room)}
                            </div>
                            <small class="help-text">Drag to reorder how sections appear in your data room</small>
                        </div>
                    </form>
                </div>

                <!-- Document Selection -->
                <div class="edit-room-documents" id="data-room-documents-section">
                    <h4>Select Documents</h4>
                    <div class="document-categories" id="document-categories">
                        ${generateDocumentSelection(room)}
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn-danger-small" onclick="deleteDataRoom()">Delete Room</button>
                <div class="action-group">
                    <button type="button" class="btn-secondary-blue-small" onclick="previewDataRoom('${roomId}')">Preview</button>
                    <button type="button" class="btn-secondary-blue-small" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn-primary-small" onclick="handleSaveDataRoom()">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Edit Data Room', modalContent);

    // Initialize drag and drop functionality
    setTimeout(initializeSectionDragDrop, 100);
}

// Generate section order HTML based on room configuration
function generateSectionOrderHTML(room) {
    const sectionMeta = {
        resumes: { name: '📋 Resumes' },
        certificates: { name: '🏆 Certificates' },
        references: { name: '📝 References' },
        projects: { name: '💼 Projects' }
    };

    const sectionOrder = room.sectionOrder || ['resumes', 'projects', 'certificates', 'references'];

    return sectionOrder.map(sectionKey => {
        const meta = sectionMeta[sectionKey];
        if (!meta) return '';

        return `
            <div class="draggable-section" draggable="true" data-section="${sectionKey}">
                <span class="drag-handle">⋮⋮</span>
                <span class="section-name">${meta.name}</span>
            </div>
        `;
    }).join('');
}

// Generate document selection HTML
function generateDocumentSelection(room) {
    return Object.entries(documentLibrary).map(([category, documents]) => {
        const categoryIcon = getCategoryIcon(category);
        const categoryTitle = getCategoryTitle(category);

        return `
            <div class="document-category">
                <h5>${categoryIcon} ${categoryTitle}</h5>
                <div class="document-list">
                    ${documents.map(doc => {
                        const roomDoc = room.documents.find(d => d.id === doc.id);
                        const isSelected = roomDoc?.selected || false;
                        const permission = roomDoc?.permission || 'view';

                        const currentDescription = roomDoc?.description || '';

                        return `
                            <div class="document-item ${isSelected ? 'selected' : ''}">
                                <label class="document-header">
                                    <input type="checkbox" ${isSelected ? 'checked' : ''} data-doc-id="${doc.id}" onchange="toggleDocumentSelection('${doc.id}')">
                                    <span class="doc-icon">${getDocumentIcon(doc.name)}</span>
                                    <div class="doc-info">
                                        <span class="doc-name">${doc.name}</span>
                                    </div>
                                </label>
                                <div class="document-options ${isSelected ? 'visible' : ''}">
                                    <div class="doc-permissions-row">
                                        <label for="perm-${doc.id}">Access Level:</label>
                                        <select id="perm-${doc.id}" class="permission-select" data-doc-id="${doc.id}" onchange="updateDocumentPermission('${doc.id}', this.value)">
                                            <option value="view" ${permission === 'view' ? 'selected' : ''}>View Only</option>
                                            <option value="download" ${permission === 'download' ? 'selected' : ''}>Download</option>
                                        </select>
                                    </div>
                                    <div class="doc-description-row">
                                        <label for="desc-${doc.id}">Custom Description for this Room:</label>
                                        <textarea
                                            id="desc-${doc.id}"
                                            class="doc-description-input"
                                            data-doc-id="${doc.id}"
                                            onchange="updateDocumentDescription('${doc.id}', this.value)"
                                            rows="1">${currentDescription}</textarea>
                                        <small class="help-text">This description will only appear in this data room</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        resumes: '📋',
        certificates: '🏆',
        references: '📝',
        projects: '💼'
    };
    return icons[category] || '📄';
}

// Get category title
function getCategoryTitle(category) {
    const titles = {
        resumes: 'Resumes',
        certificates: 'Certificates',
        references: 'References',
        projects: 'Projects'
    };
    return titles[category] || category;
}

// Get document icon based on file extension
function getDocumentIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
    if (['doc', 'docx'].includes(ext)) return '📝';
    return '📄';
}

// Initialize section drag and drop
function initializeSectionDragDrop() {
    const container = document.getElementById('section-order-list');
    if (!container) return;

    let draggedElement = null;

    // Add event listeners to all draggable sections
    const draggables = container.querySelectorAll('.draggable-section');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        draggable.addEventListener('dragover', handleDragOver);
        draggable.addEventListener('drop', handleDrop);
        draggable.addEventListener('dragenter', handleDragEnter);
        draggable.addEventListener('dragleave', handleDragLeave);
    });

    // Add container-level handlers for gaps between elements
    container.addEventListener('dragover', handleContainerDragOver);
    container.addEventListener('drop', handleContainerDrop);

    function handleDragStart(e) {
        draggedElement = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        draggables.forEach(draggable => {
            draggable.classList.remove('drag-over');
        });
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';

        draggables.forEach(draggable => {
            if (draggable !== draggedElement) {
                draggable.classList.remove('drag-over');
            }
        });

        if (this !== draggedElement) {
            this.classList.add('drag-over');
        }

        return false;
    }

    function handleDragEnter(e) {
        // Handled in dragOver
    }

    function handleDragLeave(e) {
        // Handled in dragOver
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (draggedElement !== this) {
            const rect = this.getBoundingClientRect();
            const midpoint = rect.top + (rect.height / 2);
            const insertBefore = e.clientY < midpoint;

            if (insertBefore) {
                this.parentNode.insertBefore(draggedElement, this);
            } else {
                this.parentNode.insertBefore(draggedElement, this.nextSibling);
            }

            saveSectionOrder();
        }

        // Clean up
        delete this.dataset.dropPosition;
        return false;
    }

    // Handle dragover on container (for gaps between elements)
    function handleContainerDragOver(e) {
        // Only handle if we're not over a draggable element
        if (e.target === container) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }
    }

    // Handle drop on container (for gaps between elements)
    function handleContainerDrop(e) {
        // Only handle if we're dropping on the container itself (gaps)
        if (e.target === container) {
            e.preventDefault();
            e.stopPropagation();

            // Find the closest element to insert near
            const allSections = [...container.querySelectorAll('.draggable-section:not(.dragging)')];
            let closestElement = null;
            let closestDistance = Infinity;

            allSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - e.clientY);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestElement = section;
                }
            });

            if (closestElement) {
                const rect = closestElement.getBoundingClientRect();
                if (e.clientY < rect.top) {
                    // Drop above the closest element
                    container.insertBefore(draggedElement, closestElement);
                } else {
                    // Drop below the closest element
                    container.insertBefore(draggedElement, closestElement.nextSibling);
                }
                saveSectionOrder();
            }
        }
    }
}

// Save the current section order
function saveSectionOrder() {
    const container = document.getElementById('section-order-list');
    if (!container) return;

    const sections = container.querySelectorAll('.draggable-section');
    const order = Array.from(sections).map(section => section.dataset.section);

    console.log('New section order:', order);
    // In production, this would save to the backend
}

// Handle save room changes
function handleSaveDataRoom() {
    if (!currentEditingRoom) return;

    const room = dataRooms.find(r => r.id === currentEditingRoom);
    if (!room) return;

    // Update basic info
    room.name = document.getElementById('edit-room-name').value;
    room.description = document.getElementById('edit-room-description').value;
    room.privacy = document.getElementById('edit-room-privacy').value;
    room.customMessage = document.getElementById('edit-room-message').value;
    room.updatedAt = new Date().toISOString().split('T')[0];

    // Update section order from drag-and-drop
    const sectionOrderContainer = document.getElementById('section-order-list');
    if (sectionOrderContainer) {
        const sections = sectionOrderContainer.querySelectorAll('.draggable-section');
        room.sectionOrder = Array.from(sections).map(section => section.dataset.section);
    }

    // Update document selection
    const checkboxes = document.querySelectorAll('.document-item input[type="checkbox"]');
    const permissionSelects = document.querySelectorAll('.permission-select');

    // Clear current documents
    room.documents = [];

    checkboxes.forEach(checkbox => {
        const docId = checkbox.getAttribute('data-doc-id');
        const isSelected = checkbox.checked;

        if (isSelected) {
            const permissionSelect = document.querySelector(`.permission-select[data-doc-id="${docId}"]`);
            const permission = permissionSelect ? permissionSelect.value : 'view';

            // Find the document in the library
            let docData = null;
            let category = null;

            Object.entries(documentLibrary).forEach(([cat, docs]) => {
                const doc = docs.find(d => d.id === docId);
                if (doc) {
                    docData = doc;
                    category = cat;
                }
            });

            if (docData) {
                // Get the custom description for this room
                const descriptionTextarea = document.querySelector(`textarea[data-doc-id="${docId}"]`);
                const description = descriptionTextarea ? descriptionTextarea.value.trim() : '';

                room.documents.push({
                    id: docId,
                    category: category,
                    name: docData.name,
                    permission: permission,
                    selected: true,
                    description: description
                });
            }
        }
    });

    // Refresh the display
    loadDataRooms();
    updateRoomStats();

    // Close modal and show success
    closeModal();
    if (window.showToast) {
        window.showToast('Room updated successfully!', 'success');
    }

    currentEditingRoom = null;
}

// Delete room
function deleteDataRoom() {
    if (!currentEditingRoom) return;

    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
        const roomIndex = dataRooms.findIndex(r => r.id === currentEditingRoom);
        if (roomIndex !== -1) {
            const roomName = dataRooms[roomIndex].name;
            dataRooms.splice(roomIndex, 1);

            // Refresh the display
            loadDataRooms();
            updateRoomStats();

            // Close modal and show success
            closeModal();
            if (window.showToast) {
                window.showToast(`"${roomName}" has been deleted`, 'success');
            }

            currentEditingRoom = null;
        }
    }
}

// Share room
function shareDataRoom(roomId) {
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    const modalContent = `
        <h2>Share Data Room</h2>
        <div style="margin: 20px 0;">
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
                <h4 style="margin: 0 0 12px 0; color: #042847; font-size: 14px; font-weight: 600;">🔗 Room Link</h4>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <input type="text" class="form-input" id="room-link-input" value="${window.location.origin}${window.location.pathname}#data-room/${roomId}" readonly style="flex: 1; font-family: monospace; font-size: 12px; background: #f8fafc;">
                    <button class="btn btn-outline" onclick="copyDataRoomLink()">📋 Copy</button>
                </div>
                <small style="color: #6b7280;">Anyone with this link can access your room based on your privacy settings</small>
            </div>

            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
                <h4 style="margin: 0 0 12px 0; color: #042847; font-size: 14px; font-weight: 600;">📧 Email Sharing</h4>
                <div class="form-group">
                    <label>Recipient Email(s)</label>
                    <input type="email" class="form-input" placeholder="recruiter@company.com">
                    <small class="help-text">Separate multiple emails with commas</small>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <label>Personal Message</label>
                    <textarea class="form-textarea" rows="3" placeholder="Hi! I'd like to share my professional portfolio with you..."></textarea>
                </div>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary">📧 Send Email</button>
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px 0; color: #042847; font-size: 14px; font-weight: 600;">📱 QR Code</h4>
                <div class="qr-code-container">
                    <div class="qr-placeholder">QR Code would be generated here</div>
                    <button class="btn btn-outline">⬇️ Download QR</button>
                </div>
                <small style="color: #6b7280;">Perfect for business cards and networking events</small>
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Share Data Room', modalContent);
}

// Copy room link to clipboard
function copyDataRoomLink() {
    const linkInput = document.getElementById('room-link-input');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        if (window.showToast) {
            window.showToast('Link copied to clipboard!', 'success');
        }
    }
}

// View analytics
function viewDataRoomAnalytics(roomId) {
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    const modalContent = `
        <h2>${room.name} - Analytics</h2>
        <div style="margin: 20px 0;">
            <div class="analytics-grid">
                <div class="analytics-section">
                    <h4>📊 View Statistics</h4>
                    <div class="stats-row">
                        <div class="stat-box">
                            <div class="stat-number">${room.stats.views}</div>
                            <div class="stat-label">Total Views</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${room.stats.uniqueVisitors}</div>
                            <div class="stat-label">Unique Visitors</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${room.stats.downloads}</div>
                            <div class="stat-label">Downloads</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${room.stats.printAttempts}</div>
                            <div class="stat-label">Print Attempts</div>
                        </div>
                    </div>
                </div>

                <div class="analytics-section">
                    <h4>👥 Recent Visitors</h4>
                    <div class="visitor-list">
                        <div class="visitor-item">
                            <div class="visitor-info">
                                <strong>Microsoft Recruiter</strong>
                                <span class="visitor-email">recruiter@microsoft.com</span>
                            </div>
                            <div class="visitor-activity">
                                <span class="activity-type">Viewed • Downloaded Resume</span>
                                <span class="activity-time">2 hours ago</span>
                            </div>
                        </div>
                        <div class="visitor-item">
                            <div class="visitor-info">
                                <strong>Google Talent Team</strong>
                                <span class="visitor-email">talent@google.com</span>
                            </div>
                            <div class="visitor-activity">
                                <span class="activity-type">Viewed • Left Comment</span>
                                <span class="activity-time">1 day ago</span>
                            </div>
                        </div>
                        <div class="visitor-item">
                            <div class="visitor-info">
                                <strong>Tesla HR</strong>
                                <span class="visitor-email">hr@tesla.com</span>
                            </div>
                            <div class="visitor-activity">
                                <span class="activity-type">Attempted Print</span>
                                <span class="activity-time">3 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="analytics-section">
                    <h4>📄 Document Performance</h4>
                    <div class="document-performance">
                        <div class="performance-item">
                            <span class="doc-name">Resume</span>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: 95%"></div>
                            </div>
                            <span class="performance-number">23 views</span>
                        </div>
                        <div class="performance-item">
                            <span class="doc-name">AI Certificate</span>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: 78%"></div>
                            </div>
                            <span class="performance-number">18 views</span>
                        </div>
                        <div class="performance-item">
                            <span class="doc-name">Reference Letter</span>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: 65%"></div>
                            </div>
                            <span class="performance-number">15 views</span>
                        </div>
                        <div class="performance-item">
                            <span class="doc-name">Project Portfolio</span>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: 52%"></div>
                            </div>
                            <span class="performance-number">12 views</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Room Analytics', modalContent);
}

// View room activity
function viewDataRoomActivity(roomId) {
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    if (window.showToast) {
        window.showToast(`Viewing activity for "${room.name}"`, 'info');
    }
    console.log('View room activity:', room);
}

// Update room statistics in sidebar
function updateRoomStats() {
    const totalRooms = dataRooms.length;
    const totalViews = dataRooms.reduce((sum, room) => sum + room.stats.views, 0);
    const totalRequests = 5; // This would come from API
    const totalComments = 12; // This would come from API

    const statItems = document.querySelectorAll('#data-rooms-page .stats-card .stat-value');
    if (statItems.length >= 4) {
        statItems[0].textContent = totalRooms;
        statItems[1].textContent = totalViews;
        statItems[2].textContent = totalRequests;
        statItems[3].textContent = totalComments;
    }
}

// Load recent activity
function loadRecentActivity() {
    // This would typically come from an API
    // The HTML already has sample activity data
    console.log('Recent activity loaded');
}

// Quick action functions
function manageDataRoomDocuments() {
    showPage('profile');
    if (window.showToast) {
        window.showToast('Navigate to Profile > Documents to manage your files', 'info');
    }
}

function viewAllDataRoomAnalytics() {
    if (window.showToast) {
        window.showToast('Opening comprehensive analytics dashboard...', 'info');
    }
}

function exportDataRoomData() {
    const exportData = {
        rooms: dataRooms,
        exportDate: new Date().toISOString(),
        totalStats: {
            rooms: dataRooms.length,
            totalViews: dataRooms.reduce((sum, room) => sum + room.stats.views, 0)
        }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-rooms-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showToast) {
        window.showToast('Room data exported successfully!', 'success');
    }
}

function shareMultipleDataRooms() {
    if (window.showToast) {
        window.showToast('Multi-room sharing feature coming soon!', 'info');
    }
}

// Access request functions
function viewAccessRequests() {
    // Filter only pending requests
    const pendingRequests = accessRequests.filter(req => req.status === 'pending');

    // Generate request cards from data
    const requestCardsHTML = pendingRequests.map(request => `
        <div class="request-card" data-room="${request.room}" data-request-id="${request.id}">
            <div class="request-header">
                <div class="requester-info">
                    <h4>${request.name}</h4>
                    <p class="requester-title">${request.title}</p>
                    <p class="requester-email">${request.email}</p>
                </div>
                <div class="request-time">
                    <span class="time-badge">${request.timestamp}</span>
                </div>
            </div>

            <div class="request-details">
                <div class="requested-room">
                    <span class="detail-label">Requested Room:</span>
                    <span class="room-name-tag">${request.roomName}</span>
                </div>
                <div class="request-message">
                    <p class="detail-label">Message:</p>
                    <p class="message-text">${request.message}</p>
                </div>
            </div>

            <div class="request-actions">
                <div class="time-limit-group">
                    <label>Access Duration:</label>
                    <select class="time-limit-select">
                        <option value="24h">24 hours</option>
                        <option value="3d">3 days</option>
                        <option value="7d" selected>7 days</option>
                        <option value="14d">14 days</option>
                        <option value="30d">30 days</option>
                        <option value="unlimited">Unlimited</option>
                    </select>
                </div>
                <div class="action-buttons">
                    <button class="btn-approve" onclick="approveAccessRequest('${request.id}')">✓ Approve</button>
                    <button class="btn-deny" onclick="denyAccessRequest('${request.id}')">✗ Deny</button>
                </div>
            </div>
        </div>
    `).join('');

    const modalContent = `
        <div style="margin-bottom: 24px;">
            <h2>Access Requests</h2>
        </div>

        <div style="margin: 20px 0;">
            <!-- Tabs for filtering -->
            <div class="request-tabs">
                <button class="tab-button active" onclick="filterAccessRequests('all')">All (${pendingRequests.length})</button>
                <button class="tab-button" onclick="filterAccessRequests('tech-roles')">Tech Roles (${pendingRequests.filter(r => r.room === 'tech-roles').length})</button>
                <button class="tab-button" onclick="filterAccessRequests('finance-roles')">Finance & Consulting (${pendingRequests.filter(r => r.room === 'finance-roles').length})</button>
            </div>

            <!-- Request Cards -->
            <div class="requests-container" id="access-requests-container">
                ${requestCardsHTML}
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Access Requests', modalContent);

    // Initialize proper counts after modal is rendered
    setTimeout(() => {
        updateAccessRequestCounts();
    }, 100);
}

function viewDataRoomComments() {
    const modalContent = `
        <div style="margin-bottom: 24px;">
            <h2>Comments</h2>
        </div>

        <div style="margin: 20px 0;">
            <!-- Tabs for filtering -->
            <div class="request-tabs">
                <button class="tab-button active" onclick="filterDataRoomComments('all')">All (4)</button>
                <button class="tab-button" onclick="filterDataRoomComments('tech-roles')">Tech Roles (2)</button>
                <button class="tab-button" onclick="filterDataRoomComments('finance-roles')">Finance & Consulting (1)</button>
                <button class="tab-button" onclick="filterDataRoomComments('research-roles')">Research & Academia (1)</button>
            </div>

            <!-- Comment Cards -->
            <div class="requests-container" id="comments-container">
                <!-- Tech Roles Comments -->
                <div class="comment-card" data-room="tech-roles" data-comment-id="comment-1">
                    <div class="comment-header">
                        <div class="commenter-info">
                            <h4>Sarah Johnson</h4>
                            <p class="commenter-title">Senior Recruiter at Microsoft</p>
                            <p class="commenter-email">s.johnson@microsoft.com</p>
                        </div>
                        <div class="comment-time">
                            <span class="time-badge">3 hours ago</span>
                        </div>
                    </div>

                    <div class="comment-details">
                        <div class="commented-room">
                            <span class="detail-label">Room:</span>
                            <span class="room-name-tag">Tech Roles Portfolio</span>
                            <span class="detail-label">Document:</span>
                            <span class="document-tag">Resume</span>
                        </div>
                        <div class="comment-message">
                            <p class="message-text">Impressive background in machine learning! Your experience with neural networks aligns perfectly with our team's current projects. Would love to discuss this further.</p>
                        </div>
                    </div>

                    <div class="comment-actions">
                        <div class="reply-section">
                            <textarea class="reply-input" placeholder="Type your reply..." rows="2"></textarea>
                            <button class="btn-reply" onclick="replyToDataRoomComment('comment-1')">Send Reply</button>
                        </div>
                        <button class="btn-mark-read" onclick="markDataRoomCommentRead('comment-1')">Mark as Read</button>
                    </div>
                </div>

                <div class="comment-card read" data-room="tech-roles" data-comment-id="comment-2">
                    <div class="comment-header">
                        <div class="commenter-info">
                            <h4>David Chen</h4>
                            <p class="commenter-title">Engineering Manager at Google</p>
                            <p class="commenter-email">dchen@google.com</p>
                        </div>
                        <div class="comment-time">
                            <span class="time-badge">1 day ago</span>
                        </div>
                    </div>

                    <div class="comment-details">
                        <div class="commented-room">
                            <span class="detail-label">Room:</span>
                            <span class="room-name-tag">Tech Roles Portfolio</span>
                            <span class="detail-label">Document:</span>
                            <span class="document-tag">Project Portfolio</span>
                        </div>
                        <div class="comment-message">
                            <p class="message-text">The data analysis work is well-structured. Good use of visualization techniques.</p>
                        </div>
                        <div class="reply-thread">
                            <p class="reply-message"><strong>You:</strong> Thank you! I'm particularly proud of the predictive modeling section.</p>
                        </div>
                    </div>

                    <div class="comment-actions">
                        <button class="btn-follow-up" onclick="followUpDataRoomComment('comment-2')">Follow Up</button>
                    </div>
                </div>

                <!-- Finance Comments -->
                <div class="comment-card" data-room="finance-roles" data-comment-id="comment-3">
                    <div class="comment-header">
                        <div class="commenter-info">
                            <h4>Emily Thompson</h4>
                            <p class="commenter-title">VP Talent Acquisition at Goldman Sachs</p>
                            <p class="commenter-email">emily.thompson@gs.com</p>
                        </div>
                        <div class="comment-time">
                            <span class="time-badge">2 days ago</span>
                        </div>
                    </div>

                    <div class="comment-details">
                        <div class="commented-room">
                            <span class="detail-label">Room:</span>
                            <span class="room-name-tag">Finance & Consulting</span>
                            <span class="detail-label">Document:</span>
                            <span class="document-tag">Resume</span>
                        </div>
                        <div class="comment-message">
                            <p class="message-text">Strong quantitative background. Your coursework in financial modeling stands out. We'd like to move forward with an interview.</p>
                        </div>
                    </div>

                    <div class="comment-actions">
                        <div class="reply-section">
                            <textarea class="reply-input" placeholder="Type your reply..." rows="2"></textarea>
                            <button class="btn-reply" onclick="replyToDataRoomComment('comment-3')">Send Reply</button>
                        </div>
                        <button class="btn-mark-read" onclick="markDataRoomCommentRead('comment-3')">Mark as Read</button>
                    </div>
                </div>

                <!-- Research & Academia Comments -->
                <div class="comment-card" data-room="research-roles" data-comment-id="comment-4">
                    <div class="comment-header">
                        <div class="commenter-info">
                            <h4>Dr. Michael Rodriguez</h4>
                            <p class="commenter-title">Principal Research Scientist at Stanford AI Lab</p>
                            <p class="commenter-email">m.rodriguez@stanford.edu</p>
                        </div>
                        <div class="comment-time">
                            <span class="time-badge">4 hours ago</span>
                        </div>
                    </div>

                    <div class="comment-details">
                        <div class="commented-room">
                            <span class="detail-label">Room:</span>
                            <span class="room-name-tag">Research & Academia</span>
                            <span class="detail-label">Document:</span>
                            <span class="document-tag">Science Fair Certificate</span>
                        </div>
                        <div class="comment-message">
                            <p class="message-text">Impressive work on neural network optimization! Your research methodology shows great promise. We have a summer research position that would be perfect for your background in AI applications.</p>
                        </div>
                    </div>

                    <div class="comment-actions">
                        <div class="reply-section">
                            <textarea class="reply-input" placeholder="Type your reply..." rows="2"></textarea>
                            <button class="btn-reply" onclick="replyToDataRoomComment('comment-4')">Send Reply</button>
                        </div>
                        <button class="btn-mark-read" onclick="markDataRoomCommentRead('comment-4')">Mark as Read</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Comments', modalContent);

    // Initialize proper counts after modal is rendered
    setTimeout(() => {
        updateCommentCounts();
    }, 100);
}

// Supporting functions for access requests and comments modals
function filterAccessRequests(roomFilter) {
    const container = document.getElementById('access-requests-container');
    if (!container) return;

    const cards = container.querySelectorAll('.request-card');
    cards.forEach(card => {
        const cardRoom = card.getAttribute('data-room');
        if (roomFilter === 'all' || cardRoom === roomFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update active tab (only within access requests modal)
    const modal = document.getElementById('modal');
    if (modal && modal.querySelector('.tab-button[onclick*="filterAccessRequests"]')) {
        modal.querySelectorAll('.tab-button[onclick*="filterAccessRequests"]').forEach(tab => tab.classList.remove('active'));
        const activeTab = roomFilter === 'all' ?
            modal.querySelector('.tab-button[onclick="filterAccessRequests(\'all\')"]') :
            modal.querySelector(`.tab-button[onclick="filterAccessRequests('${roomFilter}')"]`);
        if (activeTab) activeTab.classList.add('active');
    }
}

function filterDataRoomComments(roomFilter) {
    const container = document.getElementById('comments-container');
    if (!container) return;

    const cards = container.querySelectorAll('.comment-card');
    cards.forEach(card => {
        const cardRoom = card.getAttribute('data-room');
        if (roomFilter === 'all' || cardRoom === roomFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update active tab (only within comments modal)
    const modal = document.getElementById('modal');
    if (modal && modal.querySelector('.tab-button[onclick*="filterDataRoomComments"]')) {
        modal.querySelectorAll('.tab-button[onclick*="filterDataRoomComments"]').forEach(tab => tab.classList.remove('active'));
        const activeTab = roomFilter === 'all' ?
            modal.querySelector('.tab-button[onclick="filterDataRoomComments(\'all\')"]') :
            modal.querySelector(`.tab-button[onclick="filterDataRoomComments('${roomFilter}')"]`);
        if (activeTab) activeTab.classList.add('active');
    }
}

function approveAccessRequest(requestId) {
    // Update the persistent state
    const request = accessRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
    }

    // Update the UI
    const card = document.querySelector(`[data-request-id="${requestId}"]`);
    if (card) {
        card.style.opacity = '0.5';
        card.style.transform = 'translateX(20px)';
        setTimeout(() => {
            card.remove();
            updateAccessRequestCounts();
        }, 300);
    }

    if (window.showToast) {
        window.showToast('Access request approved!', 'success');
    }
}

function denyAccessRequest(requestId) {
    // Update the persistent state
    const request = accessRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'denied';
    }

    // Update the UI
    const card = document.querySelector(`[data-request-id="${requestId}"]`);
    if (card) {
        card.style.opacity = '0.5';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.remove();
            updateAccessRequestCounts();
        }, 300);
    }

    if (window.showToast) {
        window.showToast('Access request denied', 'info');
    }
}

function replyToDataRoomComment(commentId) {
    const card = document.querySelector(`[data-comment-id="${commentId}"]`);
    const replyInput = card.querySelector('.reply-input');
    const replyText = replyInput.value.trim();

    if (!replyText) {
        if (window.showToast) {
            window.showToast('Please enter a reply message', 'error');
        }
        return;
    }

    replyInput.value = '';
    if (window.showToast) {
        window.showToast('Reply sent successfully!', 'success');
    }

    markDataRoomCommentRead(commentId);
}

function markDataRoomCommentRead(commentId) {
    const card = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (card) {
        card.classList.add('read');


        // Replace actions with follow-up button
        const actionsDiv = card.querySelector('.comment-actions');
        actionsDiv.innerHTML = '<button class="btn-follow-up" onclick="followUpDataRoomComment(\'' + commentId + '\')">Follow Up</button>';
    }

    if (window.showToast) {
        window.showToast('Comment marked as read', 'success');
    }
}

function followUpDataRoomComment(commentId) {
    if (window.showToast) {
        window.showToast('Follow-up feature coming soon!', 'info');
    }
}

// Update access request counts dynamically
function updateAccessRequestCounts() {
    const container = document.getElementById('access-requests-container');
    if (!container) return;

    const allCards = container.querySelectorAll('.request-card');
    const techCards = container.querySelectorAll('.request-card[data-room="tech-roles"]');
    const financeCards = container.querySelectorAll('.request-card[data-room="finance-roles"]');

    const modal = document.getElementById('modal');
    if (modal && modal.querySelector('.tab-button[onclick*="filterAccessRequests"]')) {
        const allBtn = modal.querySelector('.tab-button[onclick="filterAccessRequests(\'all\')"]');
        const techBtn = modal.querySelector('.tab-button[onclick="filterAccessRequests(\'tech-roles\')"]');
        const financeBtn = modal.querySelector('.tab-button[onclick="filterAccessRequests(\'finance-roles\')"]');

        if (allBtn) allBtn.textContent = `All (${allCards.length})`;
        if (techBtn) techBtn.textContent = `Tech Roles (${techCards.length})`;
        if (financeBtn) financeBtn.textContent = `Finance & Consulting (${financeCards.length})`;
    }
}

// Update comment counts dynamically
function updateCommentCounts() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    const allCards = container.querySelectorAll('.comment-card');
    const techCards = container.querySelectorAll('.comment-card[data-room="tech-roles"]');
    const financeCards = container.querySelectorAll('.comment-card[data-room="finance-roles"]');
    const researchCards = container.querySelectorAll('.comment-card[data-room="research-roles"]');

    const modal = document.getElementById('modal');
    if (modal && modal.querySelector('.tab-button[onclick*="filterDataRoomComments"]')) {
        const allBtn = modal.querySelector('.tab-button[onclick="filterDataRoomComments(\'all\')"]');
        const techBtn = modal.querySelector('.tab-button[onclick="filterDataRoomComments(\'tech-roles\')"]');
        const financeBtn = modal.querySelector('.tab-button[onclick="filterDataRoomComments(\'finance-roles\')"]');
        const researchBtn = modal.querySelector('.tab-button[onclick="filterDataRoomComments(\'research-roles\')"]');

        if (allBtn) allBtn.textContent = `All (${allCards.length})`;
        if (techBtn) techBtn.textContent = `Tech Roles (${techCards.length})`;
        if (financeBtn) financeBtn.textContent = `Finance & Consulting (${financeCards.length})`;
        if (researchBtn) researchBtn.textContent = `Research & Academia (${researchCards.length})`;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the data rooms page
    const dataRoomsPage = document.getElementById('data-rooms-page');
    if (dataRoomsPage && dataRoomsPage.classList.contains('active')) {
        initializeDataRooms();
    }
});

// Document selection and description functions
function toggleDocumentSelection(docId) {
    const checkbox = document.querySelector(`input[data-doc-id="${docId}"]`);
    const documentItem = checkbox.closest('.document-item');
    const optionsSection = documentItem.querySelector('.document-options');

    if (checkbox.checked) {
        documentItem.classList.add('selected');
        optionsSection.classList.add('visible');
    } else {
        documentItem.classList.remove('selected');
        optionsSection.classList.remove('visible');
    }
}

function updateDocumentPermission(docId, permission) {
    console.log(`Updated permission for ${docId}: ${permission}`);
    // Permission updates will be handled in the save function
}

function updateDocumentDescription(docId, description) {
    console.log(`Updated description for ${docId}: ${description}`);
    // Description updates will be handled in the save function
}

// Export data and functions for global use
window.dataRooms = dataRooms;
window.initializeDataRooms = initializeDataRooms;
window.createNewDataRoom = createNewDataRoom;
window.editDataRoom = editDataRoom;
window.deleteDataRoom = deleteDataRoom;
window.shareDataRoom = shareDataRoom;
window.copyDataRoomLink = copyDataRoomLink;
window.previewDataRoom = previewDataRoom;
window.viewDataRoomAnalytics = viewDataRoomAnalytics;
window.viewDataRoomActivity = viewDataRoomActivity;
window.manageDataRoomDocuments = manageDataRoomDocuments;
window.viewAllDataRoomAnalytics = viewAllDataRoomAnalytics;
window.exportDataRoomData = exportDataRoomData;
window.shareMultipleDataRooms = shareMultipleDataRooms;
window.viewAccessRequests = viewAccessRequests;
window.viewDataRoomComments = viewDataRoomComments;
window.toggleDocumentSelection = toggleDocumentSelection;
window.updateDocumentPermission = updateDocumentPermission;
window.updateDocumentDescription = updateDocumentDescription;

// Document Library Management Functions
// These functions sync profile uploads/deletions with data room document selector

function addDocumentToLibrary(category, document) {
    if (!documentLibrary[category]) {
        documentLibrary[category] = [];
    }

    // Generate unique ID if not provided
    if (!document.id) {
        document.id = category.slice(0, 4) + '-' + Date.now();
    }

    // Add to library
    documentLibrary[category].push(document);

    // Refresh any open data room edit modals to show new document
    if (currentEditingRoom) {
        refreshDocumentSelector();
    }

    console.log(`Added document to ${category}:`, document);
    return document.id;
}

function removeDocumentFromLibrary(category, documentId) {
    if (!documentLibrary[category]) {
        return false;
    }

    const index = documentLibrary[category].findIndex(doc => doc.id === documentId);
    if (index === -1) {
        return false;
    }

    // Remove from library
    const removedDocument = documentLibrary[category].splice(index, 1)[0];

    // Remove from all data rooms that reference this document
    dataRooms.forEach(room => {
        room.documents = room.documents.filter(doc => doc.id !== documentId);
    });

    // Refresh any open data room edit modals
    if (currentEditingRoom) {
        refreshDocumentSelector();
        updateSelectedDocuments();
    }

    console.log(`Removed document from ${category}:`, removedDocument);
    return true;
}

function refreshDocumentSelector() {
    // Find the document selector section in the modal
    const documentsSection = document.querySelector('#data-room-documents-section');
    if (!documentsSection) return;

    // Regenerate the document selector content
    const room = dataRooms.find(r => r.id === currentEditingRoom);
    if (!room) return;

    // Rebuild the documents section HTML
    let documentsHtml = '<h4>📄 Select Documents</h4>';

    const categories = [
        { key: 'resumes', icon: '📄', label: 'Resumes' },
        { key: 'projects', icon: '📁', label: 'Projects' },
        { key: 'certificates', icon: '🏆', label: 'Certificates' },
        { key: 'references', icon: '📝', label: 'References' }
    ];

    categories.forEach(category => {
        const docs = documentLibrary[category.key] || [];
        if (docs.length > 0) {
            documentsHtml += `
                <div class="document-category">
                    <h5>${category.icon} ${category.label}</h5>
                    <div class="document-checkboxes">
            `;

            docs.forEach(doc => {
                const isSelected = room.documents.some(d => d.id === doc.id);
                const roomDoc = room.documents.find(d => d.id === doc.id);
                const permission = roomDoc ? roomDoc.permission : 'view';

                documentsHtml += `
                    <div class="document-checkbox-item">
                        <label class="checkbox-label">
                            <input type="checkbox"
                                   data-doc-id="${doc.id}"
                                   data-category="${category.key}"
                                   data-name="${doc.name}"
                                   ${isSelected ? 'checked' : ''}
                                   onchange="toggleDocumentSelection(this)">
                            ${doc.name}
                        </label>
                        <select class="permission-select"
                                data-doc-id="${doc.id}"
                                onchange="updateDocumentPermission(this)"
                                ${!isSelected ? 'disabled' : ''}>
                            <option value="view" ${permission === 'view' ? 'selected' : ''}>View Only</option>
                            <option value="download" ${permission === 'download' ? 'selected' : ''}>Downloadable</option>
                        </select>
                    </div>
                `;
            });

            documentsHtml += `
                    </div>
                </div>
            `;
        }
    });

    documentsSection.innerHTML = documentsHtml;
}

// Export functions to window for profile.js to use
window.addDocumentToLibrary = addDocumentToLibrary;
window.removeDocumentFromLibrary = removeDocumentFromLibrary;
window.refreshDocumentSelector = refreshDocumentSelector;

// Export documentLibrary for global access
window.documentLibrary = documentLibrary;