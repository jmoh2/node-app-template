// render meals function

async function renderMeals() {
    const token = localStorage.getItem("jwtToken");
    const tbody = document.querySelector("#mealTable tbody");

    tbody.innerHTML = "";

    try {
        const response = await fetch("/api/meals", {
            headers: {
                "Authorization": token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to fetch meals:", data.message);
            return;
        }

        const meals = data.meals;

        meals.forEach(meal => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(meal.meal_date).toLocaleDateString("en-US")}</td>
                <td>${meal.meal_type}</td>
                <td>${meal.description}</td>
                <td>${meal.calories}</td>
                <td>${meal.protein}</td>
                <td>${meal.fats}</td>
                <td>${meal.carbs}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching meals:", error);
    }
}

// Function to apply filters to the meal table

function applyFilters() {

    const tbody = document.querySelector("#mealTable tbody");

    const typeFilter = document.getElementById("typeFilter").value.toLowerCase();
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const descriptionFilter = document.getElementById("descriptionFilter").value.toLowerCase();
    const proteinMin = parseInt(document.getElementById("proteinMin").value) || 0;
    const proteinMax = parseInt(document.getElementById("proteinMax").value) || Infinity;
    const caloriesMin = parseInt(document.getElementById("caloriesMin").value) || 0;
    const caloriesMax = parseInt(document.getElementById("caloriesMax").value) || Infinity;
    const fatsMin = parseInt(document.getElementById("fatsMin").value) || 0;
    const fatsMax = parseInt(document.getElementById("fatsMax").value) || Infinity;
    const carbsMin = parseInt(document.getElementById("carbsMin").value) || 0;
    const carbsMax = parseInt(document.getElementById("carbsMax").value) || Infinity;

    Array.from(tbody.rows).forEach(row => {
        const mealDate = row.cells[0].textContent;
        const mealType = row.cells[1].textContent.toLowerCase();
        const mealDescription = row.cells[2].textContent.toLowerCase();
        const calories = parseInt(row.cells[3].textContent) || 0;
        const protein = parseInt(row.cells[4].textContent) || 0;
        const fats = parseInt(row.cells[5].textContent) || 0;
        const carbs = parseInt(row.cells[6].textContent) || 0;

        let showRow = true;

        if (typeFilter && mealType !== typeFilter) showRow = false;
        if (dateFrom && mealDate < dateFrom) showRow = false;
        if (dateTo && mealDate > dateTo) showRow = false;
        if (descriptionFilter && !mealDescription.includes(descriptionFilter)) showRow = false;
        if (protein < proteinMin || protein > proteinMax) showRow = false;
        if (calories < caloriesMin || calories > caloriesMax) showRow = false;
        if (fats < fatsMin || fats > fatsMax) showRow = false;
        if (carbs < carbsMin || carbs > carbsMax) showRow = false;

        row.style.display = showRow ? "" : "none";

    });
} 

// Function to clear all filters and show all meals
function clearFilters() {
    document.getElementById("typeFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";
    document.getElementById("descriptionFilter").value = "";
    document.getElementById("proteinMin").value = "";
    document.getElementById("proteinMax").value = "";
    document.getElementById("caloriesMin").value = "";
    document.getElementById("caloriesMax").value = "";
    document.getElementById("fatsMin").value = "";
    document.getElementById("fatsMax").value = "";
    document.getElementById("carbsMin").value = "";
    document.getElementById("carbsMax").value = "";

    applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
    renderMeals();
    
    document.getElementById("refreshButton").addEventListener("click", () => {
        renderMeals();
    });

    document.getElementById("clearFiltersButton").addEventListener("click", () => {
        clearFilters();
    });

    document.getElementById("applyFiltersButton").addEventListener("click", () => {
        applyFilters();
    });
});