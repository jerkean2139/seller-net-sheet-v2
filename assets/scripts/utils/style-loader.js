export async function loadStyles(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load styles from ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading styles:', error);
        return '';
    }
}