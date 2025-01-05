import $ from 'jquery';
import { getCalculatorData } from './calculator-data.js';
import { validatePDFData } from './pdf-validation.js';

export async function handleFormSubmission(e, pdfService) {
    e.preventDefault();
    
    try {
        const formData = {
            first_name: $('#first-name').val().trim(),
            email: $('#email').val().trim(),
            is_agent: $('input[name="is_agent"]:checked').val(),
            add_logo: $('input[name="add_logo"]:checked').val(),
            agent_phone: $('#agent-phone').val().trim(),
            agent_logo: $('#agent-logo')[0]?.files[0],
            agent_image: $('#agent-image')[0]?.files[0]
        };
        
        const calculatorData = getCalculatorData();
        
        // Validate data before generating PDF
        validatePDFData(formData, calculatorData);
        
        // Generate PDF
        await pdfService.generatePDF(formData, calculatorData);
        $('#popup-modal').addClass('hidden');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(error.message || 'Failed to generate PDF. Please try again.');
    }
}