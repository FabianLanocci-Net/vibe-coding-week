/**
 * ============================
 * AEM Component Generator - Templates Library
 * Professional AEM Component Templates following best practices
 * ============================
 */

/**
 * Template interpolation utility
 * Replaces placeholders in templates with actual values
 * @param {string} template - Template string with placeholders
 * @param {Object} variables - Object containing variable values
 * @returns {string} Interpolated template
 */
function interpolateTemplate(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return variables[key] !== undefined ? variables[key] : match;
    });
}

/**
 * Converts string to various naming conventions
 * @param {string} str - Input string
 * @returns {Object} Object with different naming conventions
 */
function createNamingConventions(str) {
    const camelCase = str.replace(/[^a-zA-Z0-9]/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim()
                         .split(' ')
                         .map((word, index) => 
                             index === 0 ? word.toLowerCase() : 
                             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                         )
                         .join('');
    
    const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    const kebabCase = str.replace(/[^a-zA-Z0-9]/g, '-')
                         .replace(/-+/g, '-')
                         .toLowerCase()
                         .replace(/^-|-$/g, '');
    const snakeCase = str.replace(/[^a-zA-Z0-9]/g, '_')
                         .replace(/_+/g, '_')
                         .toLowerCase()
                         .replace(/^_|_$/g, '');
    const constantCase = snakeCase.toUpperCase();
    
    return {
        camelCase,
        pascalCase,
        kebabCase,
        snakeCase,
        constantCase,
        original: str
    };
}

/**
 * AEM Component Templates Library
 * Contains all templates for generating AEM components
 */
const AEMTemplates = {
    
    /**
     * Component Types Configuration
     * Defines available component types and their properties
     */
    componentTypes: {
        'text-component': {
            title: 'Text Component',
            description: 'A flexible text component with rich text editing capabilities',
            category: 'Content',
            icon: '📝',
            fields: [
                { name: 'title', type: 'text', label: 'Title', required: false },
                { name: 'text', type: 'richtext', label: 'Rich Text Content', required: true },
                { name: 'alignment', type: 'select', label: 'Text Alignment', 
                  options: ['left', 'center', 'right'], default: 'left' }
            ]
        },
        'image-component': {
            title: 'Image Component',
            description: 'Responsive image component with multiple format support',
            category: 'Media',
            icon: '🖼️',
            fields: [
                { name: 'image', type: 'image', label: 'Image', required: true },
                { name: 'alt', type: 'text', label: 'Alt Text', required: true },
                { name: 'caption', type: 'text', label: 'Caption', required: false },
                { name: 'linkUrl', type: 'pathfield', label: 'Link URL', required: false }
            ]
        },
        'button-component': {
            title: 'Button Component',
            description: 'Customizable button with various styles and actions',
            category: 'Interactive',
            icon: '🔘',
            fields: [
                { name: 'text', type: 'text', label: 'Button Text', required: true },
                { name: 'url', type: 'pathfield', label: 'URL', required: false },
                { name: 'style', type: 'select', label: 'Button Style',
                  options: ['primary', 'secondary', 'outline'], default: 'primary' },
                { name: 'size', type: 'select', label: 'Size',
                  options: ['small', 'medium', 'large'], default: 'medium' }
            ]
        },
        'container-component': {
            title: 'Container Component',
            description: 'Layout container for organizing other components',
            category: 'Layout',
            icon: '📦',
            fields: [
                { name: 'containerType', type: 'select', label: 'Container Type',
                  options: ['default', 'fluid', 'fixed'], default: 'default' },
                { name: 'backgroundColor', type: 'colorfield', label: 'Background Color', required: false },
                { name: 'padding', type: 'select', label: 'Padding',
                  options: ['none', 'small', 'medium', 'large'], default: 'medium' }
            ]
        },
        'hero-component': {
            title: 'Hero Component',
            description: 'Eye-catching hero section with image and text overlay',
            category: 'Content',
            icon: '🦸',
            fields: [
                { name: 'backgroundImage', type: 'image', label: 'Background Image', required: true },
                { name: 'title', type: 'text', label: 'Hero Title', required: true },
                { name: 'subtitle', type: 'text', label: 'Subtitle', required: false },
                { name: 'ctaText', type: 'text', label: 'CTA Button Text', required: false },
                { name: 'ctaUrl', type: 'pathfield', label: 'CTA URL', required: false }
            ]
        },
        'card-component': {
            title: 'Card Component',
            description: 'Versatile card component for displaying content blocks',
            category: 'Content',
            icon: '🃏',
            fields: [
                { name: 'image', type: 'image', label: 'Card Image', required: false },
                { name: 'title', type: 'text', label: 'Card Title', required: true },
                { name: 'description', type: 'textarea', label: 'Description', required: false },
                { name: 'link', type: 'pathfield', label: 'Card Link', required: false }
            ]
        }
    },

    /**
     * HTL Template Generator
     * Creates HTL (HTML Template Language) files for AEM components
     */
    generateHTL: function(componentName, componentType, fields) {
        const naming = createNamingConventions(componentName);
        const config = this.componentTypes[componentType];
        
        let htlContent = `<!--
============================
${config.title} - HTL Template
Component: ${naming.kebabCase}
Description: ${config.description}
Author: AEM Component Generator
Generated: ${new Date().toISOString()}
============================
-->

<!--/* 
    Component HTL Script for ${config.title}
    
    This HTL template follows AEM best practices:
    - Uses data-sly-use for Sling Model integration
    - Implements proper placeholder for authoring experience
    - Includes semantic HTML structure
    - Supports responsive design patterns
*/-->

<div class="cmp-${naming.kebabCase}" 
     data-cmp-is="${naming.kebabCase}"
     data-sly-use.model="{{componentPackage}}.models.${naming.pascalCase}Model">
    
    <!--/* Component Placeholder for Authoring */-->
    <div class="cmp-placeholder" 
         data-emptytext="${config.title}" 
         data-sly-test="\${(wcmmode.edit || wcmmode.preview) && model.isEmpty}">
    </div>
    
    <!--/* Main Component Content */-->
    <div class="cmp-${naming.kebabCase}__content" data-sly-test="\${!model.isEmpty}">
`;

        // Generate field-specific HTL based on component type
        switch (componentType) {
            case 'text-component':
                htlContent += `        <!--/* Title Section */-->
        <div class="cmp-${naming.kebabCase}__title-wrapper" data-sly-test="\${model.title}">
            <h2 class="cmp-${naming.kebabCase}__title">\${model.title}</h2>
        </div>
        
        <!--/* Rich Text Content */-->
        <div class="cmp-${naming.kebabCase}__text" 
             data-sly-test="\${model.text}"
             data-sly-attribute.class="cmp-${naming.kebabCase}__text--\${model.alignment}">
            \${model.text @ context='html'}
        </div>`;
                break;
                
            case 'image-component':
                htlContent += `        <!--/* Image Element */-->
        <div class="cmp-${naming.kebabCase}__image-wrapper" data-sly-test="\${model.hasImage}">
            <img class="cmp-${naming.kebabCase}__image"
                 src="\${model.imageSrc}"
                 alt="\${model.alt}"
                 data-sly-attribute.title="\${model.caption}"
                 loading="lazy" />
        </div>
        
        <!--/* Caption */-->
        <div class="cmp-${naming.kebabCase}__caption" data-sly-test="\${model.caption}">
            \${model.caption}
        </div>`;
                break;
                
            case 'button-component':
                htlContent += `        <!--/* Button Element */-->
        <div class="cmp-${naming.kebabCase}__wrapper">
            <a class="cmp-${naming.kebabCase}__button btn btn--\${model.style} btn--\${model.size}"
               href="\${model.url}"
               data-sly-attribute.target="\${model.isExternalLink ? '_blank' : ''}"
               data-sly-attribute.rel="\${model.isExternalLink ? 'noopener noreferrer' : ''}">
                \${model.text}
            </a>
        </div>`;
                break;
                
            case 'container-component':
                htlContent += `        <!--/* Container Content */-->
        <div class="cmp-${naming.kebabCase}__inner container--\${model.containerType}"
             data-sly-attribute.style="\${model.inlineStyles}">
            <!--/* Parsys for child components */-->
            <div data-sly-resource="\${resource @ resourceType='wcm/foundation/components/parsys'}"></div>
        </div>`;
                break;
                
            case 'hero-component':
                htlContent += `        <!--/* Hero Background */-->
        <div class="cmp-${naming.kebabCase}__background"
             data-sly-attribute.style="background-image: url('\${model.backgroundImageSrc}');">
            
            <!--/* Hero Content Overlay */-->
            <div class="cmp-${naming.kebabCase}__overlay">
                <div class="cmp-${naming.kebabCase}__content-wrapper">
                    
                    <!--/* Hero Title */-->
                    <h1 class="cmp-${naming.kebabCase}__title" data-sly-test="\${model.title}">
                        \${model.title}
                    </h1>
                    
                    <!--/* Hero Subtitle */-->
                    <p class="cmp-${naming.kebabCase}__subtitle" data-sly-test="\${model.subtitle}">
                        \${model.subtitle}
                    </p>
                    
                    <!--/* CTA Button */-->
                    <div class="cmp-${naming.kebabCase}__cta" data-sly-test="\${model.ctaText && model.ctaUrl}">
                        <a class="cmp-${naming.kebabCase}__cta-button btn btn--primary btn--large"
                           href="\${model.ctaUrl}">
                            \${model.ctaText}
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
                break;
                
            case 'card-component':
                htlContent += `        <!--/* Card Image */-->
        <div class="cmp-${naming.kebabCase}__image-wrapper" data-sly-test="\${model.hasImage}">
            <img class="cmp-${naming.kebabCase}__image"
                 src="\${model.imageSrc}"
                 alt="\${model.imageAlt}"
                 loading="lazy" />
        </div>
        
        <!--/* Card Content */-->
        <div class="cmp-${naming.kebabCase}__body">
            <!--/* Card Title */-->
            <h3 class="cmp-${naming.kebabCase}__title" data-sly-test="\${model.title}">
                \${model.title}
            </h3>
            
            <!--/* Card Description */-->
            <p class="cmp-${naming.kebabCase}__description" data-sly-test="\${model.description}">
                \${model.description}
            </p>
            
            <!--/* Card Link */-->
            <div class="cmp-${naming.kebabCase}__link-wrapper" data-sly-test="\${model.link}">
                <a class="cmp-${naming.kebabCase}__link" href="\${model.link}">
                    Read More <span class="sr-only">about \${model.title}</span>
                </a>
            </div>
        </div>`;
                break;
        }

        htlContent += `    </div>
</div>`;

        return htlContent;
    },

    /**
     * Java Sling Model Generator
     * Creates Java Sling Model classes for AEM components
     */
    generateSlingModel: function(componentName, componentType, fields, packageName = 'com.example.aem.core') {
        const naming = createNamingConventions(componentName);
        const config = this.componentTypes[componentType];
        
        let javaContent = `/*
 * ============================
 * ${config.title} - Sling Model
 * Component: ${naming.kebabCase}
 * Description: ${config.description}
 * Author: AEM Component Generator
 * Generated: ${new Date().toISOString()}
 * ============================
 */

package ${packageName}.models;

import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

/**
 * Sling Model for ${config.title}
 * 
 * This model provides business logic and data processing for the ${config.title}.
 * It follows AEM best practices for Sling Models:
 * - Uses proper injection strategies
 * - Implements JSON export for SPA integration
 * - Provides validation and transformation methods
 * - Includes proper null checks and defaults
 */
@Model(
    adaptables = {SlingHttpServletRequest.class, Resource.class},
    adapters = {${naming.pascalCase}Model.class},
    resourceType = ${naming.pascalCase}Model.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class ${naming.pascalCase}Model {

    /**
     * Resource type constant for this component
     */
    public static final String RESOURCE_TYPE = "{{projectName}}/components/${naming.kebabCase}";

    @SlingObject
    private Resource resource;

    @SlingObject
    private SlingHttpServletRequest request;
`;

        // Generate field declarations based on component fields
        fields.forEach(field => {
            const fieldNaming = createNamingConventions(field.name);
            javaContent += `
    @ValueMapValue
    private String ${fieldNaming.camelCase};
`;
        });

        javaContent += `
    /**
     * Post-construct method for additional initialization
     */
    @PostConstruct
    protected void init() {
        // Additional initialization logic can be added here
    }

    /**
     * Checks if the component has sufficient content to display
     * @return true if the component should be rendered, false otherwise
     */
    public boolean isEmpty() {`;

        // Generate isEmpty logic based on component type
        switch (componentType) {
            case 'text-component':
                javaContent += `
        return StringUtils.isBlank(text);`;
                break;
            case 'image-component':
                javaContent += `
        return StringUtils.isBlank(image);`;
                break;
            case 'button-component':
                javaContent += `
        return StringUtils.isBlank(text);`;
                break;
            default:
                javaContent += `
        return false; // Override this method based on your component's requirements`;
        }

        javaContent += `
    }
`;

        // Generate getter methods for each field
        fields.forEach(field => {
            const fieldNaming = createNamingConventions(field.name);
            const methodName = `get${fieldNaming.pascalCase}`;
            
            javaContent += `
    /**
     * Gets the ${field.label.toLowerCase()}
     * @return the ${field.label.toLowerCase()} value
     */
    public String ${methodName}() {`;

            // Add field-specific logic
            switch (field.type) {
                case 'richtext':
                    javaContent += `
        return StringUtils.isNotBlank(${fieldNaming.camelCase}) ? ${fieldNaming.camelCase} : null;`;
                    break;
                case 'image':
                    javaContent += `
        return StringUtils.isNotBlank(${fieldNaming.camelCase}) ? ${fieldNaming.camelCase} : null;`;
                    break;
                case 'select':
                    const defaultValue = field.default || field.options[0];
                    javaContent += `
        return StringUtils.isNotBlank(${fieldNaming.camelCase}) ? ${fieldNaming.camelCase} : "${defaultValue}";`;
                    break;
                default:
                    javaContent += `
        return StringUtils.isNotBlank(${fieldNaming.camelCase}) ? ${fieldNaming.camelCase} : null;`;
            }

            javaContent += `
    }`;
        });

        // Add component-specific helper methods
        switch (componentType) {
            case 'image-component':
                javaContent += `

    /**
     * Checks if the component has a valid image
     * @return true if image is present, false otherwise
     */
    public boolean hasImage() {
        return StringUtils.isNotBlank(getImage());
    }

    /**
     * Gets the processed image source URL
     * @return the image source URL with proper sizing
     */
    public String getImageSrc() {
        String imagePath = getImage();
        if (StringUtils.isBlank(imagePath)) {
            return null;
        }
        // Add image transformation logic here if needed
        return imagePath;
    }`;
                break;
                
            case 'button-component':
                javaContent += `

    /**
     * Checks if the URL is an external link
     * @return true if URL is external, false otherwise
     */
    public boolean isExternalLink() {
        String url = getUrl();
        return StringUtils.isNotBlank(url) && 
               (url.startsWith("http://") || url.startsWith("https://"));
    }`;
                break;
                
            case 'container-component':
                javaContent += `

    /**
     * Gets inline styles for the container
     * @return CSS style string
     */
    public String getInlineStyles() {
        StringBuilder styles = new StringBuilder();
        
        if (StringUtils.isNotBlank(getBackgroundColor())) {
            styles.append("background-color: ").append(getBackgroundColor()).append(";");
        }
        
        return styles.length() > 0 ? styles.toString() : null;
    }`;
                break;
                
            case 'hero-component':
                javaContent += `

    /**
     * Gets the processed background image source URL
     * @return the background image source URL
     */
    public String getBackgroundImageSrc() {
        String imagePath = getBackgroundImage();
        if (StringUtils.isBlank(imagePath)) {
            return null;
        }
        // Add image transformation logic here if needed
        return imagePath;
    }`;
                break;
        }

        javaContent += `
}`;

        return javaContent;
    },

    /**
     * Dialog Configuration Generator
     * Creates AEM Touch UI dialog configurations
     */
    generateDialog: function(componentName, componentType, fields) {
        const naming = createNamingConventions(componentName);
        const config = this.componentTypes[componentType];
        
        let dialogContent = `<?xml version="1.0" encoding="UTF-8"?>
<!--
============================
${config.title} - Dialog Configuration
Component: ${naming.kebabCase}
Description: ${config.description}
Author: AEM Component Generator
Generated: ${new Date().toISOString()}
============================
-->

<!--
This dialog configuration defines the authoring interface for the ${config.title}.
It follows AEM Touch UI dialog standards and provides a user-friendly
interface for content authors to configure the component.
-->

<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="${config.title}"
          sling:resourceType="cq/gui/components/authoring/dialog"
          extraClientlibs="[{{projectName}}.authoring]"
          helpPath="https://docs.adobe.com/content/help/en/experience-manager-core-components/using/components/"
          trackingFeature="aem:sites:components:${naming.kebabCase}">
          
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container">
        
        <items jcr:primaryType="nt:unstructured">
            
            <!-- Main Tab -->
            <tabs
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/tabs"
                maximized="{Boolean}true">
                
                <items jcr:primaryType="nt:unstructured">
                    
                    <!-- Properties Tab -->
                    <properties
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Properties"
                        sling:resourceType="granite/ui/components/coral/foundation/container"
                        margin="{Boolean}true">
                        
                        <items jcr:primaryType="nt:unstructured">
`;

        // Generate form fields based on component configuration
        fields.forEach((field, index) => {
            const fieldNaming = createNamingConventions(field.name);
            dialogContent += `
                            <!-- ${field.label} Field -->
                            <${fieldNaming.camelCase}
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/${this.getDialogFieldType(field.type)}"
                                fieldLabel="${field.label}"
                                name="./${fieldNaming.camelCase}"`;
            
            if (field.required) {
                dialogContent += `
                                required="{Boolean}true"`;
            }
            
            // Add field-specific attributes
            switch (field.type) {
                case 'richtext':
                    dialogContent += `
                                useFixedInlineToolbar="{Boolean}true">
                                <rtePlugins jcr:primaryType="nt:unstructured">
                                    <format
                                        jcr:primaryType="nt:unstructured"
                                        features="[bold,italic,underline]"/>
                                    <justify
                                        jcr:primaryType="nt:unstructured"
                                        features="[justifyleft,justifycenter,justifyright]"/>
                                    <lists
                                        jcr:primaryType="nt:unstructured"
                                        features="[unordered,ordered]"/>
                                    <links
                                        jcr:primaryType="nt:unstructured"
                                        features="[modifylink,unlink]"/>
                                </rtePlugins>
                            </${fieldNaming.camelCase}>`;
                    break;
                    
                case 'select':
                    dialogContent += `>
                                <items jcr:primaryType="nt:unstructured">`;
                    field.options.forEach(option => {
                        dialogContent += `
                                    <${option}
                                        jcr:primaryType="nt:unstructured"
                                        text="${option.charAt(0).toUpperCase() + option.slice(1)}"
                                        value="${option}"/>`;
                    });
                    dialogContent += `
                                </items>
                            </${fieldNaming.camelCase}>`;
                    break;
                    
                case 'image':
                    dialogContent += `
                                allowUpload="{Boolean}true"
                                autoStart="{Boolean}false"
                                class="cq-droptarget"
                                fileNameParameter="./fileName"
                                fileReferenceParameter="./fileReference"
                                mimeTypes="[image/gif,image/jpeg,image/png,image/webp,image/tiff,image/svg+xml]"
                                multiple="{Boolean}false"/>`;
                    break;
                    
                case 'pathfield':
                    dialogContent += `
                                rootPath="/content"/>`;
                    break;
                    
                case 'colorfield':
                    dialogContent += `
                                variant="swatch"/>`;
                    break;
                    
                case 'textarea':
                    dialogContent += `
                                rows="{Long}4"/>`;
                    break;
                    
                default:
                    dialogContent += `/>`;
            }
        });

        dialogContent += `
                        </items>
                    </properties>
                    
                    <!-- Accessibility Tab -->
                    <accessibility
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Accessibility"
                        sling:resourceType="granite/ui/components/coral/foundation/container"
                        margin="{Boolean}true">
                        
                        <items jcr:primaryType="nt:unstructured">
                            
                            <!-- Accessibility ID -->
                            <accessibilityId
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                fieldLabel="Accessibility ID"
                                fieldDescription="Unique identifier for accessibility purposes"
                                name="./id"/>
                            
                            <!-- ARIA Label -->
                            <ariaLabel
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                fieldLabel="ARIA Label"
                                fieldDescription="Accessibility label for screen readers"
                                name="./ariaLabel"/>
                                
                        </items>
                    </accessibility>
                    
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>`;

        return dialogContent;
    },

    /**
     * Gets the appropriate dialog field type for a given field type
     * @param {string} fieldType - The field type
     * @returns {string} The corresponding Granite UI component type
     */
    getDialogFieldType: function(fieldType) {
        const fieldTypeMap = {
            'text': 'textfield',
            'textarea': 'textarea',
            'richtext': 'rte',
            'select': 'select',
            'checkbox': 'checkbox',
            'image': 'fileupload',
            'pathfield': 'pathfield',
            'colorfield': 'colorfield',
            'number': 'numberfield',
            'email': 'emailfield',
            'url': 'urlfield'
        };
        
        return fieldTypeMap[fieldType] || 'textfield';
    },

    /**
     * CSS/SCSS Generator
     * Creates component-specific styling
     */
    generateCSS: function(componentName, componentType) {
        const naming = createNamingConventions(componentName);
        const config = this.componentTypes[componentType];
        
        let cssContent = `/*
============================
${config.title} - Component Styles
Component: ${naming.kebabCase}
Description: ${config.description}
Author: AEM Component Generator
Generated: ${new Date().toISOString()}
============================
*/

/*
This SCSS file contains component-specific styles for the ${config.title}.
It follows BEM naming convention and AEM Core Components patterns.

Structure:
- Block: .cmp-${naming.kebabCase}
- Elements: .cmp-${naming.kebabCase}__element
- Modifiers: .cmp-${naming.kebabCase}--modifier

The styles are responsive and follow mobile-first approach.
*/

/* ========================
   Component Variables
   ======================== */

// Component-specific variables
$cmp-${naming.kebabCase}-spacing: 1rem;
$cmp-${naming.kebabCase}-border-radius: 0.375rem;
$cmp-${naming.kebabCase}-transition: all 0.2s ease;

/* ========================
   Component Base Styles
   ======================== */

.cmp-${naming.kebabCase} {
    position: relative;
    display: block;
    margin-bottom: $cmp-${naming.kebabCase}-spacing;
    
    // Ensure component is accessible
    &:focus-within {
        outline: 2px solid var(--focus-color, #3B82F6);
        outline-offset: 2px;
    }
}

/* ========================
   Placeholder Styles (Authoring)
   ======================== */

.cmp-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    border: 2px dashed #CBD5E1;
    border-radius: $cmp-${naming.kebabCase}-border-radius;
    background-color: #F8FAFC;
    color: #64748B;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
    padding: $cmp-${naming.kebabCase}-spacing;
    
    &::before {
        content: attr(data-emptytext);
    }
    
    // Hide placeholder in publish mode
    body.wcm-publish & {
        display: none;
    }
}

/* ========================
   Component Content Styles
   ======================== */

.cmp-${naming.kebabCase}__content {
    width: 100%;
}
`;

        // Generate component-specific styles
        switch (componentType) {
            case 'text-component':
                cssContent += `
/* Text Component Specific Styles */

.cmp-${naming.kebabCase}__title-wrapper {
    margin-bottom: calc($cmp-${naming.kebabCase}-spacing / 2);
}

.cmp-${naming.kebabCase}__title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-primary, #1E293B);
    margin: 0;
}

.cmp-${naming.kebabCase}__text {
    line-height: 1.6;
    color: var(--text-secondary, #475569);
    
    // Text alignment modifiers
    &--left {
        text-align: left;
    }
    
    &--center {
        text-align: center;
    }
    
    &--right {
        text-align: right;
    }
    
    // Rich text formatting
    p {
        margin-bottom: 1rem;
        
        &:last-child {
            margin-bottom: 0;
        }
    }
    
    ul, ol {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
    }
    
    li {
        margin-bottom: 0.25rem;
    }
    
    strong {
        font-weight: 600;
    }
    
    em {
        font-style: italic;
    }
    
    a {
        color: var(--link-color, #3B82F6);
        text-decoration: underline;
        transition: $cmp-${naming.kebabCase}-transition;
        
        &:hover {
            color: var(--link-hover-color, #2563EB);
        }
    }
}`;
                break;
                
            case 'image-component':
                cssContent += `
/* Image Component Specific Styles */

.cmp-${naming.kebabCase}__image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: $cmp-${naming.kebabCase}-border-radius;
    background-color: #F1F5F9;
}

.cmp-${naming.kebabCase}__image {
    width: 100%;
    height: auto;
    display: block;
    transition: $cmp-${naming.kebabCase}-transition;
    
    &:hover {
        transform: scale(1.02);
    }
}

.cmp-${naming.kebabCase}__caption {
    margin-top: calc($cmp-${naming.kebabCase}-spacing / 2);
    font-size: 0.875rem;
    color: var(--text-muted, #64748B);
    text-align: center;
    font-style: italic;
}`;
                break;
                
            case 'button-component':
                cssContent += `
/* Button Component Specific Styles */

.cmp-${naming.kebabCase}__wrapper {
    display: inline-block;
}

.cmp-${naming.kebabCase}__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: $cmp-${naming.kebabCase}-border-radius;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: $cmp-${naming.kebabCase}-transition;
    min-width: 120px;
    
    &:focus {
        outline: 2px solid var(--focus-color, #3B82F6);
        outline-offset: 2px;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    // Button style variants
    &.btn--primary {
        background-color: var(--button-primary-bg, #3B82F6);
        color: var(--button-primary-text, #FFFFFF);
        
        &:hover {
            background-color: var(--button-primary-hover, #2563EB);
            transform: translateY(-1px);
        }
    }
    
    &.btn--secondary {
        background-color: var(--button-secondary-bg, #E2E8F0);
        color: var(--button-secondary-text, #475569);
        
        &:hover {
            background-color: var(--button-secondary-hover, #CBD5E1);
            transform: translateY(-1px);
        }
    }
    
    &.btn--outline {
        background-color: transparent;
        color: var(--button-outline-text, #3B82F6);
        border: 2px solid var(--button-outline-border, #3B82F6);
        
        &:hover {
            background-color: var(--button-outline-hover-bg, #3B82F6);
            color: var(--button-outline-hover-text, #FFFFFF);
        }
    }
    
    // Button size variants
    &.btn--small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-width: 80px;
    }
    
    &.btn--medium {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        min-width: 120px;
    }
    
    &.btn--large {
        padding: 1rem 2rem;
        font-size: 1.125rem;
        min-width: 160px;
    }
}`;
                break;
                
            case 'container-component':
                cssContent += `
/* Container Component Specific Styles */

.cmp-${naming.kebabCase}__inner {
    width: 100%;
    
    // Container type variants
    &.container--default {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    &.container--fluid {
        width: 100%;
        padding: 0 1rem;
    }
    
    &.container--fixed {
        width: 100%;
        max-width: 960px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    // Padding variants
    &[class*="padding--none"] {
        padding-top: 0;
        padding-bottom: 0;
    }
    
    &[class*="padding--small"] {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    
    &[class*="padding--medium"] {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    
    &[class*="padding--large"] {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
}`;
                break;
                
            case 'hero-component':
                cssContent += `
/* Hero Component Specific Styles */

.cmp-${naming.kebabCase}__background {
    position: relative;
    min-height: 60vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cmp-${naming.kebabCase}__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.cmp-${naming.kebabCase}__content-wrapper {
    text-align: center;
    color: white;
    max-width: 800px;
}

.cmp-${naming.kebabCase}__title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.cmp-${naming.kebabCase}__subtitle {
    font-size: clamp(1rem, 3vw, 1.25rem);
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cmp-${naming.kebabCase}__cta {
    margin-top: 2rem;
}

.cmp-${naming.kebabCase}__cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background-color: var(--cta-bg, #3B82F6);
    color: white;
    text-decoration: none;
    border-radius: $cmp-${naming.kebabCase}-border-radius;
    font-weight: 600;
    font-size: 1.125rem;
    transition: $cmp-${naming.kebabCase}-transition;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    &:hover {
        background-color: var(--cta-hover, #2563EB);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
}`;
                break;
                
            case 'card-component':
                cssContent += `
/* Card Component Specific Styles */

.cmp-${naming.kebabCase} {
    background-color: white;
    border-radius: $cmp-${naming.kebabCase}-border-radius;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: $cmp-${naming.kebabCase}-transition;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
}

.cmp-${naming.kebabCase}__image-wrapper {
    overflow: hidden;
    flex-shrink: 0;
}

.cmp-${naming.kebabCase}__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: $cmp-${naming.kebabCase}-transition;
    
    .cmp-${naming.kebabCase}:hover & {
        transform: scale(1.05);
    }
}

.cmp-${naming.kebabCase}__body {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.cmp-${naming.kebabCase}__title {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-primary, #1E293B);
    margin-bottom: 0.75rem;
}

.cmp-${naming.kebabCase}__description {
    color: var(--text-secondary, #64748B);
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
}

.cmp-${naming.kebabCase}__link-wrapper {
    margin-top: auto;
}

.cmp-${naming.kebabCase}__link {
    color: var(--link-color, #3B82F6);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    
    &:hover {
        color: var(--link-hover-color, #2563EB);
        text-decoration: underline;
    }
    
    &::after {
        content: '→';
        transition: $cmp-${naming.kebabCase}-transition;
    }
    
    &:hover::after {
        transform: translateX(2px);
    }
}`;
                break;
        }

        // Add responsive styles
        cssContent += `

/* ========================
   Responsive Styles
   ======================== */

// Tablet styles
@media (max-width: 768px) {
    .cmp-${naming.kebabCase} {
        margin-bottom: calc($cmp-${naming.kebabCase}-spacing * 0.75);
    }
}

// Mobile styles
@media (max-width: 480px) {
    .cmp-${naming.kebabCase} {
        margin-bottom: calc($cmp-${naming.kebabCase}-spacing * 0.5);
    }
}

/* ========================
   Print Styles
   ======================== */

@media print {
    .cmp-${naming.kebabCase} {
        break-inside: avoid;
        margin-bottom: 1rem;
    }
    
    .cmp-placeholder {
        display: none;
    }
}

/* ========================
   High Contrast Mode
   ======================== */

@media (prefers-contrast: high) {
    .cmp-${naming.kebabCase} {
        border: 1px solid;
    }
}

/* ========================
   Reduced Motion
   ======================== */

@media (prefers-reduced-motion: reduce) {
    .cmp-${naming.kebabCase} *,
    .cmp-${naming.kebabCase} *::before,
    .cmp-${naming.kebabCase} *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}`;

        return cssContent;
    },

    /**
     * README Generator
     * Creates documentation for the generated component
     */
    generateReadme: function(componentName, componentType, fields) {
        const naming = createNamingConventions(componentName);
        const config = this.componentTypes[componentType];
        
        let readmeContent = `# ${config.title}

**Component Name:** ${naming.kebabCase}  
**Category:** ${config.category}  
**Generated:** ${new Date().toLocaleDateString()}

## Description

${config.description}

## Files Generated

This component includes the following files:

- \`${naming.kebabCase}.html\` - HTL template for rendering
- \`${naming.pascalCase}Model.java\` - Sling Model for business logic
- \`_cq_dialog/.content.xml\` - Touch UI dialog configuration
- \`${naming.kebabCase}.scss\` - Component-specific styles
- \`README.md\` - This documentation file

## Properties

The component supports the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|`;

        fields.forEach(field => {
            readmeContent += `
| ${field.name} | ${field.type} | ${field.required ? 'Yes' : 'No'} | ${field.label} |`;
        });

        readmeContent += `

## Usage

### Basic Usage

1. Add the component to your page template or parsys
2. Configure the properties through the dialog
3. The component will render based on the configured values

### Code Example

\`\`\`html
<div data-sly-resource="\${resource @ resourceType='your-project/components/${naming.kebabCase}'}"></div>
\`\`\`

## Customization

### Styling

The component uses CSS custom properties for easy theming:

\`\`\`css
:root {
    --text-primary: #1E293B;
    --text-secondary: #475569;
    --link-color: #3B82F6;
    --focus-color: #3B82F6;
}
\`\`\`

### Extending the Sling Model

To add custom business logic, extend the generated Sling Model:

\`\`\`java
@Model(
    adaptables = {SlingHttpServletRequest.class, Resource.class},
    adapters = {Extended${naming.pascalCase}Model.class},
    resourceType = "your-project/components/${naming.kebabCase}",
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class Extended${naming.pascalCase}Model extends ${naming.pascalCase}Model {
    // Add your custom methods here
}
\`\`\`

## Accessibility

This component follows WCAG 2.1 guidelines and includes:

- Proper semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly markup

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for images
- Optimized CSS delivery
- Minimal JavaScript footprint
- Responsive image handling

## Testing

### Unit Tests

Create unit tests for the Sling Model:

\`\`\`java
@ExtendWith(AemContextExtension.class)
class ${naming.pascalCase}ModelTest {
    
    @Test
    void testModelInitialization() {
        // Test your model logic here
    }
}
\`\`\`

### Integration Tests

Test the component's HTML output and dialog functionality in your integration test suite.

## Support

For issues or questions regarding this component:

1. Check the AEM documentation
2. Review the generated code comments
3. Consult your development team
4. Create a support ticket if needed

---

*Generated by AEM Component Generator*`;

        return readmeContent;
    }
};

// Export for use in other modules
window.AEMTemplates = AEMTemplates; 