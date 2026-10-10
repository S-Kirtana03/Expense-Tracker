document.addEventListener("DOMContentLoaded", function () {
    // Erase all previously entered data and reset to zero
    if (!sessionStorage.getItem("expense_tracker_reset_done")) {
        localStorage.setItem("expenses", JSON.stringify([]));
        localStorage.setItem("savings", JSON.stringify([]));
        sessionStorage.setItem("expense_tracker_reset_done", "true");
    } else {
        if (!localStorage.getItem("expenses")) {
            localStorage.setItem("expenses", JSON.stringify([]));
        }
        if (!localStorage.getItem("savings")) {
            localStorage.setItem("savings", JSON.stringify([]));
        }
    }

    console.log("Expense Tracker initialized with clean zero state.");
});