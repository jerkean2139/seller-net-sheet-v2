import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export class PDFTemplateGenerator {
    constructor() {
        this.loadTemplates();
    }

    loadTemplates() {
        const template1 = document.getElementById('pdf-template-1');
        const template2 = document.getElementById('pdf-template-2');

        if (!template1 || !template2) {
            throw new Error('PDF templates not found');
        }

        this.templates = {
            template1: template1.innerHTML,
            template2: template2.innerHTML
        };
    }

    async generatePDF(templateNumber, data) {
        try {
            const template = templateNumber === 1 ? 'template1' : 'template2';
            const container = this.createPreviewContainer(template, data);
            
            document.body.appendChild(container);
            
            try {
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

    createPreviewContainer(template, data) {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        
        const content = this.populateTemplate(this.templates[template], data);
        container.innerHTML = content;
        
        return container;
    }

    populateTemplate(template, data) {
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
}