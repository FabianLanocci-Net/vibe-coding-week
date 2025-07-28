/**
 * ============================
 * AEM Component Generator - Main JavaScript
 * Navigation, Mobile Menu, Toast Notifications, and Core App Logic
 * ============================
 */

// ====================
// Application State
// ====================

/**
 * Global application state management
 * This object holds the current state of the application including
 * active sections, mobile menu state, and other UI preferences
 */
const AEMGenerator = {
    // Current active section in the navigation
    currentSection: 'component-generator',
    
    // Mobile menu state for responsive navigation
    isMobileMenuOpen: false,
    
    // Active toasts for notification system
    activeToasts: new Set(),
    
    // Application initialization flag
    isInitialized: false,
    
    // Debug mode for development
    debug: false
};

// ====================
// DOM Elements Cache
// ====================

/**
 * Cache frequently accessed DOM elements for performance
 * This prevents repeated DOM queries throughout the application
 */
const elements = {
    // Navigation elements
    sidebar: null,
    mobileMenuToggle: null,
    mobileOverlay: null,
    navLinks: null,
    contentSections: null,
    
    // Generator elements
    generatorFormContent: null,
    codePreview: null,
    loadingIndicator: null,
    
    // Toast container
    toastContainer: null,
    
    // Buttons
    copyAllBtn: null,
    downloadBtn: null
};

// ====================
// Utility Functions
// ====================

/**
 * Logs messages to console with AEM Generator prefix
 * @param {string} message - The message to log
 * @param {string} type - Log type: 'log', 'warn', 'error'
 */
function log(message, type = 'log') {
    if (AEMGenerator.debug || type === 'error') {
        console[type](`[AEM Generator] ${message}`);
    }
}

/**
 * Debounce function to limit function execution frequency
 * Useful for resize events and other high-frequency triggers
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Safely gets an element by ID with error handling
 * @param {string} id - Element ID to find
 * @returns {HTMLElement|null} Found element or null
 */
function safeGetElement(id) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            log(`Element with ID '${id}' not found`, 'warn');
        }
        return element;
    } catch (error) {
        log(`Error getting element '${id}': ${error.message}`, 'error');
        return null;
    }
}

// ====================
// DOM Element Initialization
// ====================

/**
 * Initialize all cached DOM elements
 * This function is called once during app initialization
 */
function initializeElements() {
    log('Initializing DOM elements...');
    
    // Navigation elements
    elements.sidebar = safeGetElement('sidebar');
    elements.mobileMenuToggle = safeGetElement('mobileMenuToggle');
    elements.mobileOverlay = safeGetElement('mobileOverlay');
    elements.navLinks = document.querySelectorAll('.nav-link[data-section]');
    elements.contentSections = document.querySelectorAll('.content-section');
    
    // Generator elements
    elements.generatorFormContent = safeGetElement('generatorFormContent');
    elements.codePreview = safeGetElement('codePreview');
    elements.loadingIndicator = safeGetElement('loadingIndicator');
    
    // Toast container
    elements.toastContainer = safeGetElement('toastContainer');
    
    // Action buttons
    elements.copyAllBtn = safeGetElement('copyAllBtn');
    elements.downloadBtn = safeGetElement('downloadBtn');
    
    log('DOM elements initialized');
}

// ====================
// Navigation System
// ====================

/**
 * Switches to a specific section in the application
 * Handles the navigation between different features
 * @param {string} sectionId - ID of the section to activate
 */
function switchSection(sectionId) {
    log(`Switching to section: ${sectionId}`);
    
    try {
        // Update navigation active state
        elements.navLinks.forEach(link => {
            const parentItem = link.closest('.nav-item');
            if (link.dataset.section === sectionId) {
                parentItem.classList.add('active');
            } else {
                parentItem.classList.remove('active');
            }
        });
        
        // Update content sections visibility
        elements.contentSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                // Add fade-in animation
                section.classList.add('fade-in');
            } else {
                section.classList.remove('active');
                section.classList.remove('fade-in');
            }
        });
        
        // Update application state
        AEMGenerator.currentSection = sectionId;
        
        // Close mobile menu if open
        if (AEMGenerator.isMobileMenuOpen) {
            closeMobileMenu();
        }
        
        // Trigger section-specific initialization
        handleSectionSwitch(sectionId);
        
        log(`Successfully switched to section: ${sectionId}`);
        
    } catch (error) {
        log(`Error switching to section '${sectionId}': ${error.message}`, 'error');
        showToast('Navigation Error', 'Failed to switch sections', 'error');
    }
}

