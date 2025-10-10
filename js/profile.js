// js/profile.js - Profile Settings Functionality

// Initialize profile page
function initializeProfile() {
    console.log('Initializing profile page...');

    // Setup form handlers
    setupProfileForms();

    // Setup file upload handlers
    setupDocumentUploads();

    // Setup privacy settings
    setupPrivacySettings();

    // Load profile data
    loadProfileData();

    // Load documents from shared library
    loadDocumentsFromLibrary();

    // Load achievements
    loadAchievements();

    // Setup real-time preview updates
    setupProfilePreviewUpdates();
}

// Load documents from shared document library
function loadDocumentsFromLibrary() {
    console.log('Loading documents from library...');

    // Initialize documentLibrary if it doesn't exist yet
    if (!window.documentLibrary) {
        console.log('Document library not available, initializing...');
        window.documentLibrary = {
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
    }

    console.log('Document library available, loading documents...');
    console.log('Current documentLibrary state:', window.documentLibrary);

    // Categories to load
    const categoryMapping = [
        { type: 'resume', plural: 'resumes', icon: '<i class="fa-solid fa-file"></i>' },
        { type: 'project', plural: 'projects', icon: '<i class="fa-solid fa-file"></i>' },
        { type: 'certificate', plural: 'certificates', icon: '<i class="fa-solid fa-trophy"></i>' },
        { type: 'reference', plural: 'references', icon: '<i class="fa-solid fa-pen-to-square"></i>' }
    ];

    categoryMapping.forEach(({ type, plural, icon }) => {
        const docs = window.documentLibrary[plural] || [];
        console.log(`📂 Loading ${type} documents:`, docs.length, 'documents');

        const category = document.querySelector(`#${type}-upload`)?.closest('.document-category');
        if (!category) {
            console.error(`❌ Category container not found for ${type}`);
            return;
        }

        const documentsList = category.querySelector('.uploaded-documents');
        if (!documentsList) {
            console.error(`❌ Documents list container not found for ${type}`);
            return;
        }

        console.log(`🧹 Clearing existing documents for ${type}`);
        // Clear existing static documents
        documentsList.innerHTML = '';

        console.log(`📄 Adding ${docs.length} documents to ${type} UI`);
        // Add documents from library
        docs.forEach(doc => {
            const documentItem = document.createElement('div');
            documentItem.className = 'document-item';
            documentItem.dataset.documentId = doc.id;

            // Determine icon based on file type
            let docIcon = icon;
            if (doc.name.includes('.jpg') || doc.name.includes('.png')) {
                docIcon = type === 'certificate' ? '<i class="fa-solid fa-medal"></i>' : '<i class="fa-solid fa-image"></i>';
            }

            // Format date consistently
            const uploadDate = doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Recently';

            documentItem.innerHTML = `
                <div class="document-header">
                    <span class="doc-icon">${docIcon}</span>
                    <div class="doc-info">
                        <span class="doc-name">${doc.name}</span>
                        <span class="doc-meta">Uploaded ${uploadDate} • ${doc.size}</span>
                    </div>
                    <div class="doc-actions">
                        <button class="btn-icon" title="Download" onclick="downloadDocument('${doc.id}')"><i class="fa-solid fa-download"></i></button>
                        <button class="btn-icon" title="Delete" onclick="deleteDocument('${doc.id}', '${type}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="default-description-section">
                    <label for="default-desc-${doc.id}">Default Description:</label>
                    <textarea
                        id="default-desc-${doc.id}"
                        class="default-description-input"
                        data-doc-id="${doc.id}"
                        placeholder="Add a default description for this document..."
                        onchange="updateDefaultDescription('${doc.id}', this.value)"
                        rows="1">${doc.defaultDescription || ''}</textarea>
                    <small class="help-text">This description will be used by default in all data rooms</small>
                </div>
            `;

            documentsList.appendChild(documentItem);
        });
    });
}

// Setup profile forms
function setupProfileForms() {
    const personalInfoForm = document.getElementById('personal-info-form');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', handlePersonalInfoSubmit);
    }
    
    const socialLinksForm = document.getElementById('social-links-form');
    if (socialLinksForm) {
        socialLinksForm.addEventListener('submit', handleSocialLinksSubmit);
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('.profile-form input, .profile-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', updatePreview);
    });
}

