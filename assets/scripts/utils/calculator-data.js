import $ from 'jquery';

export function getCalculatorData() {
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