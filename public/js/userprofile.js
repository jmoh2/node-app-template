document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '/';
        return;
    }

    DataModel.setToken(token);

    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const fitnessGoalSelect = document.getElementById('fitness_goal');
    const exerciseLevelSelect = document.getElementById('exercise_level');
    const result = document.getElementById('result');

    // Load and display saved values
    const profile = await DataModel.getUserProfile();
    if (profile) {
        heightInput.value = profile.height;
        weightInput.value = profile.weight;
        fitnessGoalSelect.value = profile.fitness_goal;
        exerciseLevelSelect.value = profile.exercise_level;
    }

    // The function that saves everything
    window.save = async function () {
        const height = heightInput.value;
        const weight = weightInput.value;
        const fitnessGoal = fitnessGoalSelect.value;
        const exerciseLevel = exerciseLevelSelect.value;

        if (!height || !weight) {
            result.textContent = 'Please enter both height and weight.';
            return;
        }

        const success = await DataModel.updateUserProfile(height, weight, fitnessGoal, exerciseLevel);
        result.textContent = success ? 'Saved successfully!' : 'Error saving profile.';
    };
  // the thing that removes the loading for the drop down 
    const fitnessSelect = document.getElementById("fitness_goal");
    fitnessSelect.addEventListener("focus", function () {
        const firstOption = fitnessSelect.querySelector('option[value=""]');
        if (firstOption) firstOption.remove();
    });
    const exerciseSelect = document.getElementById("exercise_level");
    exerciseSelect.addEventListener("focus", function () {
        const firstOption = exerciseSelect.querySelector('option[value=""]');
        if (firstOption) firstOption.remove();
    });
});



function save() {
    document.getElementById("result").textContent = "Saved!";
}