var storeToken = function (token) {
    localStorage.setItem("idToken", token);
};

var getToken = function () {
    return localStorage.getItem("idToken");
};

var logout = () => {
    localStorage.clear();

    var uri = "https://vilppu.eu.auth0.com/v2/logout?returnTo=https%3A%2F%2Fapp.yog-robot.com%2F";
    window.location.replace(uri);

    return Promise.resolve();
};

var ensureLoggedIn = () => {
    return new Promise((resolve, reject) => {
        var urlParams = new URLSearchParams(window.location.href);
        var authenticating = urlParams.get('id_token') !== null;

        var options = {
            allowedConnections: [],
            theme: {
                logo: "/Images/login/login.png",
                primaryColor: "green"
            },
            closable: false,
            languageDictionary: {
                title: "🐱"
            }
        };

        var lock = new window.Auth0Lock("kk29AdEUvES0h2yJb0B3XthZ5sCmQ0XQ", "vilppu.eu.auth0.com", options);

        var authenticated = () => {
            lock.getProfile(getToken(), (error, profile) => {
                if (error) {
                    return lock.show();
                    // return reject(error);
                }

                if (!profile.app_metadata || !profile.app_metadata["botId"] || !profile.app_metadata["botKey"]) {
                    alert("No rights. Please ask...");
                    return resolve();
                }

                return resolve({
                    botId: profile.app_metadata["botId"],
                    botKey: profile.app_metadata["botKey"]
                });
            });
        };

        lock.on("authenticated", authResult => {
            storeToken(authResult.idToken);
            authenticated();
        });

        if (authenticating) {
            // authenticated event will be sent
        }
        else if (getToken() === null) {
            lock.show();
        }
        else {
            authenticated();
        }
    });
};

export const login = (login) => {
    var logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", logout);

    return ensureLoggedIn();
};
