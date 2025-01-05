import $ from 'jquery';
import { isValidEmail } from './validation.js';

export function setupFormValidation() {
    const form = $('#popup-form');
    
    form.on('submit', (e) => {
        const firstName = $('#first-name').val().trim();
        const email = $('#email').val().trim();
        
        if (!firstName) {
            e.preventDefault();
            alert('First name is required');
            return false;
        }
        
        if (!email || !isValidEmail(email)) {
            e.preventDefault();
            alert('Valid email is required');
            return false;
        }
        
        return true;
    });
}