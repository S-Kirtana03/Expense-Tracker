// Savings.js - Handle savings tracking and display

document.addEventListener('DOMContentLoaded', function() {
    const savingsForm = document.getElementById('savings_form');
    const savingsDateInput = document.getElementById('savings_date');
    const savingsAmountInput = document.getElementById('savings_amount');
    const totalSavingsSpan = document.getElementById('total_savings');
    const addSavingsBtn = document.getElementById('add_savings');

    // Load savings from localStorage
    function loadSavings() {
        const storedSavings = localStorage.getItem('savings');
        return storedSavings ? JSON.parse(storedSavings) : [];
    }

    // Save savings to localStorage
    function saveSavings(savings) {
        localStorage.setItem('savings', JSON.stringify(savings));
    }

    // Calculate and display total savings
    function displayTotalSavings() {
        const savings = loadSavings();
        let total = 0;

        savings.forEach(saving => {
            total += parseFloat(saving.amount);
        });

        totalSavingsSpan.textContent = total.toFixed(2);
    }

    // Handle form submission
    savingsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const date = savingsDateInput.value;
        const amount = savingsAmountInput.value;

        // Validation
        if (!amount || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const saving = {
            date,
            amount
        };

        const savings = loadSavings();
        savings.push(saving);
        saveSavings(savings);

        // Show success message
        alert('Savings added successfully!');

        // Reset form
        savingsForm.reset();

        // Refresh display
        displayTotalSavings();
    });

    // Initial display
    displayTotalSavings();
});