// Handle personal info form submission
function handlePersonalInfoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
        firstName: formData.get('firstName') || document.querySelector('input[type="text"]').value,
        lastName: formData.get('lastName') || document.querySelectorAll('input[type="text"]')[1].value,
        displayName: formData.get('displayName') || document.querySelectorAll('input[type="text"]')[2].value,
        bio: formData.get('bio') || document.querySelector('textarea').value,
        school: formData.get('school') || document.querySelectorAll('input[type="text"]')[3].value,
        graduationYear: formData.get('graduationYear'),
        phoneNumber: formData.get('phoneNumber'),
        interests: getSelectedInterests()
    };
    
    console.log('Saving profile data:', profileData);
    
    // Save to localStorage (in production, send to API)
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Update preview
    updateProfilePreview(profileData);
    
    // Show success message
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Profile updated successfully!', 'success');
    }
}

// Handle social links form submission
function handleSocialLinksSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const socialData = {
        linkedin: formData.get('linkedin') || '',
        github: formData.get('github') || '',
        portfolio: formData.get('portfolio') || '',
        email: formData.get('email') || '',
        twitter: formData.get('twitter') || ''
    };
    
    console.log('Saving social links:', socialData);
    
    // Save to localStorage
    localStorage.setItem('socialLinks', JSON.stringify(socialData));
    
    // Update preview
    updateSocialLinksPreview(socialData);
    
    // Show success message
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Social links updated successfully!', 'success');
    }
}

// Get selected interests
function getSelectedInterests() {
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.parentElement.textContent.trim());
}

// Validate individual fields
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    // Field-specific validation
    switch(field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                field.classList.add('invalid');
                showFieldError(field, 'Please enter a valid email address');
            } else {
                field.classList.add('valid');
                clearFieldError(field);
            }
            break;
            
        case 'url':
            if (value && !isValidURL(value)) {
                field.classList.add('invalid');
                showFieldError(field, 'Please enter a valid URL (including https://)');
            } else {
                field.classList.add('valid');
                clearFieldError(field);
            }
            break;
            
        case 'tel':
            if (value && !isValidPhone(value)) {
                field.classList.add('invalid');
                showFieldError(field, 'Please enter a valid phone number');
            } else {
                field.classList.add('valid');
                clearFieldError(field);
            }
            break;
            
        default:
            if (field.hasAttribute('required') && !value) {
                field.classList.add('invalid');
                showFieldError(field, 'This field is required');
            } else {
                field.classList.add('valid');
                clearFieldError(field);
            }
    }
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

function isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Setup document uploads
function setupDocumentUploads() {
    const uploadTriggers = ['resume', 'project', 'certificate', 'reference'];

    uploadTriggers.forEach(type => {
        const input = document.getElementById(`${type}-upload`);
        if (input) {
            input.addEventListener('change', (e) => handleDocumentUpload(e, type));
        }
    });
}

// Handle document upload
function handleDocumentUpload(e, type) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (validateDocumentFile(file, type)) {
            addDocumentToList(file, type);
        }
    });
    
    // Clear input
    e.target.value = '';
}

// Validate document file
function validateDocumentFile(file, type) {
    const maxSize = 10 * 1024 * 1024; // 10MB for projects, 5MB for others

    // Type-specific validation
    let allowedTypes = [];
    let actualMaxSize = 5 * 1024 * 1024; // Default 5MB

    switch(type) {
        case 'resume':
            allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            break;
        case 'project':
            allowedTypes = ['application/pdf'];
            actualMaxSize = 10 * 1024 * 1024; // 10MB for projects
            break;
        case 'certificate':
            allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            break;
        case 'reference':
            allowedTypes = ['application/pdf'];
            break;
    }

    if (!allowedTypes.includes(file.type)) {
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification(`Invalid file type for ${type}`, 'warning');
        }
        return false;
    }

    if (file.size > actualMaxSize) {
        const maxSizeMB = actualMaxSize / 1024 / 1024;
        if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
            window.IMI.utils.showNotification(`File too large (max ${maxSizeMB}MB)`, 'warning');
        }
        return false;
    }

    return true;
}

