import $ from 'jquery';

export function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

export function parseInputValue(value) {
    if (!value) return 0;
    return parseInt(value.replace(/[$,]/g, '')) || 0;
}

export function setupCurrencyInput(element) {
    let lastValue = '';
    
    $(element).on('input', function(e) {
        const input = e.target;
        const cursorPos = input.selectionStart;
        
        // Remove all non-numeric characters
        let rawValue = input.value.replace(/[^\d]/g, '');
        
        // Handle empty or invalid input
        if (!rawValue) {
            input.value = '';
            lastValue = '';
            return;
        }

        // Prevent more than 9 digits (billions)
        if (rawValue.length > 9) {
            rawValue = rawValue.slice(0, 9);
        }

        const numValue = parseInt(rawValue);
        if (!isNaN(numValue)) {
            const formattedValue = formatCurrency(numValue);
            
            // Only update if value changed
            if (formattedValue !== lastValue) {
                // Count number of digits before cursor
                const beforeCursor = input.value.slice(0, cursorPos).replace(/[^\d]/g, '').length;
                
                lastValue = formattedValue;
                input.value = formattedValue;
                
                // Find new cursor position by counting digits
                let newPos = 1; // Start after '$'
                let digitCount = 0;
                while (digitCount < beforeCursor && newPos < formattedValue.length) {
                    if (/\d/.test(formattedValue[newPos])) {
                        digitCount++;
                    }
                    newPos++;
                }
                
                // Set cursor position after brief delay to ensure it works
                setTimeout(() => {
                    input.setSelectionRange(newPos, newPos);
                }, 0);
            }
        }
    });

    // Handle initial focus
    $(element).on('focus', function() {
        if (!this.value) {
            this.value = '';
        }
    });
}