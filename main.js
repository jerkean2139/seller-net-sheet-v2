import './assets/styles.css';

function calculateSellerNet() {
    const salePrice = parseFloat(document.getElementById('sale_price').value);
    const existingMortgage = parseFloat(document.getElementById('existing_mortgage').value);
    const commissionRate = parseFloat(document.getElementById('commission_rate').value) / 100;
    const propertyTaxes = parseFloat(document.getElementById('property_taxes').value);

    if ([salePrice, existingMortgage, commissionRate, propertyTaxes].some(isNaN)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    const commission = salePrice * commissionRate;
    const netProceeds = salePrice - existingMortgage - commission - propertyTaxes;

    const resultHtml = `
        <h4>Results:</h4>
        <p>Sale Price: $${salePrice.toLocaleString()}</p>
        <p>Commission: $${commission.toLocaleString()}</p>
        <p>Existing Mortgage: $${existingMortgage.toLocaleString()}</p>
        <p>Property Taxes: $${propertyTaxes.toLocaleString()}</p>
        <p class="net-proceeds">Estimated Net Proceeds: $${netProceeds.toLocaleString()}</p>
    `;

    document.getElementById('seller-net-result').innerHTML = resultHtml;
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateSellerNet);
    }
});