// Add document to list
function addDocumentToList(file, type) {
    const category = document.querySelector(`#${type}-upload`).closest('.document-category');
    const documentsList = category.querySelector('.uploaded-documents');

    if (!documentsList) return;

    const documentId = type.slice(0, 4) + '-' + Date.now();

    // Check if document already exists in DOM
    if (document.querySelector(`[data-document-id="${documentId}"]`)) {
        console.log('Document already exists in DOM');
        return;
    }
    const fileSize = (file.size / 1024 / 1024).toFixed(1);
    const fileIcon = getDocumentIcon(file.type);

    const documentItem = document.createElement('div');
    documentItem.className = 'document-item';
    documentItem.dataset.documentId = documentId;

    documentItem.innerHTML = `
        <div class="document-header">
            <span class="doc-icon">${fileIcon}</span>
            <div class="doc-info">
                <span class="doc-name">${file.name}</span>
                <span class="doc-meta">Uploaded ${new Date().toLocaleDateString()} • ${fileSize} MB</span>
            </div>
            <div class="doc-actions">
                <button class="btn-icon" title="Download" onclick="downloadDocument('${documentId}')"><i class="fa-solid fa-download"></i></button>
                <button class="btn-icon" title="Delete" onclick="deleteDocument('${documentId}', '${type}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        <div class="default-description-section">
            <label for="default-desc-${documentId}">Default Description:</label>
            <textarea
                id="default-desc-${documentId}"
                class="default-description-input"
                data-doc-id="${documentId}"
                placeholder="Add a default description for this document..."
                onchange="updateDefaultDescription('${documentId}', this.value)"
                rows="1"></textarea>
            <small class="help-text">This description will be used by default in all data rooms</small>
        </div>
    `;

    documentsList.appendChild(documentItem);

    // Store document data locally
    storeDocument(documentId, file, type);

    // Convert type to plural category for documentLibrary
    const categoryMap = {
        'resume': 'resumes',
        'project': 'projects',
        'certificate': 'certificates',
        'reference': 'references'
    };
    const libraryCategory = categoryMap[type];

    // Add to shared documentLibrary for data room sync
    const documentData = {
        id: documentId,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        size: fileSize + ' MB'
    };

    if (libraryCategory) {
        console.log('🔄 Adding document to library:', { libraryCategory, documentData });
        console.log('🔍 window.addDocumentToLibrary available:', typeof window.addDocumentToLibrary);
        console.log('🔍 window.documentLibrary exists:', !!window.documentLibrary);

        // Use the addDocumentToLibrary function if available (from data-rooms.js)
        if (window.addDocumentToLibrary) {
            console.log('✅ Using addDocumentToLibrary function');
            window.addDocumentToLibrary(libraryCategory, documentData);

            // Force refresh any open data room modals
            console.log('🔄 Checking for open data room modals to refresh...');
            if (window.refreshDocumentSelector && typeof window.refreshDocumentSelector === 'function') {
                console.log('📝 Calling refreshDocumentSelector...');
                window.refreshDocumentSelector();
            }
        } else {
            // Fallback: add directly to documentLibrary if function not available
            console.log('⚠️ addDocumentToLibrary not available, adding directly to library');
            if (!window.documentLibrary) {
                console.log('📦 Creating new documentLibrary');
                window.documentLibrary = { resumes: [], projects: [], certificates: [], references: [] };
            }
            if (!window.documentLibrary[libraryCategory]) {
                console.log('📂 Creating category:', libraryCategory);
                window.documentLibrary[libraryCategory] = [];
            }
            console.log('📄 Adding document directly to library');
            window.documentLibrary[libraryCategory].push(documentData);
            console.log('✅ Document added. Library now contains:', window.documentLibrary);
        }
    }

    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification(`${type} uploaded successfully!`, 'success');
    } else {
        console.log(`${type} uploaded successfully!`);
    }
}

// Get document icon
function getDocumentIcon(type) {
    if (type.includes('pdf')) return '<i class="fa-solid fa-file"></i>';
    if (type.includes('word') || type.includes('doc')) return '<i class="fa-solid fa-pen-to-square"></i>';
    if (type.includes('image')) return '<i class="fa-solid fa-image"></i>';
    return '<i class="fa-solid fa-folder"></i>';
}

// Store document
function storeDocument(id, file, type) {
    const documents = JSON.parse(localStorage.getItem('documents') || '{}');
    
    documents[id] = {
        name: file.name,
        type: type,
        size: file.size,
        mimeType: file.type,
        uploadDate: new Date().toISOString()
    };
    
    localStorage.setItem('documents', JSON.stringify(documents));
}

// Download document
function downloadDocument(documentId) {
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Download started...', 'info');
    }
    // In production, trigger actual download
    console.log('Downloading document:', documentId);
}

// Check which data rooms use a document
function getDataRoomsUsingDocument(documentId) {
    if (!window.dataRooms) return [];

    return window.dataRooms.filter(room =>
        room.documents.some(doc => doc.id === documentId && doc.selected !== false)
    );
}

// Show deletion warning popup
function showDeletionWarning(documentId, type, usingRooms) {
    const popup = document.createElement('div');
    popup.className = 'deletion-warning-modal';
    popup.innerHTML = `
        <div class="deletion-warning-content">
            <h3><i class="fa-solid fa-triangle-exclamation"></i> Document in Use</h3>
            <p>This document is currently being used in the following data room${usingRooms.length > 1 ? 's' : ''}:</p>
            <ul class="room-list">
                ${usingRooms.map(room => `<li>• ${room.name}</li>`).join('')}
            </ul>
            <p>Deleting this document will remove it from ${usingRooms.length > 1 ? 'these data rooms' : 'this data room'} as well.</p>
            <div class="warning-actions">
                <button class="btn btn-secondary" onclick="closeDeletionWarning()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDeleteDocument('${documentId}', '${type}')">Delete Anyway</button>
            </div>
        </div>
    `;

    // Add click-to-close functionality
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeDeletionWarning();
        }
    });

    document.body.appendChild(popup);
}

