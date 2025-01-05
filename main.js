import $ from 'jquery';
import { calculateSellerNet } from './assets/scripts/calculator.js';
import { FormHandler } from './assets/scripts/form-handler.js';
import { PDFTemplateGenerator } from './assets/scripts/pdf-templates.js';
import './assets/styles.css';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    try {
        const pdfGenerator = new PDFTemplateGenerator();
        const formHandler = new FormHandler(pdfGenerator);
        
        formHandler.init();
        
        document.getElementById('calculate').addEventListener('click', calculateSellerNet);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});