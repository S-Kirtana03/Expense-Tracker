// savings.js - Mirror of savongs.js for compatibility

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("savings_form");
    const amountInput = document.getElementById("savings_amount");
    const dateInput = document.getElementById("savings_date");
    const totalSavingsElement = document.getElementById("total_savings");

    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }

    function getStoredSavings() {
        try {
            const data = localStorage.getItem("savings");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading savings from storage:", e);
            return [];
        }
    }

    function saveSavings(savings) {
        try {
            localStorage.setItem("savings", JSON.stringify(savings));
        } catch (e) {
            console.error("Error saving savings to storage:", e);
        }
    }

    let savings = getStoredSavings();

    function updateTotal() {
        const total = savings.reduce(function (sum, item) {
            return sum + (Number(item.amount) || 0);
        }, 0);

        if (totalSavingsElement) {
            totalSavingsElement.textContent = total;
        }
        return total;
    }

    updateTotal();

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const amount = Number(amountInput.value);
            const dateVal = dateInput.value || new Date().toISOString().split("T")[0];

            if (!amount || amount <= 0) {
                try {
                    alert("Please enter a valid amount");
                } catch (e) {
                    console.log("Please enter a valid amount");
                }
                return;
            }

            const newSavingsEntry = {
                id: Date.now(),
                amount: amount,
                date: dateVal
            };

            savings.push(newSavingsEntry);
            saveSavings(savings);

            const newTotal = updateTotal();
            console.log("New total savings:", newTotal);

            try {
                alert("Savings added");
            } catch (e) {
                console.log("Savings added");
            }

            form.reset();
            if (dateInput) {
                dateInput.value = new Date().toISOString().split("T")[0];
            }
        });
    }
});
