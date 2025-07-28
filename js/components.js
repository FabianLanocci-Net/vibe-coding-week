/**
 * ============================
 * AEM Component Generator - UI Components Library
 * Reusable UI Components for Forms, Dialogs, and Interface Elements
 * ============================
 */

/**
 * UI Components Library
 * Contains reusable UI components for the AEM Component Generator
 */
const UIComponents = {

    /**
     * Creates a component type selection card
     * @param {string} typeKey - Component type key
     * @param {Object} config - Component configuration
     * @param {Function} onSelect - Selection callback
     * @returns {HTMLElement} Component card element
     */
    createComponentCard: function(typeKey, config, onSelect) {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.setAttribute('data-component-type', typeKey);
        
        card.innerHTML = `
            <div class="component-card__header">
                <div class="component-card__icon">${config.icon}</div>
                <div class="component-card__category">${config.category}</div>
            </div>
            <div class="component-card__content">
                <h3 class="component-card__title">${config.title}</h3>
                <p class="component-card__description">${config.description}</p>
            </div>
            <div class="component-card__footer">
                <div class="component-card__fields-count">
                    ${config.fields.length} field${config.fields.length !== 1 ? 's' : ''}
                </div>
                <button class="component-card__select-btn btn btn-primary" type="button">
                    Select
                </button>
            </div>
        `;
        
        // Add click handler
        const selectBtn = card.querySelector('.component-card__select-btn');
        selectBtn.addEventListener('click', () => onSelect(typeKey, config));
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(typeKey, config);
            }
        });
        
        return card;
    },

    /**
     * Creates a component type selector interface
     * @param {Function} onTypeSelected - Callback when component type is selected
     * @returns {HTMLElement} Component selector element
     */
    createComponentSelector: function(onTypeSelected) {
        const container = document.createElement('div');
        container.className = 'component-selector';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'component-selector__header';
        header.innerHTML = `
            <h2 class="component-selector__title">Choose Component Type</h2>
            <p class="component-selector__description">
                Select the type of AEM component you want to generate. Each type includes 
                optimized templates and best practices.
            </p>
        `;
        
        // Create search/filter
        const filterSection = document.createElement('div');
        filterSection.className = 'component-selector__filter';
        filterSection.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" 
                       class="search-input" 
                       placeholder="Search components..." 
                       aria-label="Search components">
                <svg class="search-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                </svg>
            </div>
            <div class="category-filter">
                <button class="category-btn active" data-category="all">All</button>
                <button class="category-btn" data-category="Content">Content</button>
                <button class="category-btn" data-category="Media">Media</button>
                <button class="category-btn" data-category="Interactive">Interactive</button>
                <button class="category-btn" data-category="Layout">Layout</button>
            </div>
        `;
        
        // Create component grid
        const grid = document.createElement('div');
        grid.className = 'component-grid';
        
        // Populate with component cards
        Object.entries(AEMTemplates.componentTypes).forEach(([typeKey, config]) => {
            const card = this.createComponentCard(typeKey, config, onTypeSelected);
            grid.appendChild(card);
        });
        
        // Assemble container
        container.appendChild(header);
        container.appendChild(filterSection);
        container.appendChild(grid);
        
        // Add filter functionality
        this.setupComponentFiltering(container);
        
        return container;
    },

    /**
     * Sets up filtering functionality for component selector
     * @param {HTMLElement} container - Component selector container
     */
    setupComponentFiltering: function(container) {
        const searchInput = container.querySelector('.search-input');
        const categoryButtons = container.querySelectorAll('.category-btn');
        const cards = container.querySelectorAll('.component-card');
        
        let currentCategory = 'all';
        let currentSearch = '';
        
        // Filter function
        function filterComponents() {
            cards.forEach(card => {
                const typeKey = card.dataset.componentType;
                const config = AEMTemplates.componentTypes[typeKey];
                
                const matchesCategory = currentCategory === 'all' || 
                                      config.category === currentCategory;
                const matchesSearch = currentSearch === '' ||
                                    config.title.toLowerCase().includes(currentSearch) ||
                                    config.description.toLowerCase().includes(currentSearch);
                
                if (matchesCategory && matchesSearch) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
            
            // Show/hide empty state
            const visibleCards = container.querySelectorAll('.component-card:not(.hidden)');
            let emptyState = container.querySelector('.empty-state');
            
            if (visibleCards.length === 0) {
                if (!emptyState) {
                    emptyState = document.createElement('div');
                    emptyState.className = 'empty-state';
                    emptyState.innerHTML = `
                        <div class="empty-state__icon">🔍</div>
                        <h3 class="empty-state__title">No components found</h3>
                        <p class="empty-state__message">
                            Try adjusting your search terms or category filter.
                        </p>
                    `;
                    container.querySelector('.component-grid').appendChild(emptyState);
                }
                emptyState.style.display = 'block';
            } else if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
        
        // Search input handler
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            filterComponents();
        });
        
        // Category button handlers
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                filterComponents();
            });
        });
    },

    /**
     * Creates a form field based on field configuration
     * @param {Object} fieldConfig - Field configuration object
     * @param {*} currentValue - Current field value
     * @returns {HTMLElement} Form field element
     */
    createFormField: function(fieldConfig, currentValue = '') {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-field';
        
        const fieldId = `field-${fieldConfig.name}`;
        let fieldElement;
        
        // Create label
        const label = document.createElement('label');
        label.className = 'form-field__label';
        label.setAttribute('for', fieldId);
        label.innerHTML = `
            ${fieldConfig.label}
            ${fieldConfig.required ? '<span class="required-indicator">*</span>' : ''}
        `;
        
        // Create field based on type
        switch (fieldConfig.type) {
            case 'text':
                fieldElement = document.createElement('input');
                fieldElement.type = 'text';
                fieldElement.value = currentValue;
                fieldElement.placeholder = `Enter ${fieldConfig.label.toLowerCase()}`;
                break;
                
            case 'textarea':
                fieldElement = document.createElement('textarea');
                fieldElement.value = currentValue;
                fieldElement.placeholder = `Enter ${fieldConfig.label.toLowerCase()}`;
                fieldElement.rows = 4;
                break;
                
            case 'richtext':
                fieldElement = document.createElement('textarea');
                fieldElement.value = currentValue;
                fieldElement.placeholder = `Enter rich text content`;
                fieldElement.rows = 6;
                fieldElement.classList.add('richtext-field');
                break;
                
            case 'select':
                fieldElement = document.createElement('select');
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = `Select ${fieldConfig.label.toLowerCase()}`;
                fieldElement.appendChild(defaultOption);
                
                fieldConfig.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
                    if (option === currentValue || option === fieldConfig.default) {
                        optionElement.selected = true;
                    }
                    fieldElement.appendChild(optionElement);
                });
                break;
                
            case 'checkbox':
                fieldElement = document.createElement('input');
                fieldElement.type = 'checkbox';
                fieldElement.checked = currentValue === 'true' || currentValue === true;
                wrapper.classList.add('form-field--checkbox');
                break;
                
            case 'image':
                fieldElement = document.createElement('input');
                fieldElement.type = 'text';
                fieldElement.value = currentValue;
                fieldElement.placeholder = '/content/dam/example/image.jpg';
                
                // Add file browser button (simulated)
                const browseBtn = document.createElement('button');
                browseBtn.type = 'button';
                browseBtn.className = 'btn btn-secondary btn-small';
                browseBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z"/>
                    </svg>
                    Browse
                `;
                browseBtn.addEventListener('click', () => {
                    // Simulate file selection
                    const imagePath = prompt('Enter image path:', fieldElement.value);
                    if (imagePath) {
                        fieldElement.value = imagePath;
                        fieldElement.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                wrapper.classList.add('form-field--with-button');
                break;
                
            case 'pathfield':
                fieldElement = document.createElement('input');
                fieldElement.type = 'text';
                fieldElement.value = currentValue;
                fieldElement.placeholder = '/content/example/page';
                
                // Add path browser button (simulated)
                const pathBtn = document.createElement('button');
                pathBtn.type = 'button';
                pathBtn.className = 'btn btn-secondary btn-small';
                pathBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/>
                    </svg>
                    Browse
                `;
                pathBtn.addEventListener('click', () => {
                    // Simulate path selection
                    const path = prompt('Enter content path:', fieldElement.value);
                    if (path) {
                        fieldElement.value = path;
                        fieldElement.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                wrapper.classList.add('form-field--with-button');
                break;
                
            case 'colorfield':
                fieldElement = document.createElement('input');
                fieldElement.type = 'color';
                fieldElement.value = currentValue || '#3B82F6';
                break;
                
            default:
                fieldElement = document.createElement('input');
                fieldElement.type = 'text';
                fieldElement.value = currentValue;
                fieldElement.placeholder = `Enter ${fieldConfig.label.toLowerCase()}`;
        }
        
        // Set common attributes
        fieldElement.id = fieldId;
        fieldElement.name = fieldConfig.name;
        fieldElement.className = 'form-field__input';
        
        if (fieldConfig.required) {
            fieldElement.required = true;
        }
        
        // Create help text if needed
        let helpText = null;
        if (fieldConfig.description) {
            helpText = document.createElement('div');
            helpText.className = 'form-field__help';
            helpText.textContent = fieldConfig.description;
        }
        
        // Assemble field
        wrapper.appendChild(label);
        
        if (wrapper.classList.contains('form-field--with-button')) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.appendChild(fieldElement);
            inputGroup.appendChild(wrapper.querySelector('.btn'));
            wrapper.appendChild(inputGroup);
        } else {
            wrapper.appendChild(fieldElement);
        }
        
        if (helpText) {
            wrapper.appendChild(helpText);
        }
        
        return wrapper;
    },

    /**
     * Creates a component configuration form
     * @param {string} componentType - Component type
     * @param {Object} config - Component configuration
     * @param {Function} onFormChange - Form change callback
     * @param {Function} onGenerate - Generate button callback
     * @returns {HTMLElement} Form element
     */
    createComponentForm: function(componentType, config, onFormChange, onGenerate) {
        const form = document.createElement('form');
        form.className = 'component-form';
        form.setAttribute('novalidate', '');
        
        // Form header
        const header = document.createElement('div');
        header.className = 'component-form__header';
        header.innerHTML = `
            <div class="component-form__header-content">
                <div class="component-form__icon">${config.icon}</div>
                <div class="component-form__header-text">
                    <h2 class="component-form__title">${config.title}</h2>
                    <p class="component-form__description">${config.description}</p>
                </div>
            </div>
            <button type="button" class="component-form__back-btn btn btn-secondary" title="Back to component selection">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5"></path>
                    <path d="M12 19l-7-7 7-7"></path>
                </svg>
                Back
            </button>
        `;
        
        // Component name field
        const nameSection = document.createElement('div');
        nameSection.className = 'form-section';
        nameSection.innerHTML = `
            <h3 class="form-section__title">Component Information</h3>
            <p class="form-section__description">
                Configure the basic information for your component.
            </p>
        `;
        
        const nameField = this.createFormField({
            name: 'componentName',
            label: 'Component Name',
            type: 'text',
            required: true,
            description: 'Enter a descriptive name for your component (e.g., "Hero Banner", "Product Card")'
        });
        
        nameSection.appendChild(nameField);
        
        // Package configuration
        const packageField = this.createFormField({
            name: 'packageName',
            label: 'Java Package',
            type: 'text',
            required: true,
            description: 'Java package for the Sling Model (e.g., "com.example.aem.core")'
        });
        packageField.querySelector('input').value = 'com.example.aem.core';
        nameSection.appendChild(packageField);
        
        const projectField = this.createFormField({
            name: 'projectName',
            label: 'Project Name',
            type: 'text',
            required: true,
            description: 'Your AEM project name (used in resource types and paths)'
        });
        projectField.querySelector('input').value = 'myproject';
        nameSection.appendChild(projectField);
        
        // Component fields section
        const fieldsSection = document.createElement('div');
        fieldsSection.className = 'form-section';
        fieldsSection.innerHTML = `
            <h3 class="form-section__title">Component Properties</h3>
            <p class="form-section__description">
                Configure the properties that content authors can edit.
            </p>
        `;
        
        // Create fields for component properties
        config.fields.forEach(fieldConfig => {
            const field = this.createFormField(fieldConfig, fieldConfig.default || '');
            fieldsSection.appendChild(field);
        });
        
        // Generation options
        const optionsSection = document.createElement('div');
        optionsSection.className = 'form-section';
        optionsSection.innerHTML = `
            <h3 class="form-section__title">Generation Options</h3>
            <p class="form-section__description">
                Choose which files to generate for your component.
            </p>
        `;
        
        const generateOptions = [
            { name: 'generateHTL', label: 'HTL Template', checked: true },
            { name: 'generateSlingModel', label: 'Java Sling Model', checked: true },
            { name: 'generateDialog', label: 'Touch UI Dialog', checked: true },
            { name: 'generateCSS', label: 'Component Styles', checked: true },
            { name: 'generateReadme', label: 'Documentation', checked: true }
        ];
        
        generateOptions.forEach(option => {
            const field = this.createFormField({
                name: option.name,
                label: option.label,
                type: 'checkbox'
            }, option.checked);
            optionsSection.appendChild(field);
        });
        
        // Form actions
        const actions = document.createElement('div');
        actions.className = 'component-form__actions';
        actions.innerHTML = `
            <button type="button" class="btn btn-secondary component-form__preview-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview Code
            </button>
            <button type="submit" class="btn btn-primary component-form__generate-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Generate Component
            </button>
        `;
        
        // Assemble form
        form.appendChild(header);
        form.appendChild(nameSection);
        form.appendChild(fieldsSection);
        form.appendChild(optionsSection);
        form.appendChild(actions);
        
        // Add event handlers
        this.setupFormHandlers(form, onFormChange, onGenerate);
        
        return form;
    },

    /**
     * Sets up event handlers for the component form
     * @param {HTMLElement} form - Form element
     * @param {Function} onFormChange - Form change callback
     * @param {Function} onGenerate - Generate button callback
     */
    setupFormHandlers: function(form, onFormChange, onGenerate) {
        // Form change handler
        const handleFormChange = AEMGenerator.debounce(() => {
            const formData = this.getFormData(form);
            onFormChange(formData);
        }, 300);
        
        // Add listeners to all form inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', handleFormChange);
            input.addEventListener('change', handleFormChange);
        });
        
        // Back button
        const backBtn = form.querySelector('.component-form__back-btn');
        backBtn.addEventListener('click', () => {
            if (typeof resetToComponentSelection === 'function') {
                resetToComponentSelection();
            }
        });
        
        // Preview button
        const previewBtn = form.querySelector('.component-form__preview-btn');
        previewBtn.addEventListener('click', () => {
            const formData = this.getFormData(form);
            onGenerate(formData, true); // true for preview mode
        });
        
        // Generate button
        const generateBtn = form.querySelector('.component-form__generate-btn');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                const formData = this.getFormData(form);
                onGenerate(formData, false); // false for full generation
            }
        });
        
        // Real-time validation
        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            }
        });
    },

    /**
     * Gets form data as an object
     * @param {HTMLElement} form - Form element
     * @returns {Object} Form data object
     */
    getFormData: function(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
        
        return formData;
    },

    /**
     * Validates the entire form
     * @param {HTMLElement} form - Form element
     * @returns {boolean} True if form is valid
     */
    validateForm: function(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    /**
     * Validates a single form field
     * @param {HTMLElement} input - Input element
     * @returns {boolean} True if field is valid
     */
    validateField: function(input) {
        const wrapper = input.closest('.form-field');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        const existingError = wrapper.querySelector('.form-field__error');
        if (existingError) {
            existingError.remove();
            wrapper.classList.remove('form-field--error');
        }
        
        // Check required
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = `${input.labels[0]?.textContent.replace('*', '').trim()} is required`;
        }
        
        // Type-specific validation
        if (isValid && input.value.trim()) {
            switch (input.name) {
                case 'componentName':
                    if (!/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(input.value)) {
                        isValid = false;
                        errorMessage = 'Component name must start with a letter and contain only letters, numbers, and spaces';
                    }
                    break;
                    
                case 'packageName':
                    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(input.value)) {
                        isValid = false;
                        errorMessage = 'Package name must be a valid Java package (e.g., com.example.aem.core)';
                    }
                    break;
                    
                case 'projectName':
                    if (!/^[a-z][a-z0-9]*$/.test(input.value)) {
                        isValid = false;
                        errorMessage = 'Project name must be lowercase and contain only letters and numbers';
                    }
                    break;
            }
        }
        
        // Show error if invalid
        if (!isValid) {
            const errorElement = document.createElement('div');
            errorElement.className = 'form-field__error';
            errorElement.textContent = errorMessage;
            wrapper.appendChild(errorElement);
            wrapper.classList.add('form-field--error');
        }
        
        return isValid;
    },

    /**
     * Creates a code preview panel
     * @param {Object} generatedCode - Generated code object
     * @returns {HTMLElement} Preview panel element
     */
    createCodePreview: function(generatedCode) {
        const preview = document.createElement('div');
        preview.className = 'code-preview-panel';
        
        // Create tabs
        const tabs = document.createElement('div');
        tabs.className = 'code-tabs';
        
        const tabButtons = document.createElement('div');
        tabButtons.className = 'code-tabs__buttons';
        
        const tabContents = document.createElement('div');
        tabContents.className = 'code-tabs__contents';
        
        // Add tabs for each generated file
        Object.entries(generatedCode).forEach(([fileName, content], index) => {
            // Create tab button
            const tabBtn = document.createElement('button');
            tabBtn.className = `code-tab-btn ${index === 0 ? 'active' : ''}`;
            tabBtn.textContent = fileName;
            tabBtn.addEventListener('click', () => {
                // Update active tab
                tabButtons.querySelectorAll('.code-tab-btn').forEach(btn => 
                    btn.classList.remove('active'));
                tabBtn.classList.add('active');
                
                tabContents.querySelectorAll('.code-tab-content').forEach(content => 
                    content.classList.remove('active'));
                tabContent.classList.add('active');
            });
            
            // Create tab content
            const tabContent = document.createElement('div');
            tabContent.className = `code-tab-content ${index === 0 ? 'active' : ''}`;
            
            const pre = document.createElement('pre');
            pre.className = 'code-block';
            
            const code = document.createElement('code');
            code.textContent = content;
            code.className = this.getLanguageClass(fileName);
            
            pre.appendChild(code);
            tabContent.appendChild(pre);
            
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn btn btn-secondary btn-small';
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;
            copyBtn.addEventListener('click', () => this.copyToClipboard(content, fileName));
            
            tabContent.appendChild(copyBtn);
            
            tabButtons.appendChild(tabBtn);
            tabContents.appendChild(tabContent);
        });
        
        tabs.appendChild(tabButtons);
        tabs.appendChild(tabContents);
        preview.appendChild(tabs);
        
        return preview;
    },

    /**
     * Gets CSS class for syntax highlighting based on file name
     * @param {string} fileName - File name
     * @returns {string} Language class
     */
    getLanguageClass: function(fileName) {
        if (fileName.endsWith('.html')) return 'language-html';
        if (fileName.endsWith('.java')) return 'language-java';
        if (fileName.endsWith('.xml')) return 'language-xml';
        if (fileName.endsWith('.css') || fileName.endsWith('.scss')) return 'language-css';
        if (fileName.endsWith('.md')) return 'language-markdown';
        return 'language-text';
    },

    /**
     * Copies text to clipboard
     * @param {string} text - Text to copy
     * @param {string} fileName - File name for feedback
     */
    copyToClipboard: function(text, fileName) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                AEMGenerator.showToast('Copied!', `${fileName} copied to clipboard`, 'success', 2000);
            }).catch(() => {
                this.fallbackCopyToClipboard(text, fileName);
            });
        } else {
            this.fallbackCopyToClipboard(text, fileName);
        }
    },

    /**
     * Fallback copy method for older browsers
     * @param {string} text - Text to copy
     * @param {string} fileName - File name for feedback
     */
    fallbackCopyToClipboard: function(text, fileName) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            AEMGenerator.showToast('Copied!', `${fileName} copied to clipboard`, 'success', 2000);
        } catch (err) {
            AEMGenerator.showToast('Copy Failed', 'Please manually copy the code', 'error', 3000);
        }
        
        document.body.removeChild(textArea);
    }
};

// Export for use in other modules
window.UIComponents = UIComponents; 