// Close deletion warning popup
function closeDeletionWarning() {
    const popup = document.querySelector('.deletion-warning-modal');
    if (popup) {
        popup.remove();
    }
}

// Confirm and proceed with deletion
function confirmDeleteDocument(documentId, type) {
    closeDeletionWarning();
    proceedWithDeletion(documentId, type);
}

// Proceed with actual deletion
function proceedWithDeletion(documentId, type) {
    const documentElement = document.querySelector(`[data-document-id="${documentId}"]`);
    if (documentElement) {
        documentElement.remove();
    }

    // Remove from local storage
    const documents = JSON.parse(localStorage.getItem('documents') || '{}');
    delete documents[documentId];
    localStorage.setItem('documents', JSON.stringify(documents));

    // Remove from shared documentLibrary for data room sync
    if (type) {
        const categoryMap = {
            'resume': 'resumes',
            'project': 'projects',
            'certificate': 'certificates',
            'reference': 'references'
        };
        const libraryCategory = categoryMap[type];

        if (libraryCategory) {
            if (window.removeDocumentFromLibrary) {
                window.removeDocumentFromLibrary(libraryCategory, documentId);
            } else {
                // Fallback: remove directly from documentLibrary if function not available
                console.log('removeDocumentFromLibrary not available, removing directly from library');
                if (window.documentLibrary && window.documentLibrary[libraryCategory]) {
                    const index = window.documentLibrary[libraryCategory].findIndex(doc => doc.id === documentId);
                    if (index !== -1) {
                        window.documentLibrary[libraryCategory].splice(index, 1);
                    }
                }
            }
        }
    }

    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Document deleted', 'success');
    } else {
        console.log('Document deleted');
    }
}

// Delete document
function deleteDocument(documentId, type) {
    // Check if document is being used in any data rooms
    const usingRooms = getDataRoomsUsingDocument(documentId);

    if (usingRooms.length > 0) {
        // Show warning popup
        showDeletionWarning(documentId, type, usingRooms);
    } else {
        // Simple confirmation for unused documents
        if (confirm('Are you sure you want to delete this document?')) {
            proceedWithDeletion(documentId, type);
        }
    }
}

// Setup privacy settings
function setupPrivacySettings() {
    const privacyOptions = document.querySelectorAll('.privacy-option select, .privacy-option input[type="checkbox"]');
    
    privacyOptions.forEach(option => {
        option.addEventListener('change', savePrivacySettings);
    });
    
    // Load existing settings
    loadPrivacySettings();
}

// Save privacy settings
function savePrivacySettings() {
    const settings = {
        profileVisibility: document.querySelector('.privacy-option select').value,
        contactVisibility: document.querySelectorAll('.privacy-option select')[1].value,
        allowConnections: document.querySelector('.privacy-option input[type="checkbox"]').checked,
        showInSuggestions: document.querySelectorAll('.privacy-option input[type="checkbox"]')[1].checked,
        allowCompanyMessages: document.querySelectorAll('.privacy-option input[type="checkbox"]')[2].checked
    };
    
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    console.log('Privacy settings saved:', settings);
}

// Load privacy settings
function loadPrivacySettings() {
    const settings = JSON.parse(localStorage.getItem('privacySettings') || '{}');
    
    if (Object.keys(settings).length > 0) {
        // Apply loaded settings
        const selects = document.querySelectorAll('.privacy-option select');
        const checkboxes = document.querySelectorAll('.privacy-option input[type="checkbox"]');
        
        if (selects[0]) selects[0].value = settings.profileVisibility || 'IMI Students & Mentors';
        if (selects[1]) selects[1].value = settings.contactVisibility || 'Mentors & Partners Only';
        if (checkboxes[0]) checkboxes[0].checked = settings.allowConnections !== false;
        if (checkboxes[1]) checkboxes[1].checked = settings.showInSuggestions !== false;
        if (checkboxes[2]) checkboxes[2].checked = settings.allowCompanyMessages || false;
    }
}

// Update default description for a document
function updateDefaultDescription(docId, description) {
    console.log(`Updating default description for ${docId}: ${description}`);

    // Find and update the document in the library
    let found = false;
    Object.entries(window.documentLibrary || {}).forEach(([category, docs]) => {
        docs.forEach(doc => {
            if (doc.id === docId) {
                doc.defaultDescription = description;
                found = true;
                console.log(`✅ Updated default description for ${docId}`);
            }
        });
    });

    if (!found) {
        console.error(`❌ Document ${docId} not found in library`);
    }

    // Refresh any open data room edit modals to show updated default descriptions
    if (window.refreshDocumentSelector && typeof window.refreshDocumentSelector === 'function') {
        window.refreshDocumentSelector();
    }
}

