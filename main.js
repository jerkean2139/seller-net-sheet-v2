// Import dependencies
import './assets/styles.css';
import $ from 'jquery';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Format currency for display
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Calculate title insurance based on sale price
function calculateTitleInsurance(salePrice) {
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
function calculateSellerNet(event) {
    if (event) event.preventDefault();

    // Get input values using jQuery
    const salePrice = parseFloat($('#sale-price').val()) || 0;
    const existingMortgage = parseFloat($('#existing-mortgage').val()) || 0;
    const commission = parseFloat($('#commission').val()) || 0;
    const propertyTaxes = parseFloat($('#property-taxes').val()) || 0;
    const otherFees = parseFloat($('#other-fees').val()) || 0;

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

    // Update results panel using jQuery
    $('.results-panel').html(`
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
    `).show();

    // Add animation classes
    setTimeout(() => {
        $('.results-panel').addClass('visible');
        $('.calculator-input').addClass('shifted');
    }, 50);
}

// Initialize when document is ready
$(document).ready(() => {
    // Expose calculate function globally
    window.calculateSellerNet = calculateSellerNet;

    // Format currency inputs
    $('.currency-input').on({
        input: function() {
            // Remove any non-numeric characters except decimal point
            this.value = this.value.replace(/[^\d.]/g, '');
            
            // Ensure only one decimal point
            const decimalCount = (this.value.match(/\./g) || []).length;
            if (decimalCount > 1) {
                this.value = this.value.replace(/\.+$/, '');
            }
            
            // Limit to two decimal places
            const parts = this.value.split('.');
            if (parts[1] && parts[1].length > 2) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        }
    });

    // Add calculate button event listener
    $('#calculate-button').on('click', calculateSellerNet);
});