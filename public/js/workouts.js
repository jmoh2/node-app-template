document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.location.href = '/';
        } else {
            DataModel.setToken(token);
        }


    const submitButton = document.getElementById('submit');

    // Event listener for workout submission sending data to the backend
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const workoutName = document.getElementById('workoutName').value;
        const workoutType = document.getElementById('workoutType').value;
        const workoutIntensity = document.getElementById('workoutIntensity').value;
        const duration = document.getElementById('duration').value;
        const notes = document.getElementById('notes').value;
        
        if (!workoutName || !workoutType || !workoutIntensity || !duration) {
            console.error('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    workoutName,
                    workoutType,
                    workoutIntensity,
                    duration,
                    notes
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Request failed:', result.message || 'Failed to submit workout');
            }

            console.log('Workout saved:', result);
        } catch (error) {
            console.error('Error submitting workout:', error);
        }
        
    })
async function renderWorkouts() {
    const token = localStorage.getItem("jwtToken");
    const tbody = document.querySelector("#workoutTable tbody");

    try {
        const response = await fetch("/api/workouts", {
            headers: {
                "Authorization": token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to fetch workouts:", data.message);
            return;
        }

        const workouts = data.workouts;

        workouts.forEach(workout => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${workout.workout_date}</td>
                <td>${workout.workout_name}</td>
                <td>${workout.workout_type}</td>
                <td>${workout.intensity_level}</td>
                <td>${workout.duration_minutes}</td>
                <td>${workout.calories_burned}</td>
                <td>${workout.notes}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching workouts:", error);
    }
}

function applyFilters() {

    const tbody = document.querySelector("#workoutTable tbody");

    const typeFilter = document.getElementById("typeFilter").value.toLowerCase();
    const intensityFilter = document.getElementById("intensityFilter").value.toLowerCase();
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const nameFilter = document.getElementById("nameFilter").value.toLowerCase();
    const durationMin = parseInt(document.getElementById("durationMin").value) || 0;
    const durationMax = parseInt(document.getElementById("durationMax").value) || Infinity;
    const caloriesMin = parseInt(document.getElementById("caloriesMin").value) || 0;
    const caloriesMax = parseInt(document.getElementById("caloriesMax").value) || Infinity;

    Array.from(tbody.rows).forEach(row => {
        const workoutDate = row.cells[0].textContent;
        const workoutName = row.cells[1].textContent.toLowerCase();
        const workoutType = row.cells[2].textContent.toLowerCase();
        const intensityLevel = row.cells[3].textContent.toLowerCase();
        const duration = parseInt(row.cells[4].textContent) || 0;
        const calories = parseInt(row.cells[5].textContent) || 0;

        let showRow = true;

        if (typeFilter && workoutType !== typeFilter) showRow = false;
        if (intensityFilter && intensityLevel !== intensityFilter) showRow = false;
        if (dateFrom && workoutDate < dateFrom) showRow = false;
        if (dateTo && workoutDate > dateTo) showRow = false;
        if (nameFilter && !workoutName.includes(nameFilter)) showRow = false;
        if (duration < durationMin || duration > durationMax) showRow = false;
        if (calories < caloriesMin || calories > caloriesMax) showRow = false;

        row.style.display = showRow ? "" : "none";

        applyFilters();
    });
} 


function clearFilters() {
    document.getElementById("nameFilter").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";
    document.getElementById("durationMin").value = "";
    document.getElementById("durationMax").value = "";
    document.getElementById("caloriesMin").value = "";
    document.getElementById("caloriesMax").value = "";
    document.getElementById("typeFilter").value = "";
    document.getElementById("intensityFilter").value = "";

    applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
    renderWorkouts();
    
    document.getElementById("refreshButton").addEventListener("click", () => {
        renderWorkouts();
    });

    document.getElementById("typeFilter").addEventListener("change", applyFilters);
    document.getElementById("intensityFilter").addEventListener("change", applyFilters);
    document.getElementById("dateFrom").addEventListener("change", applyFilters);
    document.getElementById("dateTo").addEventListener("change", applyFilters);
    document.getElementById("nameFilter").addEventListener("input", applyFilters);
    document.getElementById("durationMin").addEventListener("input", applyFilters);
    document.getElementById("durationMax").addEventListener("input", applyFilters);
    document.getElementById("caloriesMin").addEventListener("input", applyFilters);
    document.getElementById("caloriesMax").addEventListener("input", applyFilters);
    document.getElementById("clearFiltersButton").addEventListener("click", clearFilters);

    
});