// expense.js - Expense logging and management

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalElement = document.getElementById("total");
    const dateInput = document.getElementById("expense_date");

    // Default date input to today
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }

    // Load existing expenses from localStorage
    function getStoredExpenses() {
        try {
            const data = localStorage.getItem("expenses");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading expenses from storage:", e);
            return [];
        }
    }

    function saveExpenses(expenses) {
        try {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        } catch (e) {
            console.error("Error saving expenses to storage:", e);
        }
    }

    let expenses = getStoredExpenses();
    let total = 0;

    // Render saved expenses
    function renderExpenses() {
        if (!expenseList || !totalElement) return;
        expenseList.innerHTML = "";
        total = 0;

        expenses.forEach(function (item) {
            total += Number(item.amount) || 0;
            const li = document.createElement("li");
            const noteText = item.note && item.note.trim() ? " | " + item.note.trim() : "";
            li.textContent = `${item.category} - ₹${item.amount} - ${item.date}${noteText}`;
            expenseList.appendChild(li);
        });

        totalElement.textContent = total;
    }

    renderExpenses();

    // Handle form submission
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const categorySelect = document.getElementById("category");
            const categoryText = categorySelect.options[categorySelect.selectedIndex] 
                ? categorySelect.options[categorySelect.selectedIndex].text 
                : categorySelect.value;
            const categoryVal = categorySelect.value;
            const amountInput = document.getElementById("amount");
            const amount = Number(amountInput.value);
            const dateVal = document.getElementById("expense_date").value || new Date().toISOString().split("T")[0];
            const noteVal = document.getElementById("notes").value.trim();

            if (!amount || amount <= 0) {
                try {
                    alert("Please enter a valid amount");
                } catch (e) {
                    console.log("Please enter a valid amount");
                }
                return;
            }

            const newExpense = {
                id: Date.now(),
                category: categoryText,
                categoryKey: categoryVal,
                amount: amount,
                date: dateVal,
                note: noteVal
            };

            expenses.push(newExpense);
            saveExpenses(expenses);

            // Update DOM
            const li = document.createElement("li");
            const noteText = noteVal ? " | " + noteVal : "";
            li.textContent = `${categoryText} - ₹${amount} - ${dateVal}${noteText}`;
            expenseList.appendChild(li);

            total += amount;
            totalElement.textContent = total;
            console.log("New total is:", total);

            // Popup notification as requested
            try {
                alert("Expenditure added");
            } catch (e) {
                console.log("Expenditure added");
            }

            form.reset();
            if (dateInput) {
                dateInput.value = new Date().toISOString().split("T")[0];
            }
        });
    }
});