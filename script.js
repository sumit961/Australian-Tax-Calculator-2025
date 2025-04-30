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
    let breakdown = [];

    for (const bracket of taxBrackets) {
        if (income > bracket.min) {
            const upperLimit = Math.min(income, bracket.max);
            const taxableAmount = upperLimit - bracket.min;
            const bracketTax = taxableAmount * bracket.rate;

            if (taxableAmount > 0) {
                breakdown.push({
                    range: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`,
                    amount: bracketTax.toFixed(2),
                    rate: `${(bracket.rate * 100).toFixed(0)}%`
                });
                incomeTaxOnly += bracketTax;
            }
        }
    }

    const medicareLevy = income * 0.02;
    const taxWithLevy = incomeTaxOnly + medicareLevy;

    breakdown.push({
        range: "Medicare Levy",
        amount: medicareLevy.toFixed(2),
        rate: "2%"
    });

    showResult(incomeTaxOnly, taxWithLevy, breakdown);
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

    for (const bracket of taxBrackets) {
        if (income > bracket.min) {
            const upperLimit = Math.min(income, bracket.max);
            const taxableAmount = upperLimit - bracket.min;
            incomeTaxOnly += taxableAmount * bracket.rate;
        }
    }

    const medicareLevy = income * 0.02;
    const taxWithLevy = incomeTaxOnly + medicareLevy;

    const returnAmountNoLevy = taxPaid - incomeTaxOnly;
    const returnAmountWithLevy = taxPaid - taxWithLevy;

    const returnElement = document.getElementById('returnResult');
    document.getElementById('returnAmountNoLevy').textContent = Math.abs(returnAmountNoLevy).toFixed(2);
    document.getElementById('returnAmount').textContent = Math.abs(returnAmountWithLevy).toFixed(2);

    returnElement.style.background = returnAmountWithLevy < 0
        ? "linear-gradient(135deg, #E63946, #FF6B6B)"
        : "linear-gradient(135deg, #457B9D, #1D3557)";

    returnElement.classList.add('visible');
}


// Add input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
});
