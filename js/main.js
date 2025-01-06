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
    const price = parseFloat(salePrice.replace(/[^0-9.]/g, ''));
    
    if (price <= 50000) return 375;
    if (price <= 100000) return 525;
    if (price <= 200000) return 725;
    if (price <= 300000) return 925;
    if (price <= 400000) return 1125;
    if (price <= 500000) return 1325;
    return 1325 + ((price - 500000) * 0.00425); // $4.25 per thousand over $500k
}

// Calculate seller net proceeds
function calculateSellerNet() {
    // Show the results section first
    document.getElementById('seller-net-result').style.display = 'block';

    // Get input values
    const salePrice = document.getElementById('sale_price').value;
    const existingMortgage = document.getElementById('existing_mortgage').value || '0';
    const commissionRate = document.getElementById('commission_rate').value || '6';
    const propertyTaxes = document.getElementById('property_taxes').value || '0';
    const otherFees = document.getElementById('other_fees').value || '0';

    // Parse values and remove non-numeric characters
    const parsedSalePrice = parseFloat(salePrice.replace(/[^\d.]/g, '')) || 0;
    const parsedExistingMortgage = parseFloat(existingMortgage.replace(/[^\d.]/g, '')) || 0;
    const parsedCommissionRate = parseFloat(commissionRate) || 6;
    const parsedPropertyTaxes = parseFloat(propertyTaxes.replace(/[^\d.]/g, '')) || 0;
    const parsedOtherFees = parseFloat(otherFees.replace(/[^\d.]/g, '')) || 0;

    // Calculate title fees automatically
    const titleInsurance = calculateTitleInsurance(salePrice);
    const settlementFee = 350; // Fixed fee
    const searchFee = 175; // Fixed fee
    const recordingFee = 100; // Fixed fee

    // Calculate commission
    const commission = parsedSalePrice * (parsedCommissionRate / 100);

    // Calculate total title fees
    const totalTitleFees = titleInsurance + settlementFee + searchFee + recordingFee;

    // Calculate total expenses
    const totalExpenses = parsedExistingMortgage + commission + totalTitleFees + 
                        parsedPropertyTaxes + parsedOtherFees;

    // Calculate net proceeds
    const netProceeds = parsedSalePrice - totalExpenses;

    // Store values for PDF generation
    window.calculatedValues = {
        salePrice: parsedSalePrice,
        existingMortgage: parsedExistingMortgage,
        commission: commission,
        titleInsurance: titleInsurance,
        settlementFee: settlementFee,
        searchFee: searchFee,
        propertyTaxes: parsedPropertyTaxes,
        recordingFee: recordingFee,
        otherFees: parsedOtherFees,
        totalExpenses: totalExpenses,
        netProceeds: netProceeds
    };

    // Update all output elements
    const outputs = {
        'sale-price-output': parsedSalePrice,
        'total-credits-output': parsedSalePrice,
        'mortgage-output': parsedExistingMortgage,
        'commission-output': commission,
        'title-insurance-output': titleInsurance,
        'closing-fee-output': settlementFee,
        'search-fee-output': searchFee,
        'recording-fee-output': recordingFee,
        'taxes-output': parsedPropertyTaxes,
        'other-output': parsedOtherFees,
        'total-expenses-output': totalExpenses,
        'net-proceeds-output': netProceeds
    };

    // Update each output element
    Object.entries(outputs).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = formatCurrency(value);
        }
    });
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
        const photoY = footerY + 30; // Moved down 40px
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
        // Load images
        const [logoImg, missyImg, agentLogoImg, agentPhotoImg] = await Promise.all([
            loadImage('./assets/empire-logo.png'),
            loadImage('./assets/missy-photo.jpg'),
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
        const photoY = footerY + 30;
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
        const agentPhotoHeight = (agentPhotoImg.height / agentPhotoImg.width) * agentPhotoWidth;
        doc.addImage(agentPhotoImg, 'JPEG', 20, photoY - agentPhotoHeight - 15, agentPhotoWidth, agentPhotoHeight);

        // Add agent's contact box
        doc.setFillColor(175, 35, 43);
        doc.rect(20, contactY - 4, 45, 32, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(agentInfo.name, 42.5, contactY, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text(agentInfo.company, 42.5, contactY + 6, { align: 'center' });
        doc.text(agentInfo.phone, 42.5, contactY + 12, { align: 'center' });
        doc.text(agentInfo.email, 42.5, contactY + 18, { align: 'center' });
        doc.text(agentInfo.website, 42.5, contactY + 24, { align: 'center' });

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
        formData.phone = document.getElementById('agent-phone').value;
        formData.logo = document.getElementById('agent-logo').files[0];
        formData.photo = document.getElementById('agent-image').files[0];

        try {
            formData.logoBase64 = await fileToBase64(formData.logo);
            formData.photoBase64 = await fileToBase64(formData.photo);
            generatePDFWithAgent(formData);
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Error processing images. Please try again.');
            return;
        }
    } else {
        // Generate regular PDF without agent info
        generatePDF();
    }

    closePopupModal();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners for real-time calculation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateSellerNet);
    });

    // Get currency input fields
    const currencyInputs = document.querySelectorAll('.currency-input');
    
    currencyInputs.forEach(input => {
        // Format on blur
        input.addEventListener('blur', function() {
            formatInputAsCurrency(this);
        });
        
        // Handle focus - remove currency formatting
        input.addEventListener('focus', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
        
        // Handle keypress - only allow numbers
        input.addEventListener('keypress', function(e) {
            if (!/[\d]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Handle agent radio button change
    document.querySelectorAll('input[name="is_agent"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const logoQuestion = document.getElementById('logo-question');
            if (this.value === 'yes') {
                logoQuestion.classList.remove('hidden');
            } else {
                logoQuestion.classList.add('hidden');
                document.getElementById('upload-fields').classList.add('hidden');
                document.querySelector('input[name="add_logo"][value="no"]').checked = true;
            }
        });
    });

    // Handle logo radio button change
    document.querySelectorAll('input[name="add_logo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const uploadFields = document.getElementById('upload-fields');
            if (this.value === 'yes') {
                uploadFields.classList.remove('hidden');
            } else {
                uploadFields.classList.add('hidden');
            }
        });
    });

    // Handle popup form submission
    document.getElementById('popup-form').addEventListener('submit', handlePopupFormSubmit);

    // Close popup when clicking cancel
    document.getElementById('close-popup').addEventListener('click', closePopupModal);

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('popup-modal');
        if (event.target === modal) {
            closePopupModal();
        }
    });

    // Show popup when clicking print/save button
    document.getElementById('show-popup-btn').addEventListener('click', function(e) {
        e.preventDefault();
        calculateSellerNet(); // Make sure calculations are up to date
        showPopupModal();
    });
});
