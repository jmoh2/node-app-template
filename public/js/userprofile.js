document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '/';
        return;
    }

    DataModel.setToken(token);

    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const result = document.getElementById('result');

    // Load and display saved values
    const profile = await DataModel.getUserProfile();
    if (profile) {
        heightInput.value = profile.height;
        weightInput.value = profile.weight;
    }

    // Attach save to the global save() function called by the button
    window.save = async function () {
        const height = heightInput.value;
        const weight = weightInput.value;

        if (!height || !weight) {
            result.textContent = 'Please enter both height and weight.';
            return;
        }

        const success = await DataModel.updateUserProfile(height, weight);
        result.textContent = success ? 'Saved successfully!' : 'Error saving profile.';
    };
});