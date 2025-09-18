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
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Resume_2024.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'AI_Course_Certificate.pdf', permission: 'view', selected: true },
            { id: 'ref-1', category: 'references', name: 'Reference_TechCorp_CEO.pdf', permission: 'view', selected: true },
            { id: 'proj-1', category: 'projects', name: 'Data_Analysis_Portfolio.pdf', permission: 'download', selected: true }
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
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Resume_2024.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'AI_Course_Certificate.pdf', permission: 'view', selected: false },
            { id: 'ref-1', category: 'references', name: 'Reference_TechCorp_CEO.pdf', permission: 'view', selected: true }
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
        documents: [
            { id: 'resume-1', category: 'resumes', name: 'Jane_Doe_Resume_2024.pdf', permission: 'download', selected: true },
            { id: 'cert-1', category: 'certificates', name: 'AI_Course_Certificate.pdf', permission: 'view', selected: true },
            { id: 'cert-2', category: 'certificates', name: 'Science_Fair_First_Place.jpg', permission: 'view', selected: true },
            { id: 'ref-1', category: 'references', name: 'Reference_TechCorp_CEO.pdf', permission: 'view', selected: true },
            { id: 'proj-2', category: 'projects', name: 'TechCorp_Marketing_Project.pdf', permission: 'view', selected: false }
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

// Sample document library - represents documents uploaded to profile
const documentLibrary = {
    resumes: [
        { id: 'resume-1', name: 'Jane_Doe_Resume_2024.pdf', uploadDate: '2024-12-01', size: '2.3 MB' }
    ],
    certificates: [
        { id: 'cert-1', name: 'AI_Course_Certificate.pdf', uploadDate: '2024-11-15', size: '1.1 MB' },
        { id: 'cert-2', name: 'Science_Fair_First_Place.jpg', uploadDate: '2024-10-20', size: '3.2 MB' }
    ],
    references: [
        { id: 'ref-1', name: 'Reference_TechCorp_CEO.pdf', uploadDate: '2024-12-05', size: '890 KB' }
    ],
    projects: [
        { id: 'proj-1', name: 'Data_Analysis_Portfolio.pdf', uploadDate: '2024-11-25', size: '4.1 MB' },
        { id: 'proj-2', name: 'TechCorp_Marketing_Project.pdf', uploadDate: '2024-11-20', size: '2.8 MB' }
    ]
};

// Current room being edited
let currentEditingRoom = null;

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
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    // In a real implementation, this would open a new window/tab
    // showing the room as a recruiter would see it
    if (window.showToast) {
        window.showToast(`Opening preview for "${room.name}"`, 'info');
    }
    console.log('Preview room:', room);
}

// Edit room
function editDataRoom(roomId) {
    const room = dataRooms.find(r => r.id === roomId);
    if (!room) return;

    currentEditingRoom = roomId;

    const modalContent = `
        <h2>Edit: ${room.name}</h2>
        <div style="margin: 20px 0;">
            <form id="edit-data-room-form">
                <div class="form-group">
                    <label>Room Name</label>
                    <input type="text" class="form-input" value="${room.name}" required>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-textarea" rows="3">${room.description}</textarea>
                </div>

                <div class="form-group">
                    <label>Privacy Setting</label>
                    <select class="form-select" required>
                        <option value="public" ${room.privacy === 'public' ? 'selected' : ''}>🌐 Public</option>
                        <option value="request" ${room.privacy === 'request' ? 'selected' : ''}>🔑 Request Access</option>
                        <option value="private" ${room.privacy === 'private' ? 'selected' : ''}>🔒 Private</option>
                    </select>
                </div>

                <div class="button-group">
                    <button type="button" class="btn btn-danger" onclick="deleteDataRoom()">Delete Room</button>
                    <div style="margin-left: auto; display: flex; gap: 12px;">
                        <button type="button" class="btn btn-secondary" onclick="previewDataRoom('${roomId}')">Preview</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Edit Data Room', modalContent);

    // Setup form handler
    const form = document.getElementById('edit-data-room-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSaveDataRoom(this);
        });
    }
}

// Handle save room changes
function handleSaveDataRoom(form) {
    if (!currentEditingRoom) return;

    const room = dataRooms.find(r => r.id === currentEditingRoom);
    if (!room) return;

    // Update basic info
    room.name = form.querySelector('input[type="text"]').value;
    room.description = form.querySelector('textarea').value;
    room.privacy = form.querySelector('select').value;
    room.updatedAt = new Date().toISOString().split('T')[0];

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
                    <input type="text" class="form-input" value="https://imi.com/dataroom/jane-doe/${roomId}" readonly style="flex: 1; font-family: monospace; font-size: 12px; background: #f8fafc;">
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

            <div style="text-align: center;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;

    // Use the existing modal system
    openModal('custom', 'Share Data Room', modalContent);
}

// Copy room link to clipboard
function copyDataRoomLink() {
    const linkInput = document.querySelector('input[readonly]');
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
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
                <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 28px; font-weight: 700; color: #042847; margin-bottom: 8px;">${room.stats.views}</div>
                    <div style="font-size: 13px; color: #6b7280;">Total Views</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 28px; font-weight: 700; color: #042847; margin-bottom: 8px;">${room.stats.uniqueVisitors}</div>
                    <div style="font-size: 13px; color: #6b7280;">Unique Visitors</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 28px; font-weight: 700; color: #042847; margin-bottom: 8px;">${room.stats.downloads}</div>
                    <div style="font-size: 13px; color: #6b7280;">Downloads</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 28px; font-weight: 700; color: #042847; margin-bottom: 8px;">${room.stats.printAttempts}</div>
                    <div style="font-size: 13px; color: #6b7280;">Print Attempts</div>
                </div>
            </div>

            <div style="text-align: center;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
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
    if (window.showToast) {
        window.showToast('Access requests management coming soon!', 'info');
    }
}

function viewDataRoomComments() {
    if (window.showToast) {
        window.showToast('Comments management coming soon!', 'info');
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

// Export functions for global use
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