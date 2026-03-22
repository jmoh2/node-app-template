document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("jwtToken");
    const tbody = document.querySelector("#workoutTable tbody");


    try {
        const response = await fetch("/api/workouts", {
            headers: {
                "Authorization": token
            }
        });

        const data = await response.json();
        const workouts = data.workouts;

        if (!response.ok) {
            console.error("Failed to fetch workouts:", data.message);
            return;
        }

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
});