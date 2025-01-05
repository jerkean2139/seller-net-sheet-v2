export class FormHandler {
    constructor(pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        $('#popup-form').on('submit', this.handleSubmit.bind(this));
        $('#close-popup').on('click', this.hidePopup.bind(this));
        $('#save-btn').on('click', this.showPopup.bind(this));
    }
    
    showPopup() {
        $('#popup-modal').removeClass('hidden');
    }
    
    hidePopup() {
        $('#popup-modal').addClass('hidden');
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            const formData = this.getFormData();
            const calculatorData = this.getCalculatorData();
            
            const templateNumber = formData.is_agent === 'yes' ? 2 : 1;
            await this.pdfGenerator.generatePDF(templateNumber, {
                ...formData,
                ...calculatorData,
                date: new Date().toLocaleDateString(),
                currentYear: new Date().getFullYear(),
                companyLogo: '/assets/images/empire-logo.png'
            });
            
            this.hidePopup();
        } catch (error) {
            console.error('Form submission error:', error);
            alert(error.message);
        }
    }
    
    getFormData() {
        return {
            first_name: $('#first-name').val(),
            email: $('#email').val(),
            is_agent: $('input[name="is_agent"]:checked').val(),
            agent_phone: $('#agent-phone').val() || '',
            agentImage: $('#agent-image')[0]?.files[0] ? 
                URL.createObjectURL($('#agent-image')[0].files[0]) : '',
            agentLogo: $('#agent-logo')[0]?.files[0] ? 
                URL.createObjectURL($('#agent-logo')[0].files[0]) : ''
        };
    }
    
    getCalculatorData() {
        return {
            salePrice: $('#purchase-price-output').text(),
            mortgagePayoff: $('#mortgage-payoff-output').text(),
            realtorCommission: $('#realtor-commission-output').text(),
            realEstateTaxes: $('#real-estate-taxes-output').text(),
            titleCompanyFees: $('#title-company-output').text(),
            additionalCosts: $('#additional-costs-output').text(),
            totalExpenses: $('#total-expenses-output').text(),
            netProceeds: $('#net-proceeds-output').text()
        };
    }
}