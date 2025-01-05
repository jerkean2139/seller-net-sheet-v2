// Add this function at the beginning of your scripts.js file
function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(number);
}

// Initialize jQuery document ready
$(document).ready(function() {
    // Update your calculate button click handler
    $('#calculate-btn').on('click', function(e) {
        e.preventDefault();

        // Parse input values
        const salePrice = parseFloat($('#sale-price').val().replace(/[$,]/g, '')) || 0;
        const mortgagePayoff = parseFloat($('#mortgage-payoff').val().replace(/[$,]/g, '')) || 0;
        const realtorCommission = parseFloat($('#realtor-commission').val()) || 0;
        const taxesDue = parseFloat($('#taxes-due').val().replace(/[$,]/g, '')) || 0;
        const additionalCosts = parseFloat($('#additional-costs').val().replace(/[$,]/g, '')) || 0;

        // Calculate fees
        const titleInsurance = Math.round((0.75 / 100) * salePrice);
        const empireFees = 200 + 50 + 35 + 25 + 25 + 150;
        const totalEmpireFees = empireFees + titleInsurance;
        const commission = (realtorCommission / 100) * salePrice;
        const totalExpenses = mortgagePayoff + commission + taxesDue + additionalCosts + totalEmpireFees;
        const netProceeds = salePrice - totalExpenses;

        // Update table with formatted values
        $('#purchase-price-output').text(formatCurrency(salePrice));
        $('#mortgage-payoff-output').text(formatCurrency(mortgagePayoff));
        $('#realtor-commission-output').text(formatCurrency(commission));
        $('#real-estate-taxes-output').text(formatCurrency(taxesDue));
        $('#title-company-output').text(formatCurrency(totalEmpireFees));
        $('#additional-costs-output').text(formatCurrency(additionalCosts));
        $('#total-expenses-output').text(formatCurrency(totalExpenses));
        $('#net-proceeds-output').text(formatCurrency(netProceeds));

        // Update Empire Fees section
        $('#title-insurance-fee').text(formatCurrency(titleInsurance));
        $('#empire-subtotal').text(formatCurrency(totalEmpireFees));

        // Add animation class to show calculation update
        $('.output-table').addClass('calculation-updated');
        setTimeout(() => {
            $('.output-table').removeClass('calculation-updated');
        }, 500);
    });
});