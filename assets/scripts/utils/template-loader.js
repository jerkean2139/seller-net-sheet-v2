import { loadStyles } from './style-loader.js';

export async function loadTemplate(templateId) {
    const template = document.getElementById(templateId);
    if (!template) {
        throw new Error(`Template ${templateId} not found`);
    }
    return template.innerHTML;
}

export async function createTemplateContainer(template, styles) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    
    // Add styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    container.appendChild(styleSheet);
    
    // Add template
    container.innerHTML += template;
    
    return container;
}