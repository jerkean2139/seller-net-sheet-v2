// Format currency function
function formatCurrency(number) {
    if (typeof number !== 'number') {
        number = 0;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

// Format currency for display
function formatCurrencyDisplay(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Format input as currency
function formatInputAsCurrency(input) {
    // Get only numbers from input
    let value = input.value.replace(/[^\d]/g, '');
    
    // Convert to number
    let number = parseInt(value);
    
    // If it's a valid number, format it
    if (!isNaN(number)) {
        // Format without cents
        input.value = formatCurrencyDisplay(number);
    } else if (value === '') {
        input.value = '';
    }
}

// Calculate title insurance
function calculateTitleInsurance(salePrice) {
    // Base rate calculation
    if (salePrice <= 50000) {
        return salePrice * 0.004;
    } else if (salePrice <= 100000) {
        return 200 + (salePrice - 50000) * 0.0035;
    } else if (salePrice <= 500000) {
        return 375 + (salePrice - 100000) * 0.003;
    } else if (salePrice <= 1000000) {
        return 1575 + (salePrice - 500000) * 0.002;
    } else if (salePrice <= 2000000) {
        return 2575 + (salePrice - 1000000) * 0.00175;
    } else {
        return 4325 + (salePrice - 2000000) * 0.0015;
    }
}

// Calculate seller net proceeds
function calculateSellerNet() {
    // Get input values
    const salePrice = parseFloat(document.getElementById('sale-price').value.replace(/[^0-9.-]+/g,"")) || 0;
    const existingMortgage = parseFloat(document.getElementById('existing-mortgage').value.replace(/[^0-9.-]+/g,"")) || 0;
    const commission = parseFloat(document.getElementById('commission').value.replace(/[^0-9.-]+/g,"")) || 0;
    const propertyTaxes = parseFloat(document.getElementById('property-taxes').value.replace(/[^0-9.-]+/g,"")) || 0;
    const otherFees = parseFloat(document.getElementById('other-fees').value.replace(/[^0-9.-]+/g,"")) || 0;

    // Fixed fees
    const settlementFee = 350;
    const searchFee = 175;
    const recordingFee = 100;

    // Calculate title insurance based on sale price
    const titleInsurance = calculateTitleInsurance(salePrice);

    // Calculate total expenses
    const totalExpenses = existingMortgage + commission + titleInsurance + 
                         settlementFee + searchFee + recordingFee + 
                         propertyTaxes + otherFees;

    // Calculate net proceeds
    const netProceeds = salePrice - totalExpenses;

    // Store calculated values globally for PDF generation
    window.calculatedValues = {
        salePrice,
        existingMortgage,
        commission,
        titleInsurance,
        settlementFee,
        searchFee,
        recordingFee,
        propertyTaxes,
        otherFees,
        totalExpenses,
        netProceeds
    };

    // Create closing disclosure style results
    const resultsPanel = document.querySelector('.results-panel');
    resultsPanel.innerHTML = `
        <div class="closing-disclosure">
            <div class="cd-section">
                <h3>Closing Disclosure</h3>
                <div class="cd-date">Date: ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="cd-section">
                <h4>A. Transaction Information</h4>
                <div class="cd-table">
                    <div class="cd-row">
                        <span>Sale Price of Property</span>
                        <span>${formatCurrency(salePrice)}</span>
                    </div>
                    <div class="cd-row cd-total">
                        <span>Total Credits</span>
                        <span>${formatCurrency(salePrice)}</span>
                    </div>
                </div>
            </div>

            <div class="cd-section">
                <h4>B. Loan Payoff</h4>
                <div class="cd-table">
                    <div class="cd-row">
                        <span>First Mortgage Payoff</span>
                        <span>${formatCurrency(existingMortgage)}</span>
                    </div>
                </div>
            </div>

            <div class="cd-section">
                <h4>C. Settlement Charges</h4>
                <div class="cd-table">
                    <div class="cd-row">
                        <span>Real Estate Commission</span>
                        <span>${formatCurrency(commission)}</span>
                    </div>
                    <div class="cd-row">
                        <span>Title Insurance Premium</span>
                        <span>${formatCurrency(titleInsurance)}</span>
                    </div>
                    <div class="cd-row">
                        <span>Settlement Fee</span>
                        <span>${formatCurrency(settlementFee)}</span>
                    </div>
                    <div class="cd-row">
                        <span>Title Search Fee</span>
                        <span>${formatCurrency(searchFee)}</span>
                    </div>
                    <div class="cd-row">
                        <span>Recording Fee</span>
                        <span>${formatCurrency(recordingFee)}</span>
                    </div>
                </div>
            </div>

            <div class="cd-section">
                <h4>D. Additional Charges</h4>
                <div class="cd-table">
                    <div class="cd-row">
                        <span>Property Taxes</span>
                        <span>${formatCurrency(propertyTaxes)}</span>
                    </div>
                    <div class="cd-row">
                        <span>Other Fees</span>
                        <span>${formatCurrency(otherFees)}</span>
                    </div>
                    <div class="cd-row cd-total">
                        <span>Total Settlement Charges</span>
                        <span>${formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
            </div>

            <div class="cd-section">
                <h4>E. Net Proceeds</h4>
                <div class="cd-table">
                    <div class="cd-row cd-grand-total">
                        <span>Estimated Net Proceeds</span>
                        <span>${formatCurrency(netProceeds)}</span>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button type="button" class="action-btn" id="show-popup-btn">Print/Save PDF</button>
            </div>
        </div>
    `;

    // Show results with animation
    resultsPanel.style.display = 'block';
    setTimeout(() => {
        resultsPanel.classList.add('visible');
        document.querySelector('.calculator-input').classList.add('shifted');
    }, 50);

    // Add event listener to new PDF button
    document.getElementById('show-popup-btn').addEventListener('click', showPopupModal);
}

// Generate PDF
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Load logo image
        const logoImg = new Image();
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = (e) => {
                console.error('Error loading logo:', e);
                reject(e);
            };
            logoImg.src = './assets/empire-logo.png';
        });

        // Add logo to PDF with 125% larger size
        const logoWidth = 90; // Significantly larger
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', 20, 10, logoWidth, logoHeight);

        // Add title text (no text logo)
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Seller Net Sheet", 105, 45, { align: 'center' });
        
        // Add horizontal line
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Add date and file number
        const footerY = doc.internal.pageSize.height - 40;
        doc.setFontSize(10);
        const today = new Date().toLocaleDateString();
        doc.text(`Date: ${today}`, 20, 60);
        doc.text(`File No: EST-${Math.random().toString().slice(2, 8)}`, 150, 60);

        // Start of closing disclosure table
        let y = 70;
        const leftX = 20;
        const rightX = 180;
        const sectionGap = 8;
        const lineGap = 7;

        // Helper function for sections
        function addSection(title, items) {
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(leftX, y-5, rightX-leftX, 8, 'F');
            doc.text(title, leftX, y);
            y += sectionGap;
            
            doc.setFont(undefined, 'normal');
            items.forEach(([label, value]) => {
                doc.text(label, leftX, y);
                doc.text(value, rightX, y, { align: 'right' });
                y += lineGap;
            });
            y += 2;
        }

        // Add all sections using the calculated values
        const values = window.calculatedValues || {
            salePrice: 0,
            existingMortgage: 0,
            commission: 0,
            titleInsurance: 0,
            settlementFee: 0,
            searchFee: 0,
            propertyTaxes: 0,
            recordingFee: 0,
            otherFees: 0,
            totalExpenses: 0,
            netProceeds: 0
        };

        addSection('Credits to Seller', [
            ['Sale Price of Property', formatCurrencyDisplay(values.salePrice)],
            ['Total Credits', formatCurrencyDisplay(values.salePrice)]
        ]);

        addSection('Loan Payoff', [
            ['First Mortgage Payoff', formatCurrencyDisplay(values.existingMortgage)]
        ]);

        addSection('Commission Charges', [
            ['Real Estate Commission', formatCurrencyDisplay(values.commission)]
        ]);

        addSection('Title Charges', [
            ['Title Insurance Premium', formatCurrencyDisplay(values.titleInsurance)],
            ['Settlement/Closing Fee', formatCurrencyDisplay(values.settlementFee)],
            ['Title Search Fee', formatCurrencyDisplay(values.searchFee)],
            ['Recording Fees', formatCurrencyDisplay(values.recordingFee)]
        ]);

        addSection('Government Recording and Transfer Charges', [
            ['Property Taxes (Prorated)', formatCurrencyDisplay(values.propertyTaxes)]
        ]);

        addSection('Additional Settlement Charges', [
            ['Other Closing Costs', formatCurrencyDisplay(values.otherFees)]
        ]);

        // Summary Section
        y += 5;
        doc.setLineWidth(0.5);
        doc.line(leftX, y-3, rightX, y-3);
        doc.setFont(undefined, 'bold');
        doc.text('Total Settlement Charges', leftX, y);
        doc.text(formatCurrencyDisplay(values.totalExpenses), rightX, y, { align: 'right' });
        
        y += 10;
        doc.setFillColor(232, 245, 233);
        doc.rect(leftX, y-5, rightX-leftX, 8, 'F');
        doc.text('Estimated Net Proceeds', leftX, y);
        doc.text(formatCurrencyDisplay(values.netProceeds), rightX, y, { align: 'right' });

        // Load Missy's photo
        const missyImg = new Image();
        await new Promise((resolve, reject) => {
            missyImg.onload = resolve;
            missyImg.onerror = (e) => {
                console.error('Error loading photo:', e);
                reject(e);
            };
            missyImg.src = './assets/missy-photo.jpg';
        });

        // Add horizontal line above footer - moved down 40px
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, footerY + 15, 190, footerY + 15);

        // Add Missy's photo in footer - moved down 40px
        const photoWidth = 25;
        const photoHeight = (missyImg.height / missyImg.width) * photoWidth;
        const photoY = footerY + 40; // Increased by 10px
        doc.addImage(missyImg, 'JPEG', 155, photoY - photoHeight - 15, photoWidth, photoHeight);

        // Add styled contact info box below photo - aligned with right edge of photo
        const contactY = photoY - 10;
        const boxWidth = 45;
        const photoRightEdge = 155 + photoWidth; // Right edge of photo
        const boxX = photoRightEdge - boxWidth; // Align box with right edge of photo
        
        // Add Empire red background for contact info
        doc.setFillColor(175, 35, 43);
        doc.rect(boxX, contactY - 4, boxWidth, 32, 'F');
        
        // Contact information in white, right-aligned
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Missy Horner', photoRightEdge - 2, contactY, { align: 'right' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text('Empire Title Services', photoRightEdge - 2, contactY + 6, { align: 'right' });
        doc.text('(765) 935-9966', photoRightEdge - 2, contactY + 12, { align: 'right' });
        doc.text('missy@empiretitleservice.com', photoRightEdge - 2, contactY + 18, { align: 'right' });
        doc.text('www.empiretitleservice.com', photoRightEdge - 2, contactY + 24, { align: 'right' });

        // Add disclaimer text in gray
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is an estimate of net proceeds and actual figures may vary.', 20, footerY + 55);
        doc.text('Not a final closing disclosure. For estimation purposes only.', 20, footerY + 60);

        // Create blob URL and open in new tab for printing
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Show popup modal for PDF generation
function showPopupModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Generate PDF</h3>
            <form id="pdf-form">
                <div class="form-group">
                    <label>
                        <input type="radio" name="is_agent" value="no" checked> 
                        Generate for Missy
                    </label>
                    <label>
                        <input type="radio" name="is_agent" value="yes"> 
                        Generate for Another Agent
                    </label>
                </div>
                
                <div id="agent-fields" class="hidden">
                    <div class="form-group">
                        <label for="agent-name">Agent Name</label>
                        <input type="text" id="agent-name" placeholder="Enter agent name">
                    </div>
                    <div class="form-group">
                        <label for="agent-company">Company</label>
                        <input type="text" id="agent-company" placeholder="Enter company name">
                    </div>
                    <div class="form-group">
                        <label for="agent-phone">Phone</label>
                        <input type="text" id="agent-phone" placeholder="Enter phone number">
                    </div>
                    <div class="form-group">
                        <label for="agent-email">Email</label>
                        <input type="email" id="agent-email" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="agent-website">Website</label>
                        <input type="text" id="agent-website" placeholder="Enter website">
                    </div>
                    <div class="form-group">
                        <label for="agent-image">Agent Image</label>
                        <input type="file" id="agent-image" accept="image/*">
                    </div>
                </div>

                <div class="form-group">
                    <button type="submit" class="action-btn">Generate PDF</button>
                    <button type="button" class="action-btn cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => modal.classList.add('visible'), 50);

    // Handle form display logic
    const agentFields = modal.querySelector('#agent-fields');
    const radioButtons = modal.querySelectorAll('input[name="is_agent"]');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            agentFields.classList.toggle('hidden', this.value === 'no');
        });
    });

    // Handle form submission
    const form = modal.querySelector('#pdf-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const isAgent = form.querySelector('input[name="is_agent"]:checked').value === 'yes';
        let agentInfo = null;

        if (isAgent) {
            const imageInput = document.getElementById('agent-image');
            let imageBase64 = null;

            if (imageInput.files.length > 0) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageInput.files[0]);
                });
            }

            agentInfo = {
                name: document.getElementById('agent-name').value,
                company: document.getElementById('agent-company').value,
                phone: document.getElementById('agent-phone').value,
                email: document.getElementById('agent-email').value,
                website: document.getElementById('agent-website').value,
                image: imageBase64
            };
        }

        generatePDF(agentInfo);
        closeModal(modal);
    });

    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => closeModal(modal));

    // Handle clicking outside modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

