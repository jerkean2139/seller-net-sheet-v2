import { isValidName, isValidEmail, isValidPhone, isValidImageFile } from './validation.js';

export function validatePDFData(formData, calculatorData) {
    // Validate form data
    if (!formData.first_name || !isValidName(formData.first_name)) {
        throw new Error('Please enter a valid name');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
    }

    // Validate agent data if applicable
    if (formData.is_agent === 'yes' && formData.add_logo === 'yes') {
        if (formData.agent_phone && !isValidPhone(formData.agent_phone)) {
            throw new Error('Please enter a valid phone number');
        }
        
        if (formData.agent_logo && !isValidImageFile(formData.agent_logo)) {
            throw new Error('Please upload a valid image file for your logo (JPG, PNG, or GIF)');
        }
        
        if (formData.agent_image && !isValidImageFile(formData.agent_image)) {
            throw new Error('Please upload a valid image file for your photo (JPG, PNG, or GIF)');
        }
    }

    // Validate calculator data
    const requiredFields = ['salePrice', 'mortgagePayoff', 'realtorCommission', 
                          'realEstateTaxes', 'titleCompanyFees', 'totalExpenses', 
                          'netProceeds'];
    
    for (const field of requiredFields) {
        if (!calculatorData[field]) {
            throw new Error('Please complete all calculator fields before generating PDF');
        }
    }

    return true;
}