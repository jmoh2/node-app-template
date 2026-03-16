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
    const result = document.getElementById('result');

    // Load and display saved values
    const profile = await DataModel.getUserProfile();
    if (profile) {
        heightInput.value = profile.height;
        weightInput.value = profile.weight;
        fitnessGoalSelect.value = profile.fitness_goal;
    }

    // The function that saves everything
    window.save = async function () {
        const height = heightInput.value;
        const weight = weightInput.value;
        const fitnessGoal = fitnessGoalSelect.value;

        if (!height || !weight) {
            result.textContent = 'Please enter both height and weight.';
            return;
        }

        const success = await DataModel.updateUserProfile(height, weight, fitnessGoal);
        result.textContent = success ? 'Saved successfully!' : 'Error saving profile.';
    };
  // the thing that removes the loading for the drop down 
  const select = document.getElementById("fitness_goal");

  select.addEventListener("focus", function () {
      const firstOption = select.querySelector('option[value=""]');
      if (firstOption) firstOption.remove();
});
});