// Close modal with animation
function closeModal(modal) {
    modal.classList.remove('visible');
    setTimeout(() => modal.remove(), 300);
}

// Generate PDF
async function generatePDF(agentInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Load logo image
        const logoImg = new Image();
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = (e) => {
                console.error('Error loading logo:', e);
                reject(e);
            };
            logoImg.src = './assets/empire-logo.png';
        });

        // Add logo to PDF with 125% larger size
        const logoWidth = 90; // Significantly larger
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', 20, 10, logoWidth, logoHeight);

        // Add title text (no text logo)
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Seller Net Sheet", 105, 45, { align: 'center' });
        
        // Add horizontal line
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Add date and file number
        const footerY = doc.internal.pageSize.height - 40;
        doc.setFontSize(10);
        const today = new Date().toLocaleDateString();
        doc.text(`Date: ${today}`, 20, 60);
        doc.text(`File No: EST-${Math.random().toString().slice(2, 8)}`, 150, 60);

        // Start of closing disclosure table
        let y = 70;
        const leftX = 20;
        const rightX = 180;
        const sectionGap = 8;
        const lineGap = 7;

        // Helper function for sections
        function addSection(title, items) {
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(leftX, y-5, rightX-leftX, 8, 'F');
            doc.text(title, leftX, y);
            y += sectionGap;
            
            doc.setFont(undefined, 'normal');
            items.forEach(([label, value]) => {
                doc.text(label, leftX, y);
                doc.text(value, rightX, y, { align: 'right' });
                y += lineGap;
            });
            y += 2;
        }

        // Add all sections using the calculated values
        const values = window.calculatedValues || {
            salePrice: 0,
            existingMortgage: 0,
            commission: 0,
            titleInsurance: 0,
            settlementFee: 0,
            searchFee: 0,
            propertyTaxes: 0,
            recordingFee: 0,
            otherFees: 0,
            totalExpenses: 0,
            netProceeds: 0
        };

        addSection('Credits to Seller', [
            ['Sale Price of Property', formatCurrencyDisplay(values.salePrice)],
            ['Total Credits', formatCurrencyDisplay(values.salePrice)]
        ]);

        addSection('Loan Payoff', [
            ['First Mortgage Payoff', formatCurrencyDisplay(values.existingMortgage)]
        ]);

        addSection('Commission Charges', [
            ['Real Estate Commission', formatCurrencyDisplay(values.commission)]
        ]);

        addSection('Title Charges', [
            ['Title Insurance Premium', formatCurrencyDisplay(values.titleInsurance)],
            ['Settlement/Closing Fee', formatCurrencyDisplay(values.settlementFee)],
            ['Title Search Fee', formatCurrencyDisplay(values.searchFee)],
            ['Recording Fees', formatCurrencyDisplay(values.recordingFee)]
        ]);

        addSection('Government Recording and Transfer Charges', [
            ['Property Taxes (Prorated)', formatCurrencyDisplay(values.propertyTaxes)]
        ]);

        addSection('Additional Settlement Charges', [
            ['Other Closing Costs', formatCurrencyDisplay(values.otherFees)]
        ]);

        // Summary Section
        y += 5;
        doc.setLineWidth(0.5);
        doc.line(leftX, y-3, rightX, y-3);
        doc.setFont(undefined, 'bold');
        doc.text('Total Settlement Charges', leftX, y);
        doc.text(formatCurrencyDisplay(values.totalExpenses), rightX, y, { align: 'right' });
        
        y += 10;
        doc.setFillColor(232, 245, 233);
        doc.rect(leftX, y-5, rightX-leftX, 8, 'F');
        doc.text('Estimated Net Proceeds', leftX, y);
        doc.text(formatCurrencyDisplay(values.netProceeds), rightX, y, { align: 'right' });

        // Load Missy's photo
        const missyImg = new Image();
        await new Promise((resolve, reject) => {
            missyImg.onload = resolve;
            missyImg.onerror = (e) => {
                console.error('Error loading photo:', e);
                reject(e);
            };
            missyImg.src = './assets/missy-photo.jpg';
        });

        // Add horizontal line above footer - moved down 40px
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, footerY + 15, 190, footerY + 15);

        // Add Missy's photo in footer - moved down 40px
        const photoWidth = 25;
        const photoHeight = (missyImg.height / missyImg.width) * photoWidth;
        const photoY = footerY + 40; // Increased by 10px
        doc.addImage(missyImg, 'JPEG', 155, photoY - photoHeight - 15, photoWidth, photoHeight);

        // Add styled contact info box below photo - aligned with right edge of photo
        const contactY = photoY - 10;
        const boxWidth = 45;
        const photoRightEdge = 155 + photoWidth; // Right edge of photo
        const boxX = photoRightEdge - boxWidth; // Align box with right edge of photo
        
        // Add Empire red background for contact info
        doc.setFillColor(175, 35, 43);
        doc.rect(boxX, contactY - 4, boxWidth, 32, 'F');
        
        // Contact information in white, right-aligned
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Missy Horner', photoRightEdge - 2, contactY, { align: 'right' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text('Empire Title Services', photoRightEdge - 2, contactY + 6, { align: 'right' });
        doc.text('(765) 935-9966', photoRightEdge - 2, contactY + 12, { align: 'right' });
        doc.text('missy@empiretitleservice.com', photoRightEdge - 2, contactY + 18, { align: 'right' });
        doc.text('www.empiretitleservice.com', photoRightEdge - 2, contactY + 24, { align: 'right' });

        // Add disclaimer text in gray
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is an estimate of net proceeds and actual figures may vary.', 20, footerY + 55);
        doc.text('Not a final closing disclosure. For estimation purposes only.', 20, footerY + 60);

        // Create blob URL and open in new tab for printing
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Show popup modal with animation
function showPopupModal() {
    const modal = document.getElementById('popup-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 50);
}

// Close popup modal with animation
function closePopupModal() {
    const modal = document.getElementById('popup-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Show info modal
function showInfoModal() {
    document.getElementById('info-modal').style.display = 'block';
}

// Close info modal
function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

// Handle form submission and PDF generation
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        logo: document.getElementById('agent-logo').files[0],
        photo: document.getElementById('agent-photo').files[0],
        name: document.getElementById('agent-name').value,
        company: document.getElementById('agent-company').value,
        phone: document.getElementById('agent-phone').value,
        email: document.getElementById('agent-email').value,
        website: document.getElementById('agent-website').value
    };

    // Store in localStorage for future use
    localStorage.setItem('agentInfo', JSON.stringify({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        website: formData.website
    }));

    // Convert images to base64
    try {
        formData.logoBase64 = await fileToBase64(formData.logo);
        formData.photoBase64 = await fileToBase64(formData.photo);
        generatePDFWithAgent(formData);
        closeInfoModal();
    } catch (error) {
        console.error('Error processing images:', error);
        alert('Error processing images. Please try again.');
    }
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Generate PDF with agent info
async function generatePDFWithAgent(agentInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Load logo image
        const logoImg = new Image();
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = (e) => {
                console.error('Error loading logo:', e);
                reject(e);
            };
            logoImg.src = './assets/empire-logo.png';
        });

        // Add logo to PDF with 125% larger size
        const logoWidth = 90; // Significantly larger
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', 20, 10, logoWidth, logoHeight);

        // Add agent's logo on the right
        const agentLogoWidth = 40;
        const agentLogoHeight = (agentInfo.logoBase64.height / agentInfo.logoBase64.width) * agentLogoWidth;
        doc.addImage(agentInfo.logoBase64, 'PNG', 140, 10, agentLogoWidth, agentLogoHeight);

        // Rest of the PDF content...
        // [Previous PDF content generation code remains the same until the footer]

        const footerY = doc.internal.pageSize.height - 40;

        // Add horizontal line above footer - moved down 40px
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, footerY + 15, 190, footerY + 15);

        // Add Missy's info on right side
        const photoWidth = 25;
        const photoHeight = (missyImg.height / missyImg.width) * photoWidth;
        const photoY = footerY + 40; // Increased by 10px
        doc.addImage(missyImg, 'JPEG', 155, photoY - photoHeight - 15, photoWidth, photoHeight);

        // Add Missy's contact box
        const contactY = photoY - 10;
        doc.setFillColor(175, 35, 43);
        doc.rect(155, contactY - 4, 45, 32, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Missy Horner', 177.5, contactY, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text('Empire Title Services', 177.5, contactY + 6, { align: 'center' });
        doc.text('(765) 935-9966', 177.5, contactY + 12, { align: 'center' });
        doc.text('missy@empiretitleservice.com', 177.5, contactY + 18, { align: 'center' });
        doc.text('www.empiretitleservice.com', 177.5, contactY + 24, { align: 'center' });

        // Add agent's info on left side
        const agentPhotoWidth = 25;
        const agentPhotoHeight = (agentInfo.photoBase64.height / agentInfo.photoBase64.width) * agentPhotoWidth;
        doc.addImage(agentInfo.photoBase64, 'JPEG', 20, photoY - agentPhotoHeight - 15, agentPhotoWidth, agentPhotoHeight);

        // Add agent's contact box
        doc.setFillColor(175, 35, 43);
        doc.rect(20, contactY - 4, 45, 32, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(agentInfo.name, 42.5, contactY, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text(agentInfo.company || '', 42.5, contactY + 6, { align: 'center' });
        doc.text(agentInfo.phone || '', 42.5, contactY + 12, { align: 'center' });
        doc.text(agentInfo.email, 42.5, contactY + 18, { align: 'center' });
        doc.text(agentInfo.website || '', 42.5, contactY + 24, { align: 'center' });

        // Add disclaimer text in gray
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is an estimate of net proceeds and actual figures may vary.', 20, footerY + 55);
        doc.text('Not a final closing disclosure. For estimation purposes only.', 20, footerY + 60);

        // Create blob URL and open in new tab for printing
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Helper function to load image
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Show email modal
function showEmailModal() {
    // Implement email modal functionality here
    alert('Email functionality will be implemented based on your preferred email service.');
}

// Close email modal
function closeEmailModal() {
    document.getElementById('email-modal').classList.remove('visible');
}

// Show popup modal
function showPopupModal() {
    document.getElementById('popup-modal').classList.remove('hidden');
}

// Close popup modal
function closePopupModal() {
    document.getElementById('popup-modal').classList.add('hidden');
}

// Handle form submission and PDF generation
async function handlePopupFormSubmit(event) {
    event.preventDefault();
    
    const isAgent = document.querySelector('input[name="is_agent"]:checked').value === 'yes';
    const addLogo = document.querySelector('input[name="add_logo"]:checked')?.value === 'yes';
    
    // Get basic form data
    const formData = {
        firstName: document.getElementById('first-name').value,
        email: document.getElementById('email').value
    };

    // If agent with logo, get additional info
    if (isAgent && addLogo) {
        try {
            const logo = document.getElementById('agent-logo').files[0];
            const photo = document.getElementById('agent-image').files[0];
            
            if (!logo || !photo) {
                alert('Please select both a logo and a photo.');
                return;
            }

            formData.phone = document.getElementById('agent-phone').value;
            formData.logo = logo;
            formData.photo = photo;

            // Convert images to base64
            formData.logoBase64 = await fileToBase64(logo);
            formData.photoBase64 = await fileToBase64(photo);
            
            await generatePDFWithAgent(formData);
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Error processing images. Please make sure both files are valid images and try again.');
            return;
        }
    } else {
        // Generate regular PDF without agent info
        await generatePDF();
    }

    closePopupModal();
}

// Convert file to base64 with error handling
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Generate PDF with agent info
async function generatePDFWithAgent(agentInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Load all images first
        const [logoImg, missyImg] = await Promise.all([
            loadImage('./assets/empire-logo.png'),
            loadImage('./assets/missy-photo.jpg')
        ]);

        // Then load agent images
        const [agentLogoImg, agentPhotoImg] = await Promise.all([
            loadImage(agentInfo.logoBase64),
            loadImage(agentInfo.photoBase64)
        ]);

        // Add Empire logo
        const logoWidth = 90;
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', 20, 10, logoWidth, logoHeight);

        // Add agent's logo on the right
        const agentLogoWidth = 40;
        const agentLogoHeight = (agentLogoImg.height / agentLogoImg.width) * agentLogoWidth;
        doc.addImage(agentLogoImg, 'PNG', 140, 10, agentLogoWidth, agentLogoHeight);

        // Add title and line
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Seller Net Sheet", 105, 45, { align: 'center' });
        
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Add date and file number
        const footerY = doc.internal.pageSize.height - 40;
        doc.setFontSize(10);
        const today = new Date().toLocaleDateString();
        doc.text(`Date: ${today}`, 20, 60);
        doc.text(`File No: EST-${Math.random().toString().slice(2, 8)}`, 150, 60);

        // Add closing disclosure table
        let y = 70;
        const leftX = 20;
        const rightX = 180;
        const sectionGap = 8;
        const lineGap = 7;

        // Helper function for sections
        function addSection(title, items) {
            doc.setFont(undefined, 'bold');
            doc.setFillColor(240, 240, 240);
            doc.rect(leftX, y-5, rightX-leftX, 8, 'F');
            doc.text(title, leftX, y);
            y += sectionGap;
            
            doc.setFont(undefined, 'normal');
            items.forEach(([label, value]) => {
                doc.text(label, leftX, y);
                doc.text(value, rightX, y, { align: 'right' });
                y += lineGap;
            });
            y += 2;
        }

        // Add sections using calculated values
        const values = window.calculatedValues;
        
        addSection('Credits', [
            ['Sale Price', formatCurrency(values.salePrice)],
            ['Total Credits', formatCurrency(values.salePrice)]
        ]);

        addSection('Expenses', [
            ['Existing Mortgage', formatCurrency(values.existingMortgage)],
            ['Commission', formatCurrency(values.commission)],
            ['Title Insurance', formatCurrency(values.titleInsurance)],
            ['Settlement Fee', formatCurrency(values.settlementFee)],
            ['Search Fee', formatCurrency(values.searchFee)],
            ['Recording Fee', formatCurrency(values.recordingFee)],
            ['Property Taxes', formatCurrency(values.propertyTaxes)],
            ['Other Fees', formatCurrency(values.otherFees)],
            ['Total Expenses', formatCurrency(values.totalExpenses)]
        ]);

        addSection('Net Proceeds', [
            ['Estimated Net Proceeds', formatCurrency(values.netProceeds)]
        ]);

        // Add footer elements
        const lineY = footerY + 15;
        doc.setDrawColor(175, 35, 43);
        doc.setLineWidth(0.5);
        doc.line(20, lineY, 190, lineY);

        // Add Missy's info
        const photoY = footerY + 40;
        const photoWidth = 25;
        const photoHeight = (missyImg.height / missyImg.width) * photoWidth;
        doc.addImage(missyImg, 'JPEG', 155, photoY - photoHeight - 15, photoWidth, photoHeight);

        // Add Missy's contact box
        const contactY = photoY - 10;
        doc.setFillColor(175, 35, 43);
        doc.rect(155, contactY - 4, 45, 32, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Missy Horner', 177.5, contactY, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text('Empire Title Services', 177.5, contactY + 6, { align: 'center' });
        doc.text('(765) 935-9966', 177.5, contactY + 12, { align: 'center' });
        doc.text('missy@empiretitleservice.com', 177.5, contactY + 18, { align: 'center' });
        doc.text('www.empiretitleservice.com', 177.5, contactY + 24, { align: 'center' });

        // Add agent's info
        const agentPhotoWidth = 25;
        const agentPhotoHeight = (agentPhotoImg.height / agentPhotoImg.width) * agentPhotoWidth;
        doc.addImage(agentPhotoImg, 'JPEG', 20, photoY - agentPhotoHeight - 15, agentPhotoWidth, agentPhotoHeight);

        // Add agent's contact box
        doc.setFillColor(175, 35, 43);
        doc.rect(20, contactY - 4, 45, 32, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(agentInfo.firstName, 42.5, contactY, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text(agentInfo.company || '', 42.5, contactY + 6, { align: 'center' });
        doc.text(agentInfo.phone || '', 42.5, contactY + 12, { align: 'center' });
        doc.text(agentInfo.email, 42.5, contactY + 18, { align: 'center' });
        doc.text(agentInfo.website || '', 42.5, contactY + 24, { align: 'center' });

        // Add disclaimer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is an estimate of net proceeds and actual figures may vary.', 20, footerY + 55);
        doc.text('Not a final closing disclosure. For estimation purposes only.', 20, footerY + 60);

        // Output PDF
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error generating PDF. Please try again.');
    }
}

// Handle form submission and PDF generation
async function handlePopupFormSubmit(event) {
    event.preventDefault();
    
    const isAgent = document.querySelector('input[name="is_agent"]:checked').value === 'yes';
    const addLogo = document.querySelector('input[name="add_logo"]:checked')?.value === 'yes';
    
    // Get basic form data
    const formData = {
        firstName: document.getElementById('first-name').value,
        email: document.getElementById('email').value
    };

    // If agent with logo, get additional info
    if (isAgent && addLogo) {
        try {
            const logo = document.getElementById('agent-logo').files[0];
            const photo = document.getElementById('agent-image').files[0];
            
            if (!logo || !photo) {
                alert('Please select both a logo and a photo.');
                return;
            }

            formData.phone = document.getElementById('agent-phone').value;
            formData.logo = logo;
            formData.photo = photo;

            // Convert images to base64
            formData.logoBase64 = await fileToBase64(logo);
            formData.photoBase64 = await fileToBase64(photo);
            
            await generatePDFWithAgent(formData);
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Error processing images. Please make sure both files are valid images and try again.');
            return;
        }
    } else {
        // Generate regular PDF without agent info
        await generatePDF();
    }

    closePopupModal();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for modals and forms
    const popupForm = document.getElementById('popup-form');
    if (popupForm) {
        popupForm.addEventListener('submit', handlePopupFormSubmit);
    }
});