// Load profile data
function loadProfileData() {
    // First, populate with real user data from Microsoft Graph
    if (window.IMI && window.IMI.data && window.IMI.data.userData) {
        const userData = window.IMI.data.userData;

        // Populate form fields with Microsoft Graph data
        const firstNameInput = document.getElementById('profile-first-name');
        const lastNameInput = document.getElementById('profile-last-name');
        const displayNameInput = document.getElementById('profile-display-name');
        const emailInput = document.getElementById('profile-email');

        if (firstNameInput) firstNameInput.value = userData.firstName || '[PLACEHOLDER]';
        if (lastNameInput) lastNameInput.value = userData.lastName || '[PLACEHOLDER]';
        if (displayNameInput) displayNameInput.value = userData.name || '[PLACEHOLDER]';
        if (emailInput) emailInput.value = userData.email || '[PLACEHOLDER]';

        // Update profile preview with real user data
        updateProfilePreviewWithUserData(userData);

        console.log('✅ Profile form populated with Microsoft Graph data');
    }

    // Then, load any saved profile data from localStorage (this overrides Graph data if saved)
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        populateProfileForm(profileData);
        updateProfilePreview(profileData);
    }

    const savedSocial = localStorage.getItem('socialLinks');
    if (savedSocial) {
        const socialData = JSON.parse(savedSocial);
        populateSocialForm(socialData);
        updateSocialLinksPreview(socialData);
    }
}

// Update profile preview with user data from Microsoft Graph
function updateProfilePreviewWithUserData(userData) {
    const previewName = document.getElementById('preview-name');
    const previewAvatar = document.getElementById('preview-avatar');
    const previewSchool = document.getElementById('preview-school');

    if (previewName) {
        previewName.textContent = userData.name || '[PLACEHOLDER]';
    }

    if (previewAvatar) {
        // Check if user has a photo
        if (window.IMI && window.IMI.graph) {
            window.IMI.graph.fetchUserPhoto().then(photoUrl => {
                if (photoUrl) {
                    previewAvatar.style.backgroundImage = `url(${photoUrl})`;
                    previewAvatar.style.backgroundSize = 'cover';
                    previewAvatar.style.backgroundPosition = 'center';
                    previewAvatar.textContent = '';
                } else {
                    previewAvatar.textContent = userData.initials || 'NA';
                }
            });
        } else {
            previewAvatar.textContent = userData.initials || 'NA';
        }
    }

    // Update school info if available from department or job title
    if (previewSchool && userData.department !== '[PLACEHOLDER]') {
        previewSchool.textContent = userData.department;
    }
}

// Populate profile form
function populateProfileForm(data) {
    const inputs = document.querySelectorAll('#personal-info-form input, #personal-info-form textarea, #personal-info-form select');
    
    // Map data to form fields (excluding bio - let it use HTML default)
    const fieldMap = {
        'firstName': data.firstName,
        'lastName': data.lastName,
        'displayName': data.displayName,
        // 'bio': data.bio, // Excluded - will use HTML default on refresh
        'school': data.school,
        'graduationYear': data.graduationYear,
        'phoneNumber': data.phoneNumber
    };
    
    inputs.forEach(input => {
        const fieldName = input.name || input.id;
        if (fieldMap[fieldName]) {
            input.value = fieldMap[fieldName];
        }
    });
    
    // Set interests
    if (data.interests) {
        const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim();
            checkbox.checked = data.interests.includes(label);
        });
    }
}

// Populate social form
function populateSocialForm(data) {
    const inputs = document.querySelectorAll('#social-links-form input');
    
    // Map fields
    if (inputs[0]) inputs[0].value = data.linkedin || '';
    if (inputs[1]) inputs[1].value = data.github || '';
    if (inputs[2]) inputs[2].value = data.portfolio || '';
    if (inputs[3]) inputs[3].value = data.email || '';
    if (inputs[4]) inputs[4].value = data.twitter || '';
}

// Setup profile preview updates
function setupProfilePreviewUpdates() {
    const formInputs = document.querySelectorAll('.profile-form input, .profile-form textarea, .profile-form select');
    
    formInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    const interestCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });
}

