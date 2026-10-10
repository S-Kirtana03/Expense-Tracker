// Balance.js - Display expense breakdown and pie chart

document.addEventListener('DOMContentLoaded', function() {
    const categorySummaryList = document.getElementById('category-summary');
    const pieChartCanvas = document.getElementById('pie-chart');
    const ctx = pieChartCanvas.getContext('2d');

    // Load expenses from localStorage
    function loadExpenses() {
        const storedExpenses = localStorage.getItem('expenses');
        return storedExpenses ? JSON.parse(storedExpenses) : [];
    }

    // Load savings from localStorage
    function loadSavings() {
        const storedSavings = localStorage.getItem('savings');
        return storedSavings ? JSON.parse(storedSavings) : [];
    }

    // Display category summary
    function displayCategorySummary() {
        const expenses = loadExpenses();
        const categoryMap = {};

        expenses.forEach(expense => {
            if (categoryMap[expense.category]) {
                categoryMap[expense.category] += parseFloat(expense.amount);
            } else {
                categoryMap[expense.category] = parseFloat(expense.amount);
            }
        });

        categorySummaryList.innerHTML = '';

        for (const [category, amount] of Object.entries(categoryMap)) {
            const li = document.createElement('li');
            li.textContent = `${category}: ₹${amount.toFixed(2)}`;
            categorySummaryList.appendChild(li);
        }
    }

    // Draw pie chart for Expenses vs Savings
    function drawPieChart() {
        const expenses = loadExpenses();
        const savings = loadSavings();

        let totalExpenses = 0;
        let totalSavings = 0;

        expenses.forEach(expense => {
            totalExpenses += parseFloat(expense.amount);
        });

        savings.forEach(saving => {
            totalSavings += parseFloat(saving.amount);
        });

        const total = totalExpenses + totalSavings;

        // Clear canvas
        ctx.clearRect(0, 0, pieChartCanvas.width, pieChartCanvas.height);

        if (total === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgb(6, 9, 96)';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', pieChartCanvas.width / 2, pieChartCanvas.height / 2);
            return;
        }

        // Calculate angles
        const expenseAngle = (totalExpenses / total) * 2 * Math.PI;
        const savingsAngle = (totalSavings / total) * 2 * Math.PI;

        // Draw pie slices
        const centerX = pieChartCanvas.width / 2;
        const centerY = pieChartCanvas.height / 2;
        const radius = 100;

        // Expense slice (red)
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, expenseAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Savings slice (green)
        ctx.fillStyle = '#388e3c';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, expenseAngle, expenseAngle + savingsAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = 'rgb(6, 9, 96)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw labels
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Expense label
        const expenseX = centerX + (radius / 2) * Math.cos(expenseAngle / 2);
        const expenseY = centerY + (radius / 2) * Math.sin(expenseAngle / 2);
        ctx.fillText(`Expense: ₹${totalExpenses.toFixed(0)}`, expenseX, expenseY);

        // Savings label
        const savingsX = centerX + (radius / 2) * Math.cos(expenseAngle + savingsAngle / 2);
        const savingsY = centerY + (radius / 2) * Math.sin(expenseAngle + savingsAngle / 2);
        ctx.fillText(`Savings: ₹${totalSavings.toFixed(0)}`, savingsX, savingsY);

        // Draw legend
        const legendY = pieChartCanvas.height - 40;

        // Expense legend
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(20, legendY, 15, 15);
        ctx.fillStyle = 'rgb(6, 9, 96)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Expenses', 40, legendY + 12);

        // Savings legend
        ctx.fillStyle = '#388e3c';
        ctx.fillRect(150, legendY, 15, 15);
        ctx.fillStyle = 'rgb(6, 9, 96)';
        ctx.fillText('Savings', 170, legendY + 12);
    }

    // Initial display
    displayCategorySummary();
    drawPieChart();
});