/**
 * Handles section-specific initialization when switching
 * @param {string} sectionId - ID of the newly active section
 */
function handleSectionSwitch(sectionId) {
    switch (sectionId) {
        case 'component-generator':
            // Initialize component generator if not already done
            if (typeof initializeComponentGenerator === 'function') {
                initializeComponentGenerator();
            }
            break;
            
        case 'template-library':
            // Future: Initialize template library
            log('Template library section activated');
            break;
            
        case 'settings':
            // Future: Initialize settings panel
            log('Settings section activated');
            break;
            
        case 'help':
            // Help section doesn't require special initialization
            log('Help section activated');
            break;
            
        default:
            log(`Unknown section: ${sectionId}`, 'warn');
    }
}

// ====================
// Mobile Menu System
// ====================

/**
 * Toggles the mobile navigation menu
 * Handles the responsive sidebar behavior
 */
function toggleMobileMenu() {
    if (AEMGenerator.isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Opens the mobile navigation menu
 */
function openMobileMenu() {
    log('Opening mobile menu');
    
    if (elements.sidebar && elements.mobileOverlay) {
        elements.sidebar.classList.add('open');
        elements.mobileOverlay.classList.add('active');
        AEMGenerator.isMobileMenuOpen = true;
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Set focus to first navigation item for accessibility
        const firstNavLink = elements.sidebar.querySelector('.nav-link');
        if (firstNavLink) {
            firstNavLink.focus();
        }
    }
}

/**
 * Closes the mobile navigation menu
 */
function closeMobileMenu() {
    log('Closing mobile menu');
    
    if (elements.sidebar && elements.mobileOverlay) {
        elements.sidebar.classList.remove('open');
        elements.mobileOverlay.classList.remove('active');
        AEMGenerator.isMobileMenuOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// ====================
// Toast Notification System
// ====================

/**
 * Shows a toast notification to the user
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (0 for persistent)
 */
function showToast(title, message, type = 'info', duration = 5000) {
    if (!elements.toastContainer) {
        log('Toast container not found', 'warn');
        return;
    }
    
    log(`Showing toast: ${title} - ${message} (${type})`);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Generate unique ID for the toast
    const toastId = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    toast.id = toastId;
    
    // Create toast content
    toast.innerHTML = `
        <div class="toast-icon">
            ${getToastIcon(type)}
        </div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close" onclick="closeToast('${toastId}')" aria-label="Close notification">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Add to container
    elements.toastContainer.appendChild(toast);
    AEMGenerator.activeToasts.add(toastId);
    
    // Trigger show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto-remove after duration (if not persistent)
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toastId);
        }, duration);
    }
}

/**
 * Closes a specific toast notification
 * @param {string} toastId - ID of the toast to close
 */
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            AEMGenerator.activeToasts.delete(toastId);
        }, 200);
    }
}

/**
 * Gets the appropriate icon for a toast type
 * @param {string} type - Toast type
 * @returns {string} SVG icon HTML
 */
function getToastIcon(type) {
    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="12" cy="12" r="10"></circle>
                 <line x1="12" y1="16" x2="12" y2="12"></line>
                 <line x1="12" y1="8" x2="12.01" y2="8"></line>
               </svg>`
    };
    
    return icons[type] || icons.info;
}

/**
 * Escapes HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================
// Event Listeners
// ====================

/**
 * Sets up all event listeners for the application
 */
function setupEventListeners() {
    log('Setting up event listeners...');
    
    // Navigation click handlers
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Don't switch if clicking on disabled items
            if (link.closest('.nav-item').classList.contains('disabled')) {
                showToast('Coming Soon', 'This feature is not available yet', 'info');
                return;
            }
            
            switchSection(sectionId);
        });
    });
    
    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile overlay click to close menu
    if (elements.mobileOverlay) {
        elements.mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AEMGenerator.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Window resize handler for responsive behavior
    const handleResize = debounce(() => {
        // Close mobile menu on large screens
        if (window.innerWidth > 640 && AEMGenerator.isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.section) {
            switchSection(e.state.section);
        }
    });
    
    log('Event listeners set up successfully');
}

