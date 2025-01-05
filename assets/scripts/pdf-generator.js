import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { loadTemplate, createTemplateContainer } from './utils/template-loader.js';
import { loadStyles } from './utils/style-loader.js';
import { processTemplate } from './utils/template-processor.js';

export class PDFGenerator {
    async generate(formData, calculatorData) {
        try {
            const templateId = formData.is_agent === 'yes' ? 'pdf-template-2' : 'pdf-template-1';
            const template = await loadTemplate(templateId);
            const styles = await loadStyles(`/assets/templates/template${formData.is_agent === 'yes' ? '2' : '1'}.css`);
            
            // Process template with data
            const processedTemplate = processTemplate(template, {
                date: new Date().toLocaleDateString(),
                currentYear: new Date().getFullYear(),
                clientName: formData.first_name,
                agentName: formData.first_name,
                agentPhone: formData.agent_phone,
                agentEmail: formData.email,
                isAgent: formData.is_agent === 'yes',
                ...calculatorData
            });
            
            // Create container with processed template
            const container = await createTemplateContainer(processedTemplate, styles);
            document.body.appendChild(container);
            
            try {
                // Generate PDF
                const doc = new jsPDF();
                const canvas = await html2canvas(container.firstElementChild, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pageWidth = doc.internal.pageSize.getWidth();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                doc.save('seller-net-sheet.pdf');
                
                return true;
            } finally {
                document.body.removeChild(container);
            }
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new Error('Could not generate PDF. Please try again.');
        }
    }
}