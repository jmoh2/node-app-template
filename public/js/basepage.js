document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.location.href = '/';
        } else {
            DataModel.setToken(token);
            displayWelcomeMessage();
        }
    
    //////////////////////////////////////////
    //ELEMENTS TO ATTACH EVENT LISTENERS
    //////////////////////////////////////////
    const logoutButton = document.getElementById('logoutButton');
    const welcomeHeading = document.getElementById('welcomeHeading');

    //////////////////////////////////////////
    //END ELEMENTS TO ATTACH EVENT LISTENERS
    //////////////////////////////////////////


    //////////////////////////////////////////
    //EVENT LISTENERS
    //////////////////////////////////////////
    // Log out and redirect to login
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });

    async function displayWelcomeMessage() {

        const userName = await DataModel.getUserName();
        welcomeHeading.textContent = `Welcome to GymRat, ${userName}!`;
    }
    // Fetch the user's name and display a welcome message based on username and span id welcomeMessage
    

    //////////////////////////////////////////
    //END EVENT LISTENERS
    //////////////////////////////////////////
});