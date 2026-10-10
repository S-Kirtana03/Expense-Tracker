// Expense.js - Handle expense tracking and display

document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const categorySelect = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('expense_date');
    const notesInput = document.getElementById('notes');
    const expenseList = document.getElementById('expense-list');
    const totalSpan = document.getElementById('total');
    const addBtn = document.getElementById('add');

    // Load expenses from localStorage
    function loadExpenses() {
        const storedExpenses = localStorage.getItem('expenses');
        return storedExpenses ? JSON.parse(storedExpenses) : [];
    }

    // Save expenses to localStorage
    function saveExpenses(expenses) {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Display all expenses
    function displayExpenses() {
        const expenses = loadExpenses();
        expenseList.innerHTML = '';
        let total = 0;

        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${expense.category}</strong> - ₹${expense.amount} (${expense.date}) 
                            ${expense.notes ? '- ' + expense.notes : ''}
                            <button class="delete-btn" data-index="${index}">Delete</button>`;
            expenseList.appendChild(li);
            total += parseFloat(expense.amount);
        });

        totalSpan.textContent = total.toFixed(2);

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                expenses.splice(index, 1);
                saveExpenses(expenses);
                displayExpenses();
            });
        });
    }

    // Handle form submission
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const category = categorySelect.value;
        const amount = amountInput.value;
        const date = dateInput.value;
        const notes = notesInput.value;

        // Validation
        if (!amount || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const expense = {
            category,
            amount,
            date,
            notes
        };

        const expenses = loadExpenses();
        expenses.push(expense);
        saveExpenses(expenses);

        // Show success message
        alert('Expenditure added successfully!');

        // Reset form
        expenseForm.reset();

        // Refresh display
        displayExpenses();
    });

    // Initial display
    displayExpenses();
});
