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
});