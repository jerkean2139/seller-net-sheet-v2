import { formatCurrency, parseInputValue, setupCurrencyInput } from './utils/currency.js';

export class Calculator {
    constructor() {
        this.form = document.getElementById('calculator-form');
        this.calculateBtn = document.getElementById('calculate-btn');
        this.resultsSection = document.getElementById('results');
    }

    init() {
        console.log('Initializing calculator');
        this.bindEvents();
        this.setupInputs();
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => {
            console.log('Calculate button clicked');
            this.calculateResults();
        });
    }

    setupInputs() {
        // Setup currency formatting for all currency inputs
        const currencyInputs = ['sale-price', 'mortgage-payoff', 'taxes-due', 'additional-costs'];
        currencyInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/[^\d.]/g, '');
                    if (value) {
                        value = parseFloat(value).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        });
                        e.target.value = value;
                    }
                });
            }
        });

        // Ensure number-only input for commission
        const realtorCommissionInput = document.getElementById('realtor-commission');
        if (realtorCommissionInput) {
            realtorCommissionInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d.]/g, '');
                e.target.value = value;
            });
        }
    }

    calculateResults() {
        console.log('Calculating results');
        const values = {
            salePrice: this.parseCurrency(document.getElementById('sale-price').value),
            mortgagePayoff: this.parseCurrency(document.getElementById('mortgage-payoff').value),
            realtorCommission: parseFloat(document.getElementById('realtor-commission').value) || 0,
            taxesDue: this.parseCurrency(document.getElementById('taxes-due').value),
            additionalCosts: this.parseCurrency(document.getElementById('additional-costs').value)
        };

        const results = this.performCalculations(values);
        this.updateOutputs(results);
    }

    parseCurrency(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[$,]/g, '')) || 0;
    }

    performCalculations(values) {
        console.log('Performing calculations with values:', values);
        const titleInsurance = Math.round((0.75 / 100) * values.salePrice);
        const empireFees = 200 + 50 + 35 + 25 + 25 + 150;
        const totalEmpireFees = empireFees + titleInsurance;
        const commission = (values.realtorCommission / 100) * values.salePrice;
        
        return {
            titleInsurance,
            empireFees: totalEmpireFees,
            commission,
            netProceeds: values.salePrice - values.mortgagePayoff - commission - values.taxesDue - totalEmpireFees - values.additionalCosts
        };
    }

    updateOutputs(results) {
        console.log('Updating outputs with results:', results);
        document.getElementById('title-insurance-fee').textContent = this.formatCurrency(results.titleInsurance);
        document.getElementById('empire-subtotal').textContent = this.formatCurrency(results.empireFees);
        document.getElementById('realtor-commission-output').textContent = this.formatCurrency(results.commission);
        document.getElementById('net-proceeds-output').textContent = this.formatCurrency(results.netProceeds);
        
        this.resultsSection.style.display = 'block';
    }

    formatCurrency(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }
}

export function calculateSellerNet() {
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