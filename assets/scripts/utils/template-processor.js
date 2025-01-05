export function processTemplate(template, data) {
    // Handle conditional sections
    let processed = template.replace(
        /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (match, condition, content) => data[condition] ? content : ''
    );
    
    // Replace variables
    return processed.replace(
        /\{\{(\w+)\}\}/g,
        (match, key) => data[key] || ''
    );
}