// Update preview in real-time
function updatePreview() {
    const displayName = document.querySelector('#personal-info-form input[type="text"]')?.value || 'Jane Doe';
    const bio = document.querySelector('#personal-info-form textarea')?.value || '';
    const school = document.querySelector('#personal-info-form input[type="text"]')?.value || '';
    const interests = getSelectedInterests();
    
    // Update preview elements
    const previewName = document.querySelector('.profile-preview h4');
    if (previewName) previewName.textContent = displayName;
    
    const previewBio = document.querySelector('.preview-bio');
    if (previewBio) previewBio.textContent = bio || 'No bio added yet.';
    
    const previewSchool = document.querySelector('.preview-school');
    if (previewSchool) previewSchool.textContent = school ? `${school} • Class of 2025` : 'School not specified';
    
    const previewInterests = document.querySelector('.preview-interests');
    if (previewInterests) {
        previewInterests.innerHTML = interests.map(interest => 
            `<span class="interest-tag">${interest}</span>`
        ).join('');
    }
}

// Update profile preview
function updateProfilePreview(data) {
    const previewName = document.querySelector('.profile-preview h4');
    if (previewName) previewName.textContent = data.displayName;
    
    const previewBio = document.querySelector('.preview-bio');
    const bioTextarea = document.getElementById('profile-bio');
    if (previewBio && bioTextarea) {
        previewBio.textContent = bioTextarea.value || data.bio || '';
    }
    
    const previewSchool = document.querySelector('.preview-school');
    if (previewSchool) {
        previewSchool.textContent = data.school ? 
            `${data.school} • Class of ${data.graduationYear || '2025'}` : 
            'School not specified';
    }
    
    const previewInterests = document.querySelector('.preview-interests');
    if (previewInterests && data.interests) {
        previewInterests.innerHTML = data.interests.map(interest => 
            `<span class="interest-tag">${interest}</span>`
        ).join('');
    }
}

// Update social links preview
function updateSocialLinksPreview(data) {
    const previewLinks = document.querySelector('.preview-links');
    if (!previewLinks) return;
    
    const links = [];
    if (data.linkedin) links.push('<a href="#" class="social-link"><i class="fa-brands fa-linkedin"></i></a>');
    if (data.github) links.push('<a href="#" class="social-link"><i class="fa-brands fa-github"></i></a>');
    if (data.portfolio) links.push('<a href="#" class="social-link"><i class="fa-solid fa-globe"></i></a>');
    
    previewLinks.innerHTML = links.join('');
}

// Account action functions
function exportProfile() {
    const profileData = localStorage.getItem('profileData') || '{}';
    const socialData = localStorage.getItem('socialLinks') || '{}';
    const privacyData = localStorage.getItem('privacySettings') || '{}';
    const documentsData = localStorage.getItem('documents') || '{}';
    
    const exportData = {
        profile: JSON.parse(profileData),
        socialLinks: JSON.parse(socialData),
        privacy: JSON.parse(privacyData),
        documents: JSON.parse(documentsData),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imi_profile_export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Profile data exported successfully!', 'success');
    }
}

function changePassword() {
    if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
        window.IMI.utils.showNotification('Password change functionality coming soon!', 'info');
    }
    // In production, open password change modal
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data, projects, and connections. Continue?')) {
            if (window.IMI && window.IMI.utils && window.IMI.utils.showNotification) {
                window.IMI.utils.showNotification('Account deletion requested. You will receive a confirmation email.', 'info');
            }
            // In production, trigger account deletion process
        }
    }
}

// File upload trigger
function triggerFileUpload(type) {
    const input = document.getElementById(`${type}-upload`);
    if (input) input.click();
}

// Load achievements section
function loadAchievements() {
    console.log('Loading achievements...');

    // Initialize achievements library if not available
    if (!window.achievementsLibrary) {
        console.log('Achievements library not available yet, will load when data-rooms.js loads');
        return;
    }

    // Clean up any existing empty achievements
    cleanupEmptyAchievements();

    loadVerifiedAchievements();
    loadCustomAchievements();
    setupAchievementFormHandlers();
}

// Clean up empty achievements from library
function cleanupEmptyAchievements() {
    if (!window.achievementsLibrary) return;

    const originalLength = window.achievementsLibrary.length;
    window.achievementsLibrary = window.achievementsLibrary.filter(achievement => {
        // Keep verified achievements regardless
        if (achievement.isVerified) return true;

        // For custom achievements, require non-empty title and description
        return achievement.title &&
               achievement.title.trim() &&
               achievement.description &&
               achievement.description.trim();
    });

    const removedCount = originalLength - window.achievementsLibrary.length;
    if (removedCount > 0) {
        console.log(`Cleaned up ${removedCount} empty custom achievements`);
    }
}

