// balance.js - Expenditure Summary, Category Breakdown, and Expenditure vs Savings Pie Chart

document.addEventListener("DOMContentLoaded", function () {
    const totalExpenseElement = document.getElementById("total-expense");
    const categorySummaryList = document.getElementById("category-summary");
    const canvas = document.getElementById("pie-chart");

    // Retrieve data from localStorage
    function getStoredExpenses() {
        try {
            const data = localStorage.getItem("expenses");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error loading expenses:", e);
            return [];
        }
    }

    function getStoredSavings() {
        try {
            const data = localStorage.getItem("savings");
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error loading savings:", e);
            return [];
        }
    }

    const expenses = getStoredExpenses();
    const savings = getStoredSavings();

    // 1. Calculate and display total expenditure
    const totalExpenditure = expenses.reduce(function (sum, item) {
        return sum + (Number(item.amount) || 0);
    }, 0);

    if (totalExpenseElement) {
        totalExpenseElement.textContent = totalExpenditure;
    }

    // 2. Expenditure by Category
    if (categorySummaryList) {
        categorySummaryList.innerHTML = "";

        const categoryTotals = {};
        expenses.forEach(function (item) {
            const cat = item.category || "Others";
            categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(item.amount) || 0);
        });

        const categoryKeys = Object.keys(categoryTotals);
        if (categoryKeys.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No expenditure recorded yet";
            categorySummaryList.appendChild(li);
        } else {
            categoryKeys.forEach(function (cat) {
                const li = document.createElement("li");
                li.textContent = `${cat}: ₹${categoryTotals[cat]}`;
                categorySummaryList.appendChild(li);
            });
        }
    }

    // 3. Expenditure vs Savings Pie Chart
    const totalSavings = savings.reduce(function (sum, item) {
        return sum + (Number(item.amount) || 0);
    }, 0);

    drawPieChart(totalExpenditure, totalSavings);

    function drawPieChart(expenditure, savingsAmount) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = 105;
        const radius = 75;

        const total = expenditure + savingsAmount;

        const expenditureColor = "#c62828"; // Coral / Crimson Red
        const savingsColor = "rgb(6, 9, 96)"; // Navy theme color

        if (total === 0) {
            // Draw empty placeholder circle
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.strokeStyle = "rgb(6, 9, 96)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "rgb(6, 9, 96)";
            ctx.font = "bold 15px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("No Data Available", cx, cy);

            // Draw legend
            drawLegendItem(ctx, 35, 220, expenditureColor, "Expenditure: ₹0 (0%)");
            drawLegendItem(ctx, 35, 255, savingsColor, "Savings: ₹0 (0%)");
            return;
        }

        const expRatio = expenditure / total;
        const savRatio = savingsAmount / total;
        const expAngle = expRatio * 2 * Math.PI;

        let startAngle = -0.5 * Math.PI; // Start at 12 o'clock

        // Draw Expenditure slice
        if (expenditure > 0) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, startAngle + expAngle);
            ctx.closePath();
            ctx.fillStyle = expenditureColor;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw Savings slice
        if (savingsAmount > 0) {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle + expAngle, startAngle + 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = savingsColor;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Percentage labels inside slices if large enough
        if (expRatio >= 0.12) {
            const expMidAngle = startAngle + expAngle / 2;
            const expTextX = cx + Math.cos(expMidAngle) * (radius * 0.6);
            const expTextY = cy + Math.sin(expMidAngle) * (radius * 0.6);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(expRatio * 100)}%`, expTextX, expTextY);
        }

        if (savRatio >= 0.12) {
            const savMidAngle = startAngle + expAngle + ((1 - expRatio) * 2 * Math.PI) / 2;
            const savTextX = cx + Math.cos(savMidAngle) * (radius * 0.6);
            const savTextY = cy + Math.sin(savMidAngle) * (radius * 0.6);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(savRatio * 100)}%`, savTextX, savTextY);
        }

        // Draw legend below chart
        const expPercent = Math.round(expRatio * 100);
        const savPercent = Math.round(savRatio * 100);
        drawLegendItem(ctx, 35, 220, expenditureColor, `Expenditure: ₹${expenditure} (${expPercent}%)`);
        drawLegendItem(ctx, 35, 255, savingsColor, `Savings: ₹${savingsAmount} (${savPercent}%)`);
    }

    function drawLegendItem(ctx, x, y, color, label) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 10, 16, 16);
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 10, 16, 16);

        ctx.fillStyle = "rgb(6, 9, 96)";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + 26, y);
    }
});