// ====================
// Application Initialization
// ====================

/**
 * Initializes the AEM Component Generator application
 * This is the main entry point called when the DOM is ready
 */
function initializeApp() {
    log('Initializing AEM Component Generator...');
    
    try {
        // Initialize DOM elements
        initializeElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize the current section
        switchSection(AEMGenerator.currentSection);
        
        // Mark as initialized
        AEMGenerator.isInitialized = true;
        
        // Show welcome message
        showToast(
            'Welcome!', 
            'AEM Component Generator is ready to use', 
            'success',
            3000
        );
        
        log('Application initialized successfully');
        
    } catch (error) {
        log(`Failed to initialize application: ${error.message}`, 'error');
        
        // Show error to user
        if (elements.toastContainer) {
            showToast(
                'Initialization Error',
                'Failed to start the application. Please refresh the page.',
                'error',
                0 // Persistent
            );
        }
    }
}

// ====================
// Public API
// ====================

/**
 * Expose public functions for use by other modules
 * This creates a clean API for other JavaScript files to interact with
 */
window.AEMGenerator = {
    // State
    getCurrentSection: () => AEMGenerator.currentSection,
    isInitialized: () => AEMGenerator.isInitialized,
    
    // Navigation
    switchSection,
    
    // Mobile menu
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    
    // Notifications
    showToast,
    closeToast,
    
    // Utilities
    log,
    debounce,
    escapeHtml,
    
    // Elements (read-only)
    getElements: () => ({...elements})
};

// Make closeToast globally available for inline handlers
window.closeToast = closeToast;

// ====================
// Application Start
// ====================

/**
 * Start the application when DOM is ready
 * Uses multiple approaches to ensure compatibility across browsers
 */
if (document.readyState === 'loading') {
    // DOM is still loading, wait for it to be ready
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready, initialize immediately
    initializeApp();
}

// Fallback initialization after window load (just in case)
window.addEventListener('load', () => {
    if (!AEMGenerator.isInitialized) {
        log('Fallback initialization triggered');
        initializeApp();
    }
});

// ====================
// Error Handling
// ====================

/**
 * Global error handler for uncaught JavaScript errors
 * Provides user-friendly error messages and logging
 */
window.addEventListener('error', (e) => {
    log(`Uncaught error: ${e.error?.message || e.message}`, 'error');
    
    // Show user-friendly error message
    if (AEMGenerator.isInitialized && elements.toastContainer) {
        showToast(
            'Application Error',
            'An unexpected error occurred. Some features may not work properly.',
            'error',
            8000
        );
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
    log(`Unhandled promise rejection: ${e.reason}`, 'error');
    
    // Show user-friendly error message
    if (AEMGenerator.isInitialized && elements.toastContainer) {
        showToast(
            'Promise Error',
            'A background operation failed. Please try again.',
            'error',
            6000
        );
    }
});

// ====================
// Development Helpers
// ====================

/**
 * Enable debug mode for development
 * This can be called from browser console for debugging
 */
window.enableDebugMode = function() {
    AEMGenerator.debug = true;
    log('Debug mode enabled');
    showToast('Debug Mode', 'Debug logging is now enabled', 'info');
};

/**
 * Disable debug mode
 */
window.disableDebugMode = function() {
    AEMGenerator.debug = false;
    log('Debug mode disabled');
    showToast('Debug Mode', 'Debug logging is now disabled', 'info');
};

/**
 * Log current application state (for debugging)
 */
window.logAppState = function() {
    console.log('AEM Generator State:', {
        currentSection: AEMGenerator.currentSection,
        isMobileMenuOpen: AEMGenerator.isMobileMenuOpen,
        isInitialized: AEMGenerator.isInitialized,
        activeToasts: Array.from(AEMGenerator.activeToasts),
        elements: Object.keys(elements).filter(key => elements[key] !== null)
    });
};

log('Main JavaScript module loaded'); 