// Load IMI-verified achievements (read-only)
function loadVerifiedAchievements() {
    const verifiedList = document.getElementById('verified-achievements-list');
    if (!verifiedList) return;

    const verifiedAchievements = window.achievementsLibrary.filter(a => a.isVerified);

    if (verifiedAchievements.length === 0) {
        verifiedList.innerHTML = '<p class="no-achievements">No verified achievements yet. Keep working hard!</p>';
        return;
    }

    verifiedList.innerHTML = verifiedAchievements.map(achievement => `
        <div class="achievement-card verified">
            <div class="achievement-header">
                <span class="achievement-icon"><i class="fa-solid ${achievement.icon}"></i></span>
                <div class="achievement-info">
                    <h5 class="achievement-title">${achievement.title}</h5>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
                <div class="verified-indicator" title="Verified"><i class="fa-solid fa-check"></i></div>
            </div>
            <div class="achievement-meta">
                <span class="achievement-category">${achievement.category}</span>
            </div>
        </div>
    `).join('');
}

// Load custom achievements
function loadCustomAchievements() {
    const customList = document.getElementById('custom-achievements-list');
    if (!customList) return;

    // Filter out any achievements with empty titles or descriptions
    const customAchievements = window.achievementsLibrary.filter(a =>
        !a.isVerified && a.title && a.title.trim() && a.description && a.description.trim()
    );

    if (customAchievements.length === 0) {
        customList.innerHTML = '<p class="no-achievements">No custom achievements added yet.</p>';
        return;
    }

    customList.innerHTML = customAchievements.map(achievement => `
        <div class="achievement-card custom" data-achievement-id="${achievement.id}">
            <div class="achievement-header">
                <span class="achievement-icon"><i class="fa-solid ${achievement.icon}"></i></span>
                <div class="achievement-info">
                    <h5 class="achievement-title">${achievement.title}</h5>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
                <div class="achievement-actions">
                    <button class="btn-icon" title="Edit" onclick="editCustomAchievement('${achievement.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon" title="Delete" onclick="deleteCustomAchievement('${achievement.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="achievement-meta">
                <span class="achievement-category">${achievement.category}</span>
                ${achievement.dateAchieved ? `<span class="achievement-date">${formatDate(achievement.dateAchieved)}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Setup achievement form handlers
function setupAchievementFormHandlers() {
    const form = document.getElementById('custom-achievement-form');
    if (!form) return;

    // Remove any existing event listeners first
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Add single event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAddCustomAchievement(this);
    });
}

// Show add achievement form
function showAddAchievementForm() {
    document.getElementById('add-achievement-form').style.display = 'block';
    document.getElementById('add-achievement-button').style.display = 'none';

    // Focus on first input
    const firstInput = document.querySelector('#add-achievement-form input[type="text"]');
    if (firstInput) firstInput.focus();
}

// Cancel add achievement
function cancelAddAchievement() {
    document.getElementById('add-achievement-form').style.display = 'none';
    document.getElementById('add-achievement-button').style.display = 'block';

    // Reset form
    document.getElementById('custom-achievement-form').reset();

    // Reset submission flag
    isSubmittingAchievement = false;
}

// Prevent double submission
let isSubmittingAchievement = false;

// Handle add custom achievement
function handleAddCustomAchievement(form) {
    // Prevent double submission
    if (isSubmittingAchievement) {
        console.log('Already submitting, ignoring duplicate submission');
        return;
    }
    isSubmittingAchievement = true;

    const titleInput = form.querySelector('input[type="text"]');
    const iconSelect = form.querySelector('select');
    const descriptionTextarea = form.querySelector('textarea');
    const categorySelect = form.querySelectorAll('select')[1];
    const dateInput = form.querySelector('input[type="date"]');

    // Validate required fields
    const title = titleInput.value.trim();
    const description = descriptionTextarea.value.trim();

    if (!title || !description) {
        if (window.showToast) {
            window.showToast('Please fill in both title and description', 'error');
        }
        isSubmittingAchievement = false;
        return;
    }

    const achievement = {
        id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        title: title,
        description: description,
        icon: iconSelect.value || 'fa-trophy',
        category: categorySelect.value || 'other',
        dateAchieved: dateInput.value || null,
        isVerified: false
    };

    // Add to achievements library (global window.achievementsLibrary is the single source of truth)
    if (!window.achievementsLibrary) {
        window.achievementsLibrary = [];
    }

    window.achievementsLibrary.push(achievement);

    console.log('Added achievement to global library. Total achievements:', window.achievementsLibrary.length);

    // Refresh any open data room edit modals to show new achievement
    if (window.currentEditingRoom && typeof window.refreshAchievementSelector === 'function') {
        window.refreshAchievementSelector();
    }

    // Refresh display
    loadCustomAchievements();

    // Hide form
    cancelAddAchievement();

    // Show success message
    if (window.showToast) {
        window.showToast('Achievement added successfully!', 'success');
    }

    // Reset submission flag
    isSubmittingAchievement = false;

    console.log('Added custom achievement:', achievement);
}

