import { registerClient } from "./agent-api";

export const setupFirebaseMessaging = (refreshSensors) => {
    const messaging = window.firebase.messaging();

    var proceed = () => {
        messaging.getToken()
            .then(currentToken => {
                if (currentToken) {
                    registerClient(currentToken);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            })
            .catch(error => {
                console.log('An error occurred while retrieving token. ', error);
            });
    };

    messaging.onMessage(function (payload) {
        refreshSensors();
    });

    messaging.onTokenRefresh(() => {
        messaging.getToken()
            .then(refreshedToken => {
                window.setTokenSentToServer(false);
                window.sendTokenToServer(refreshedToken);
            })
            .catch(error => {
                console.log('Unable to retrieve refreshed token ', error);        
                window.showToken('Unable to retrieve refreshed token ', error);        
            });
    });

    messaging.requestPermission()
        .then(() => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
                    messaging.useServiceWorker(registration);
                }, function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
            }

            proceed();
        })
        .catch(error => {
            console.log('Unable to get permission to notify.', error);
        });
};
