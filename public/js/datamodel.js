////////////////////////////////////////////////////////////////
//DATAMODEL.JS
//THIS IS YOUR "MODEL", IT INTERACTS WITH THE ROUTES ON YOUR
//SERVER TO FETCH AND SEND DATA.  IT DOES NOT INTERACT WITH
//THE VIEW (dashboard.html) OR THE CONTROLLER (dashboard.js)
//DIRECTLY.  IT IS A "MIDDLEMAN" BETWEEN THE SERVER AND THE
//CONTROLLER.  ALL IT DOES IS MANAGE DATA.
////////////////////////////////////////////////////////////////

const DataModel = (function () {
    //WE CAN STORE DATA HERE SO THAT WE DON'T HAVE TO FETCH IT
    //EVERY TIME WE NEED IT.  THIS IS CALLED "CACHING".
    //WE CAN ALSO STORE THINGS HERE TO MANAGE STATE, LIKE
    //WHEN THE USER SELECTS SOMETHING IN THE VIEW AND WE
    //NEED TO KEEP TRACK OF IT SO WE CAN USE THAT INFOMRATION
    //LATER.  RIGHT NOW, WE'RE JUST STORING THE JWT TOKEN
    //AND THE LIST OF USERS.
    let token = null;  // Holds the JWT token
    let users = [];    // Holds the list of user emails

    //WE CAN CREATE FUNCTIONS HERE TO FETCH DATA FROM THE SERVER
    //AND RETURN IT TO THE CONTROLLER.  THE CONTROLLER CAN THEN
    //USE THAT DATA TO UPDATE THE VIEW.  THE CONTROLLER CAN ALSO
    //SEND DATA TO THE SERVER TO BE STORED IN THE DATABASE BY
    //CALLING FUNCTIONS THAT WE DEFINE HERE.
    return {
        //utility function to store the token so that we
        //can use it later to make authenticated requests
        setToken: function (newToken) {
            token = newToken;
        },

        //function to fetch the list of users from the server
        getUsers: async function () {
            // Check if the token is set
            if (!token) {
                console.error("Token is not set.");
                return [];
            }

            try {
                // this is our call to the /api/users route on the server
                const response = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        // we need to send the token in the headers
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error("Error fetching users:", await response.json());
                    return [];
                }

                const data = await response.json();
                //store the emails in the users variable so we can
                //use them again later without having to fetch them
                users = data.emails;
                //return the emails to the controller
                //so that it can update the view
                return users;
            } catch (error) {
                console.error("Error in API call:", error);
                return [];
            }
        },

        // Function to get userId from the server
        getUserId: async function () {
            if (!token) {
                console.error("Token is not set.");
                return null;
            }
            try {
                const response = await fetch('/api/user-id', {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    console.error("Error fetching user ID:", await response.json());
                    return null;
                }
                const data = await response.json();
                return data.userId;
            } catch (error) {
                console.error("Error in API call:", error);
                return null;
            }
        },

        // Function to fetch the user's name from the server
        getUserName: async function () {
            if (!token) {
                console.error("Token is not set.");
                return "";
            }

            try {
                const response = await fetch('/api/user-name', {
                    method: 'GET',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error("Error fetching user name:", await response.json());
                    return "";
                }

                const data = await response.json();
                return data.name;
            } catch (error) {
                console.error("Error in API call:", error);
                return "";
            }
        },

        //ADD MORE FUNCTIONS HERE TO FETCH DATA FROM THE SERVER
        //AND SEND DATA TO THE SERVER AS NEEDED

        // Gets the user profile for the userProfile files
        getUserProfile: async function () {
        if (!token) {
            console.error("Token is not set.");
            return null;
        }
        try {
            const response = await fetch('/api/user-profile', {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error("Error fetching profile:", await response.json());
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error("Error in API call:", error);
            return null;
            }
        },

        // Updates the profile for the userProfile files
        updateUserProfile: async function (height, weight, fitnessGoal, exerciseLevel) {
        if (!token) {
            console.error("Token is not set.");
            return false;
        }
        try {
            const response = await fetch('/api/user-profile', {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ height, weight, fitness_goal: fitnessGoal, exercise_level: exerciseLevel }),
            });
            if (!response.ok) {
                console.error("Error updating profile:", await response.json());
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error in API call:", error);
            return false;
            }
        },
    };
})();