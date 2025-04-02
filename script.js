const taxBrackets = [
    { min: 0, max: 18200, rate: 0, base: 0 },
    { min: 18201, max: 45000, rate: 0.16, base: 0 },
    { min: 45001, max: 135000, rate: 0.30, base: 4288 },
    { min: 135001, max: 190000, rate: 0.37, base: 31288 },
    { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
];

function calculateTax() {
    const income = parseFloat(document.getElementById('income').value);
    if (isNaN(income)) {
        alert("Please enter a valid income amount");
        return;
    }
    
    let incomeTaxOnly = 0;
    let taxWithLevy = 0;
    let breakdown = [];
    let medicareLevy = income * 0.02; // Standard 2% Medicare Levy

    for (const bracket of taxBrackets) {
        if (income > bracket.min) {
            const taxable = Math.min(income - bracket.min, bracket.max - bracket.min);
            const bracketTax = taxable * bracket.rate;
            if (taxable > 0) {
                breakdown.push({
                    range: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`,
                    amount: (bracket.base + bracketTax).toFixed(2),
                    rate: `${(bracket.rate * 100).toFixed(0)}%`
                });
            }
            incomeTaxOnly += bracketTax;
        }
    }

    // Add base tax from the appropriate bracket
    const applicableBracket = taxBrackets.find(b => income > b.min && income <= b.max);
    if (applicableBracket) {
        incomeTaxOnly += applicableBracket.base;
    }

    // Calculate tax with Medicare Levy
    taxWithLevy = incomeTaxOnly + medicareLevy;
    
    // Add Medicare Levy to breakdown
    breakdown.push({
        range: "Medicare Levy",
        amount: medicareLevy.toFixed(2),
        rate: "2%"
    });

    showResult(incomeTaxOnly, taxWithLevy, breakdown);
}

function showResult(incomeTaxOnly, taxWithLevy, breakdown) {
    const resultCard = document.getElementById('taxResult');
    const breakdownElement = document.getElementById('taxBreakdown');
    
    // Update the values
    document.getElementById('incomeTaxOnly').textContent = incomeTaxOnly.toFixed(2);
    document.getElementById('totalTax').textContent = taxWithLevy.toFixed(2);
    
    // Create breakdown table
    breakdownElement.innerHTML = `
        <div style="font-weight: bold; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <span>Tax Bracket</span>
            <span>Amount</span>
        </div>
        ${
            breakdown.map(b => `
                <div>
                    <span>${b.range}</span>
                    <span>$${b.amount} ${b.rate ? `(${b.rate})` : ''}</span>
                </div>
            `).join('')
        }
    `;
    
    // Show the result card
    resultCard.classList.add('visible');
    
    // Add celebration effect for low tax
    if (taxWithLevy < 10000) {
        resultCard.style.animation = "pulse 2s";
        setTimeout(() => {
            resultCard.style.animation = "";
        }, 2000);
    }
}

function calculateReturn() {
    const income = parseFloat(document.getElementById('returnIncome').value);
    const taxPaid = parseFloat(document.getElementById('taxPaid').value);
    
    if (isNaN(income)) {
        alert("Please enter a valid income amount");
        return;
    }
    
    if (isNaN(taxPaid)) {
        alert("Please enter a valid tax paid amount");
        return;
    }
    
    let incomeTaxOnly = 0;
    let medicareLevy = income * 0.02; // Standard 2% Medicare Levy

    for (const bracket of taxBrackets) {
        if (income > bracket.min) {
            const taxable = Math.min(income - bracket.min, bracket.max - bracket.min);
            incomeTaxOnly += taxable * bracket.rate;
        }
    }

    // Add base tax from the appropriate bracket
    const applicableBracket = taxBrackets.find(b => income > b.min && income <= b.max);
    if (applicableBracket) {
        incomeTaxOnly += applicableBracket.base;
    }

    // Calculate tax with Medicare Levy
    const taxWithLevy = incomeTaxOnly + medicareLevy;

    // Calculate return amounts
    const returnAmountNoLevy = taxPaid - incomeTaxOnly;
    const returnAmountWithLevy = taxPaid - taxWithLevy;
    
    // Update the display
    const returnElement = document.getElementById('returnResult');
    document.getElementById('returnAmountNoLevy').textContent = Math.abs(returnAmountNoLevy).toFixed(2);
    document.getElementById('returnAmount').textContent = Math.abs(returnAmountWithLevy).toFixed(2);
    
    // Set appropriate colors and labels
    if (returnAmountWithLevy < 0) {
        returnElement.style.background = "linear-gradient(135deg, #E63946, #FF6B6B)";
    } else {
        returnElement.style.background = "linear-gradient(135deg, #457B9D, #1D3557)";
    }
    
    // Show the result card
    returnElement.classList.add('visible');
}

// Add input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
});
