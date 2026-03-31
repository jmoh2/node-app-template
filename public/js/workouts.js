document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.location.href = '/';
        } else {
            DataModel.setToken(token);
        }

    async function displayWorkoutHeader() {
        try {
            const userName = await DataModel.getUserName();
            document.getElementById('workoutHeader').textContent =
                `${userName}'s Workout Input and History`;
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    }

    displayWorkoutHeader();

    async function displayUserGoal() {
    try {
        const profile = await DataModel.getUserProfile();
        let goalText = profile?.fitness_goal;

        if (!goalText) return;

        goalText = goalText.replace(/_/g, ' ');

        document.getElementById('currentGoal').textContent = goalText;
        document.getElementById('goalCard').style.display = 'inline-flex';

    } catch (error) {
        console.error('Error fetching goal:', error);
    }
}

    displayUserGoal();
    
    const submitButton = document.getElementById('submit');

    // Event listener for workout submission sending data to the backend
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        
        const workoutName = document.getElementById('workoutName').value;
        const workoutType = document.getElementById('workoutType').value;
        const workoutIntensity = document.getElementById('workoutIntensity').value;
        const duration = document.getElementById('duration').value;
        const notes = document.getElementById('notes').value;
        const date = document.getElementById('date').value;
        const caloriesBurned = document.getElementById('caloriesBurned').value;
        
        if (!workoutName || !workoutType || !workoutIntensity || !duration || !date || !caloriesBurned) {
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
                    caloriesBurned,
                    duration,
                    notes,
                    date
                })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Request failed:', result.message || 'Failed to submit workout');
            }

            await renderWorkouts();
            applyFilters();

            console.log('Workout saved:', result);
        } catch (error) {
            console.error('Error submitting workout:', error);
        }

    });
   
// Load and display suggested workout
async function loadSuggestedWorkout() {
    const suggestion = await DataModel.getSuggestedWorkout();
    const content = document.getElementById('suggestionContent');
    const logButton = document.getElementById('logSuggestionButton');
    const suggestionResult = document.getElementById('suggestionResult');

    if (!suggestion) {
        content.textContent = 'No suggestion available.';
        logButton.style.display = 'none';
        return;
    }

    content.innerHTML = `
        <b>${suggestion.workout_name}</b><br>
        Type: ${suggestion.workout_type}<br>
        Intensity: ${suggestion.intensity_level}<br>
        Duration: ${suggestion.duration_minutes} mins<br>
        Calories: ${suggestion.calories_burned}
    `;

    logButton.addEventListener('click', async () => {
        const success = await DataModel.logSuggestedWorkout(suggestion);
        if (success) {
            suggestionResult.textContent = 'Logged!';
            await renderWorkouts();
            applyFilters();
        } else {
            suggestionResult.textContent = 'Error logging workout.';
            suggestionResult.style.color = 'red';
        }
    });
}

loadSuggestedWorkout();
});

async function renderWorkouts() {
    const token = localStorage.getItem("jwtToken");
    const tbody = document.querySelector("#workoutTable tbody");

    tbody.innerHTML = "";

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
                <td>${new Date(workout.workout_date).toLocaleDateString("en-US")}</td>
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

// Function to apply filters to the workout table
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

    });
} 

// Function to clear all filters and show all workouts
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

    document.getElementById("clearFiltersButton").addEventListener("click", () => {
        clearFilters();
    });

    document.getElementById("applyFiltersButton").addEventListener("click", () => {
        applyFilters();
    });
 
});