// Edit custom achievement
function editCustomAchievement(achievementId) {
    const achievement = window.achievementsLibrary.find(a => a.id === achievementId);
    if (!achievement) return;

    // Show form
    showAddAchievementForm();

    // Populate form with existing data
    const form = document.getElementById('custom-achievement-form');
    const titleInput = form.querySelector('input[type="text"]');
    const iconSelect = form.querySelector('select');
    const descriptionTextarea = form.querySelector('textarea');
    const categorySelect = form.querySelectorAll('select')[1];
    const dateInput = form.querySelector('input[type="date"]');

    titleInput.value = achievement.title;
    iconSelect.value = achievement.icon;
    descriptionTextarea.value = achievement.description;
    categorySelect.value = achievement.category;
    dateInput.value = achievement.dateAchieved || '';

    // Change form to edit mode
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Achievement';

    // Update form handler temporarily
    form.onsubmit = function(e) {
        e.preventDefault();
        handleUpdateCustomAchievement(achievementId, this);
    };
}

// Handle update custom achievement
function handleUpdateCustomAchievement(achievementId, form) {
    const achievement = window.achievementsLibrary.find(a => a.id === achievementId);
    if (!achievement) return;

    const titleInput = form.querySelector('input[type="text"]');
    const iconSelect = form.querySelector('select');
    const descriptionTextarea = form.querySelector('textarea');
    const categorySelect = form.querySelectorAll('select')[1];
    const dateInput = form.querySelector('input[type="date"]');

    // Update achievement (since it's a reference, this updates the global library automatically)
    achievement.title = titleInput.value.trim();
    achievement.description = descriptionTextarea.value.trim();
    achievement.icon = iconSelect.value;
    achievement.category = categorySelect.value;
    achievement.dateAchieved = dateInput.value || null;

    console.log('Updated achievement in global library:', achievement.title);

    // Refresh any open data room edit modals to update achievement selectors
    if (window.currentEditingRoom && typeof window.refreshAchievementSelector === 'function') {
        window.refreshAchievementSelector();
    }

    // Refresh display
    loadCustomAchievements();

    // Hide form and reset
    cancelAddAchievement();

    // Reset form handler
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Add Achievement';
    form.onsubmit = function(e) {
        e.preventDefault();
        handleAddCustomAchievement(this);
    };

    // Show success message
    if (window.showToast) {
        window.showToast('Achievement updated successfully!', 'success');
    }

    console.log('Updated custom achievement:', achievement);
}

// Delete custom achievement
function deleteCustomAchievement(achievementId) {
    const achievement = window.achievementsLibrary.find(a => a.id === achievementId);
    if (!achievement) return;

    if (confirm(`Are you sure you want to delete "${achievement.title}"?`)) {
        // Remove from global library (single source of truth)
        const index = window.achievementsLibrary.findIndex(a => a.id === achievementId);
        if (index !== -1) {
            window.achievementsLibrary.splice(index, 1);
        }

        console.log('Removed achievement from global library. Remaining achievements:', window.achievementsLibrary.length);

        // Remove from any data rooms that reference this achievement
        if (window.dataRooms) {
            window.dataRooms.forEach(room => {
                if (room.achievements) {
                    room.achievements = room.achievements.filter(id => id !== achievementId);
                }
            });
        }

        // Refresh any open data room edit modals to update achievement selectors
        if (window.currentEditingRoom && typeof window.refreshAchievementSelector === 'function') {
            window.refreshAchievementSelector();
        }

        // Refresh display
        loadCustomAchievements();

        // Show success message
        if (window.showToast) {
            window.showToast('Achievement deleted successfully!', 'success');
        }

        console.log('Deleted custom achievement:', achievementId);
    }
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export functions
window.initializeProfile = initializeProfile;
window.setupDocumentUploads = setupDocumentUploads;
window.loadDocumentsFromLibrary = loadDocumentsFromLibrary;
window.loadAchievements = loadAchievements;
window.showAddAchievementForm = showAddAchievementForm;
window.cancelAddAchievement = cancelAddAchievement;
window.editCustomAchievement = editCustomAchievement;
window.deleteCustomAchievement = deleteCustomAchievement;
window.exportProfile = exportProfile;
window.changePassword = changePassword;
window.confirmDeleteAccount = confirmDeleteAccount;
window.triggerFileUpload = triggerFileUpload;
window.downloadDocument = downloadDocument;
window.deleteDocument = deleteDocument;
window.closeDeletionWarning = closeDeletionWarning;
window.confirmDeleteDocument = confirmDeleteDocument;
window.updateDefaultDescription = updateDefaultDescription;
