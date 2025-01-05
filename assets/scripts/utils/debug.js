// Utility for debugging
const Debug = {
    log(message, data) {
        console.log(`[SNSC Debug] ${message}`, data || '');
    },
    
    error(message, error) {
        console.error(`[SNSC Error] ${message}`, error);
    }
};