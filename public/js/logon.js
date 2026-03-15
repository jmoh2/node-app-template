// Tab switching
const loginTab = document.getElementById('login-tab');
const createAccountTab = document.getElementById('create-account-tab');
const logonForm = document.getElementById('logon-form');
const createAccountForm = document.getElementById('create-account-form');
const messageEl = document.getElementById('message');

loginTab.addEventListener('click', () => {
    logonForm.classList.add('active-form');
    createAccountForm.classList.remove('active-form');
    loginTab.classList.add('active');
    createAccountTab.classList.remove('active');

    messageEl.textContent = '';
    messageEl.classList.remove('success', 'error');
});

createAccountTab.addEventListener('click', () => {
    createAccountForm.classList.add('active-form');
    logonForm.classList.remove('active-form');
    createAccountTab.classList.add('active');
    loginTab.classList.remove('active');

    messageEl.textContent = '';
    messageEl.classList.remove('success', 'error');
});

// Logon form submission
logonForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('jwtToken', result.token);
            window.location.href = '/basepage';
        } else {
            messageEl.textContent = result.message;
            messageEl.classList.add('error');
        }
    } catch (error) {
        console.error('Error:', error);
        messageEl.textContent = 'An error occurred. Please try again later.';
        messageEl.classList.add('error');
    }
});

// Create account form submission
createAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('create-email').value;
    const password = document.getElementById('create-password').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const age = document.getElementById('age').value;
    const fitness_goal = document.getElementById('fitness-goal').value;
    const exercise_level = document.getElementById('exercise-level').value;

    try {
        const response = await fetch('/api/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                gender,
                height,
                weight,
                age,
                fitness_goal,
                exercise_level
            }),
        });

        const result = await response.json();

        if (response.ok) {

            createAccountForm.reset();

            logonForm.classList.add('active-form');
            createAccountForm.classList.remove('active-form');
            loginTab.classList.add('active');
            createAccountTab.classList.remove('active');

            document.getElementById('login-email').value = email;
            document.getElementById('login-password').value = password;

            messageEl.textContent = 'Account created successfully! You can now log in.';
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
        }
     else {
        messageEl.textContent = result.message;
        messageEl.classList.remove('success');
        messageEl.classList.add('error');
    }
} catch (error) {
    console.error('Error:', error);
    messageEl.textContent = 'An error occurred. Please try again later.';
    messageEl.classList.remove('success');
    messageEl.classList.add('error');
}
});