"use strict";
(() => {

    var clearToken = function (token) {
        localStorage.removeItem("idToken");
    };

    var storeToken = function (token) {
        localStorage.setItem("idToken", token);
    };

    var getToken = function () {
        return localStorage.getItem("idToken");
    };

    var logout = () => {
        localStorage.clear();

        window.location.replace(window.authenticationURL);

        return Promise.resolve();
    };

    var ensureLoggedIn = () => {
        return new Promise((resolve, reject) => {
            var urlParams = new URLSearchParams(window.location.href);
            var authenticating = urlParams.get('id_token') !== null;

            var options = {
                allowedConnections: [],
                theme: {
                    logo: "/images/login/login.png",
                    primaryColor: "green"
                },
                closable: false,
                languageDictionary: {
                    title: "🐱"
                }
            };

            var lock = new Auth0Lock(window.authenticationClientID, window.authenticationDomain, options);

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

            if(authenticating) {
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

    window.addEventListener('load', () => {
        var logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", logout);

        ensureLoggedIn().then(user => {
            var authenticated = new CustomEvent("authenticated", { "detail": { "user": user }});
            document.dispatchEvent(authenticated);
        });
    });
})();
