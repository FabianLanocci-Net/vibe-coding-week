/**
 * ============================
 * AEM Component Generator - Main Generator Logic
 * Orchestrates component generation process and manages the UI flow
 * ============================
 */

/**
 * Component Generator Module
 * Handles the main component generation workflow
 */
const ComponentGenerator = {
    
    // Current state
    currentState: {
        step: 'selection', // 'selection', 'configuration', 'generation'
        componentType: null,
        componentConfig: null,
        formData: null,
        generatedCode: null
    },
    
    // UI references
    ui: {
        container: null,
        formContainer: null,
        previewContainer: null
    },
    
    /**
     * Initializes the component generator
     */
    initialize: function() {
        AEMGenerator.log('Initializing Component Generator...');
        
        try {
            // Check if required dependencies are loaded
            if (typeof AEMTemplates === 'undefined') {
                throw new Error('AEMTemplates not loaded');
            }
            
            if (typeof UIComponents === 'undefined') {
                throw new Error('UIComponents not loaded');
            }
            
            // Get UI containers
            this.ui.container = document.getElementById('generatorFormContent');
            this.ui.previewContainer = document.getElementById('codePreview');
            
            if (!this.ui.container) {
                throw new Error('Generator container not found');
            }
            
            AEMGenerator.log('Dependencies loaded, containers found');
            
            // Show component selector
            this.showComponentSelector();
            
            // Setup download functionality
            this.setupDownloadHandlers();
            
            AEMGenerator.log('Component Generator initialized successfully');
            
        } catch (error) {
            AEMGenerator.log(`Failed to initialize Component Generator: ${error.message}`, 'error');
            console.error('Generator initialization error:', error);
            
            // Show error with more details
            AEMGenerator.showToast(
                'Initialization Error',
                `Failed to load the component generator: ${error.message}`,
                'error'
            );
            
            // Try to initialize again after a delay
            setTimeout(() => {
                AEMGenerator.log('Retrying Component Generator initialization...');
                this.initialize();
            }, 1000);
        }
    },
    
    /**
     * Shows the component type selector
     */
    showComponentSelector: function() {
        AEMGenerator.log('Showing component selector');
        
        try {
            this.currentState.step = 'selection';
            this.currentState.componentType = null;
            this.currentState.componentConfig = null;
            
            // Hide preview
            if (this.ui.previewContainer) {
                this.ui.previewContainer.style.display = 'none';
            }
            
            // Verify AEMTemplates is available
            if (!AEMTemplates || !AEMTemplates.componentTypes) {
                throw new Error('AEMTemplates.componentTypes not available');
            }
            
            AEMGenerator.log(`Found ${Object.keys(AEMTemplates.componentTypes).length} component types`);
            
            // Create and show component selector
            const selector = UIComponents.createComponentSelector(
                (typeKey, config) => this.onComponentTypeSelected(typeKey, config)
            );
            
            this.ui.container.innerHTML = '';
            this.ui.container.appendChild(selector);
            
            // Add CSS for component selector
            this.addComponentSelectorStyles();
            
            AEMGenerator.log('Component selector displayed successfully');
            
        } catch (error) {
            AEMGenerator.log(`Error showing component selector: ${error.message}`, 'error');
            console.error('Component selector error:', error);
            
            // Show fallback UI
            this.ui.container.innerHTML = `
                <div class="error-state">
                    <div class="error-state__icon">⚠️</div>
                    <h3 class="error-state__title">Component Library Loading</h3>
                    <p class="error-state__message">
                        The component library is still loading. Please wait a moment or refresh the page.
                    </p>
                    <button onclick="ComponentGenerator.showComponentSelector()" class="btn btn-primary">
                        Retry
                    </button>
                </div>
            `;
        }
    },
    
    /**
     * Handles component type selection
     * @param {string} typeKey - Selected component type key
     * @param {Object} config - Component configuration
     */
    onComponentTypeSelected: function(typeKey, config) {
        AEMGenerator.log(`Component type selected: ${typeKey}`);
        
        this.currentState.step = 'configuration';
        this.currentState.componentType = typeKey;
        this.currentState.componentConfig = config;
        
        // Show configuration form
        this.showConfigurationForm(typeKey, config);
        
        // Update URL without page reload
        if (window.history && window.history.pushState) {
            window.history.pushState(
                { section: 'component-generator', step: 'configuration', type: typeKey },
                '',
                `#component-generator-${typeKey}`
            );
        }
    },
    
    /**
     * Shows the component configuration form
     * @param {string} componentType - Component type
     * @param {Object} config - Component configuration
     */
    showConfigurationForm: function(componentType, config) {
        AEMGenerator.log(`Showing configuration form for: ${componentType}`);
        
        // Create configuration form
        const form = UIComponents.createComponentForm(
            componentType,
            config,
            (formData) => this.onFormChange(formData),
            (formData, isPreview) => this.onGenerate(formData, isPreview)
        );
        
        // Clear container and add form
        this.ui.container.innerHTML = '';
        this.ui.container.appendChild(form);
        
        // Add CSS for component form
        this.addComponentFormStyles();
        
        // Setup back to selection functionality
        window.resetToComponentSelection = () => this.showComponentSelector();
        
        // Focus on component name field
        const nameField = form.querySelector('input[name="componentName"]');
        if (nameField) {
            nameField.focus();
        }
    },
    
    /**
     * Handles form data changes
     * @param {Object} formData - Current form data
     */
    onFormChange: function(formData) {
        this.currentState.formData = formData;
        
        // Auto-generate project and package names if not manually set
        if (formData.componentName && !formData.manuallySetProject) {
            const projectName = formData.componentName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .substring(0, 15);
            
            const projectField = document.querySelector('input[name="projectName"]');
            if (projectField && !projectField.dataset.manuallySet) {
                projectField.value = projectName || 'myproject';
            }
        }
    },
    
    /**
     * Handles component generation
     * @param {Object} formData - Form data
     * @param {boolean} isPreview - Whether this is a preview or full generation
     */
    onGenerate: function(formData, isPreview = false) {
        AEMGenerator.log(`Generating component (preview: ${isPreview})`);
        
        try {
            // Validate form data
            if (!this.validateGenerationData(formData)) {
                return;
            }
            
            // Show loading state
            if (!isPreview) {
                this.showLoadingState();
            }
            
            // Generate code
            const generatedCode = this.generateComponentCode(formData);
            
            if (isPreview) {
                this.showPreview(generatedCode);
            } else {
                this.showGenerationResults(generatedCode);
            }
            
            this.currentState.step = 'generation';
            this.currentState.generatedCode = generatedCode;
            
            // Analytics/tracking
            this.trackGeneration(formData, isPreview);
            
        } catch (error) {
            AEMGenerator.log(`Generation failed: ${error.message}`, 'error');
            
            this.hideLoadingState();
            
            AEMGenerator.showToast(
                'Generation Failed',
                `Failed to generate component: ${error.message}`,
                'error'
            );
        }
    },
    
    /**
     * Validates generation data
     * @param {Object} formData - Form data to validate
     * @returns {boolean} True if valid
     */
    validateGenerationData: function(formData) {
        const required = ['componentName', 'packageName', 'projectName'];
        
        for (const field of required) {
            if (!formData[field] || !formData[field].trim()) {
                AEMGenerator.showToast(
                    'Validation Error',
                    `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`,
                    'error'
                );
                return false;
            }
        }
        
        // Validate component name
        if (!/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(formData.componentName)) {
            AEMGenerator.showToast(
                'Validation Error',
                'Component name must start with a letter and contain only letters, numbers, and spaces',
                'error'
            );
            return false;
        }
        
        // Validate package name
        if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(formData.packageName)) {
            AEMGenerator.showToast(
                'Validation Error',
                'Package name must be a valid Java package',
                'error'
            );
            return false;
        }
        
        // Validate project name
        if (!/^[a-z][a-z0-9]*$/.test(formData.projectName)) {
            AEMGenerator.showToast(
                'Validation Error',
                'Project name must be lowercase and contain only letters and numbers',
                'error'
            );
            return false;
        }
        
        return true;
    },
    
    /**
     * Generates component code using templates
     * @param {Object} formData - Form configuration data
     * @returns {Object} Generated code files
     */
    generateComponentCode: function(formData) {
        AEMGenerator.log('Generating component code...');
        
        const componentType = this.currentState.componentType;
        const config = this.currentState.componentConfig;
        const generatedCode = {};
        
        // Extract field values for component
        const componentFields = config.fields.map(field => ({
            ...field,
            value: formData[field.name] || field.default || ''
        }));
        
        // Generate files based on selected options
        if (formData.generateHTL !== false) {
            const htlContent = AEMTemplates.generateHTL(
                formData.componentName,
                componentType,
                componentFields
            );
            generatedCode[`${this.getKebabCaseName(formData.componentName)}.html`] = 
                this.interpolateVariables(htlContent, formData);
        }
        
        if (formData.generateSlingModel !== false) {
            const javaContent = AEMTemplates.generateSlingModel(
                formData.componentName,
                componentType,
                componentFields,
                formData.packageName
            );
            generatedCode[`${this.getPascalCaseName(formData.componentName)}Model.java`] = 
                this.interpolateVariables(javaContent, formData);
        }
        
        if (formData.generateDialog !== false) {
            const dialogContent = AEMTemplates.generateDialog(
                formData.componentName,
                componentType,
                componentFields
            );
            generatedCode['_cq_dialog/.content.xml'] = 
                this.interpolateVariables(dialogContent, formData);
        }
        
        if (formData.generateCSS !== false) {
            const cssContent = AEMTemplates.generateCSS(
                formData.componentName,
                componentType
            );
            generatedCode[`${this.getKebabCaseName(formData.componentName)}.scss`] = cssContent;
        }
        
        if (formData.generateReadme !== false) {
            const readmeContent = AEMTemplates.generateReadme(
                formData.componentName,
                componentType,
                componentFields
            );
            generatedCode['README.md'] = readmeContent;
        }
        
        AEMGenerator.log(`Generated ${Object.keys(generatedCode).length} files`);
        return generatedCode;
    },
    
    /**
     * Interpolates template variables
     * @param {string} content - Template content
     * @param {Object} formData - Form data for variable substitution
     * @returns {string} Interpolated content
     */
    interpolateVariables: function(content, formData) {
        return content
            .replace(/\{\{componentPackage\}\}/g, formData.packageName)
            .replace(/\{\{projectName\}\}/g, formData.projectName)
            .replace(/\{\{componentName\}\}/g, formData.componentName)
            .replace(/\{\{kebabCase\}\}/g, this.getKebabCaseName(formData.componentName))
            .replace(/\{\{pascalCase\}\}/g, this.getPascalCaseName(formData.componentName))
            .replace(/\{\{camelCase\}\}/g, this.getCamelCaseName(formData.componentName));
    },
    
    /**
     * Shows loading state during generation
     */
    showLoadingState: function() {
        const loading = document.getElementById('loadingIndicator');
        if (loading) {
            loading.style.display = 'flex';
        }
        
        // Disable generate button
        const generateBtn = document.querySelector('.component-form__generate-btn');
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `
                <div class="spinner" style="width: 1rem; height: 1rem; margin-right: 0.5rem;"></div>
                Generating...
            `;
        }
    },
    
    /**
     * Hides loading state
     */
    hideLoadingState: function() {
        const loading = document.getElementById('loadingIndicator');
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Re-enable generate button
        const generateBtn = document.querySelector('.component-form__generate-btn');
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Generate Component
            `;
        }
    },
    
    /**
     * Shows code preview
     * @param {Object} generatedCode - Generated code files
     */
    showPreview: function(generatedCode) {
        AEMGenerator.log('Showing code preview');
        
        if (!this.ui.previewContainer) {
            AEMGenerator.log('Preview container not found', 'warn');
            return;
        }
        
        // Create preview content
        const previewContent = UIComponents.createCodePreview(generatedCode);
        
        // Update preview container
        const existingContent = this.ui.previewContainer.querySelector('#previewContent');
        if (existingContent) {
            existingContent.innerHTML = '';
            existingContent.appendChild(previewContent);
        }
        
        // Show preview container
        this.ui.previewContainer.style.display = 'block';
        
        // Scroll to preview
        this.ui.previewContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        AEMGenerator.showToast(
            'Preview Ready',
            'Code preview is now available below',
            'success',
            3000
        );
    },
    
    /**
     * Shows final generation results
     * @param {Object} generatedCode - Generated code files
     */
    showGenerationResults: function(generatedCode) {
        AEMGenerator.log('Showing generation results');
        
        // Hide loading
        this.hideLoadingState();
        
        // Show preview
        this.showPreview(generatedCode);
        
        // Show success message
        AEMGenerator.showToast(
            'Component Generated!',
            `Successfully generated ${Object.keys(generatedCode).length} files`,
            'success',
            5000
        );
        
        // Update page state
        if (window.history && window.history.replaceState) {
            window.history.replaceState(
                { 
                    section: 'component-generator', 
                    step: 'generation',
                    type: this.currentState.componentType 
                },
                '',
                `#component-generator-${this.currentState.componentType}-generated`
            );
        }
    },
    
    /**
     * Sets up download functionality
     */
    setupDownloadHandlers: function() {
        const copyAllBtn = document.getElementById('copyAllBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', () => this.copyAllCode());
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadZip());
        }
    },
    
    /**
     * Copies all generated code to clipboard
     */
    copyAllCode: function() {
        if (!this.currentState.generatedCode) {
            AEMGenerator.showToast('No Code', 'No code has been generated yet', 'warning');
            return;
        }
        
        let allCode = '';
        Object.entries(this.currentState.generatedCode).forEach(([fileName, content]) => {
            allCode += `// ========== ${fileName} ==========\n\n${content}\n\n`;
        });
        
        UIComponents.copyToClipboard(allCode, 'All Files');
    },
    
    /**
     * Downloads generated code as a ZIP file
     */
    downloadZip: function() {
        if (!this.currentState.generatedCode) {
            AEMGenerator.showToast('No Code', 'No code has been generated yet', 'warning');
            return;
        }
        
        try {
            // Create ZIP content using a simple text-based approach
            // In a real implementation, you might use a library like JSZip
            this.downloadAsArchive();
            
        } catch (error) {
            AEMGenerator.log(`Download failed: ${error.message}`, 'error');
            AEMGenerator.showToast(
                'Download Failed',
                'Could not create download. Please copy the code manually.',
                'error'
            );
        }
    },
    
    /**
     * Downloads files as individual downloads (fallback)
     */
    downloadAsArchive: function() {
        const componentName = this.getKebabCaseName(this.currentState.formData.componentName);
        
        // Create a simple archive format
        let archiveContent = `# AEM Component: ${componentName}\n`;
        archiveContent += `# Generated: ${new Date().toISOString()}\n`;
        archiveContent += `# Component Type: ${this.currentState.componentType}\n\n`;
        
        Object.entries(this.currentState.generatedCode).forEach(([fileName, content]) => {
            archiveContent += `\n${'='.repeat(60)}\n`;
            archiveContent += `FILE: ${fileName}\n`;
            archiveContent += `${'='.repeat(60)}\n\n`;
            archiveContent += content;
            archiveContent += '\n';
        });
        
        // Download as text file
        const blob = new Blob([archiveContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${componentName}-component.txt`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        AEMGenerator.showToast(
            'Download Started',
            'Component files are being downloaded as a text archive',
            'success',
            4000
        );
    },
    
    /**
     * Tracks generation events for analytics
     * @param {Object} formData - Form data
     * @param {boolean} isPreview - Whether this was a preview
     */
    trackGeneration: function(formData, isPreview) {
        // Analytics tracking could be implemented here
        AEMGenerator.log(`Tracked generation: ${formData.componentName} (preview: ${isPreview})`);
        
        // Example: Send to analytics service
        // gtag('event', 'component_generated', {
        //     component_type: this.currentState.componentType,
        //     component_name: formData.componentName,
        //     is_preview: isPreview
        // });
    },
    
    /**
     * Utility functions for name conversions
     */
    getKebabCaseName: function(name) {
        return name.replace(/[^a-zA-Z0-9]/g, '-')
                  .replace(/-+/g, '-')
                  .toLowerCase()
                  .replace(/^-|-$/g, '');
    },
    
    getPascalCaseName: function(name) {
        return name.replace(/[^a-zA-Z0-9]/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join('');
    },
    
    getCamelCaseName: function(name) {
        const pascal = this.getPascalCaseName(name);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    },
    
    /**
     * Adds component selector styles
     */
    addComponentSelectorStyles: function() {
        if (document.getElementById('component-selector-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'component-selector-styles';
        style.textContent = `
            .component-selector {
                padding: 2rem 0;
            }
            
            .component-selector__header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .component-selector__title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .component-selector__description {
                color: var(--gray-600);
                max-width: 32rem;
                margin: 0 auto;
            }
            
            .component-selector__filter {
                margin-bottom: 2rem;
            }
            
            .search-input-wrapper {
                position: relative;
                margin-bottom: 1rem;
                max-width: 24rem;
                margin-left: auto;
                margin-right: auto;
            }
            
            .search-input {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 2.5rem;
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-lg);
                font-size: 1rem;
                transition: border-color 0.2s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--primary-blue);
                box-shadow: 0 0 0 3px var(--primary-blue-lighter);
            }
            
            .search-input__icon {
                position: absolute;
                left: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                width: 1rem;
                height: 1rem;
                color: var(--gray-400);
                pointer-events: none;
            }
            
            .category-filter {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .category-btn {
                padding: 0.5rem 1rem;
                border: 1px solid var(--gray-300);
                background: white;
                color: var(--gray-700);
                border-radius: var(--radius-lg);
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .category-btn:hover {
                border-color: var(--primary-blue);
                color: var(--primary-blue);
            }
            
            .category-btn.active {
                background: var(--primary-blue);
                border-color: var(--primary-blue);
                color: white;
            }
            
            .component-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }
            
            .component-card {
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-xl);
                padding: 1.5rem;
                transition: all 0.2s ease;
                cursor: pointer;
            }
            
            .component-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
                border-color: var(--primary-blue-light);
            }
            
            .component-card:focus {
                outline: 2px solid var(--primary-blue);
                outline-offset: 2px;
            }
            
            .component-card__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
            }
            
            .component-card__icon {
                font-size: 2rem;
            }
            
            .component-card__category {
                font-size: 0.75rem;
                font-weight: 500;
                color: var(--primary-blue);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .component-card__title {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .component-card__description {
                color: var(--gray-600);
                font-size: 0.875rem;
                line-height: 1.5;
                margin-bottom: 1rem;
            }
            
            .component-card__footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .component-card__fields-count {
                font-size: 0.75rem;
                color: var(--gray-500);
            }
            
            .component-card__select-btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
            
            .empty-state {
                grid-column: 1 / -1;
                text-align: center;
                padding: 3rem 1rem;
                color: var(--gray-600);
            }
            
            .empty-state__icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.7;
            }
            
            .empty-state__title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .error-state {
                text-align: center;
                padding: 3rem 1rem;
                color: var(--gray-600);
            }
            
            .error-state__icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.7;
            }
            
            .error-state__title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .error-state__message {
                margin-bottom: 1.5rem;
                max-width: 28rem;
                margin-left: auto;
                margin-right: auto;
            }
            
            @media (max-width: 640px) {
                .component-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .component-card {
                    padding: 1rem;
                }
                
                .category-filter {
                    gap: 0.25rem;
                }
                
                .category-btn {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.8rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Adds component form styles
     */
    addComponentFormStyles: function() {
        if (document.getElementById('component-form-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'component-form-styles';
        style.textContent = `
            .component-form {
                max-width: 48rem;
                margin: 0 auto;
            }
            
            .component-form__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid var(--gray-200);
            }
            
            .component-form__header-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .component-form__icon {
                font-size: 2.5rem;
                flex-shrink: 0;
            }
            
            .component-form__title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.25rem;
            }
            
            .component-form__description {
                color: var(--gray-600);
                font-size: 0.9rem;
            }
            
            .form-section {
                margin-bottom: 2rem;
            }
            
            .form-section__title {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
            }
            
            .form-section__description {
                color: var(--gray-600);
                font-size: 0.875rem;
                margin-bottom: 1.5rem;
            }
            
            .form-field {
                margin-bottom: 1.5rem;
            }
            
            .form-field__label {
                display: block;
                font-weight: 500;
                color: var(--gray-900);
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }
            
            .required-indicator {
                color: var(--error);
                margin-left: 0.25rem;
            }
            
            .form-field__input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-md);
                font-size: 1rem;
                transition: border-color 0.2s ease;
            }
            
            .form-field__input:focus {
                outline: none;
                border-color: var(--primary-blue);
                box-shadow: 0 0 0 3px var(--primary-blue-lighter);
            }
            
            .form-field__input[type="checkbox"] {
                width: auto;
                margin-right: 0.5rem;
            }
            
            .form-field--checkbox {
                display: flex;
                align-items: center;
            }
            
            .form-field--checkbox .form-field__label {
                margin-bottom: 0;
                margin-left: 0.5rem;
                font-weight: 400;
            }
            
            .form-field--with-button .input-group {
                display: flex;
                gap: 0.5rem;
            }
            
            .form-field--with-button .form-field__input {
                flex: 1;
            }
            
            .form-field__help {
                font-size: 0.8rem;
                color: var(--gray-500);
                margin-top: 0.25rem;
            }
            
            .form-field__error {
                font-size: 0.8rem;
                color: var(--error);
                margin-top: 0.25rem;
            }
            
            .form-field--error .form-field__input {
                border-color: var(--error);
            }
            
            .component-form__actions {
                display: flex;
                gap: 1rem;
                justify-content: space-between;
                align-items: center;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid var(--gray-200);
            }
            
            .btn-small {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
            
            .richtext-field {
                min-height: 120px;
                resize: vertical;
            }
            
            @media (max-width: 640px) {
                .component-form__header {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
                
                .component-form__actions {
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .component-form__actions .btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
};

/**
 * Initialize component generator when main app is ready
 */
function initializeComponentGenerator() {
    if (typeof ComponentGenerator !== 'undefined') {
        ComponentGenerator.initialize();
    }
}

// Export for global access
window.ComponentGenerator = ComponentGenerator;
window.initializeComponentGenerator = initializeComponentGenerator;

AEMGenerator.log('Generator module loaded'); 