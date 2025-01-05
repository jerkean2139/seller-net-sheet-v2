import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const PDFService = {
    async generatePDF(formData, calculatorData) {
        try {
            const doc = new jsPDF();
            
            // Create temporary container for PDF content
            const container = document.createElement('div');
            container.innerHTML = formData.is_agent === 'yes' ? 
                document.getElementById('pdf-template-2').innerHTML :
                document.getElementById('pdf-template-1').innerHTML;
            
            // Apply template data
            this.populateTemplate(container, {
                date: new Date().toLocaleDateString(),
                currentYear: new Date().getFullYear(),
                clientName: formData.first_name,
                agentName: formData.first_name,
                agentPhone: formData.agent_phone,
                agentEmail: formData.email,
                ...calculatorData
            });

            // Convert to canvas and then PDF
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            doc.save('seller-net-sheet.pdf');

            return true;
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new Error('Could not generate PDF. Please try again.');
        }
    },

    populateTemplate(container, data) {
        const template = container.innerHTML;
        const populated = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });
        container.innerHTML = populated;
    }
};