<div class="calculator-inputs">
    <form id="calculator-form">
        <div class="input-group">
            <label for="sale-price">Sale Price:</label>
            <input type="text" id="sale-price" name="sale_price" placeholder="$0.00" required>
        </div>

        <div class="input-group">
            <label for="mortgage-payoff">Mortgage Payoff:</label>
            <input type="text" id="mortgage-payoff" name="mortgage_payoff" placeholder="$0.00">
        </div>

        <div class="input-group">
            <label for="realtor-commission">Realtor Commission (%):</label>
            <input type="number" id="realtor-commission" name="realtor_commission" placeholder="6" step="0.1" min="0" max="100">
        </div>

        <div class="input-group">
            <label for="taxes-due">Real Estate Taxes Due:</label>
            <input type="text" id="taxes-due" name="taxes_due" placeholder="$0.00">
        </div>

        <div class="input-group">
            <label for="additional-costs">Additional Costs:</label>
            <input type="text" id="additional-costs" name="additional_costs" placeholder="$0.00">
        </div>

        <div class="empire-fees">
            <h3>Empire Fees</h3>
            <div class="fee-item">Title Insurance: <span id="title-insurance-fee">$0.00</span></div>
            <div class="fee-item">Settlement Fee: $200</div>
            <div class="fee-item">Title Search: $50</div>
            <div class="fee-item">Wire Fee: $35</div>
            <div class="fee-item">Courier Fee: $25</div>
            <div class="fee-item">E-doc Fee: $25</div>
            <div class="fee-item">CPL: $150</div>
            <div class="fee-item"><strong>Total: <span id="empire-subtotal">$485</span></strong></div>
        </div>

        <button type="button" id="calculate-btn">Calculate</button>
    </form>
</div>