import { formatMeasurement } from "./measurements";
import { registerClient } from "./agent-api";

var registerServiceWorker = () => {
    const messaging = window.firebase.messaging();

    var showToast = (title, body) => {

        var toast = document.getElementById("toast");
        var toastTitle = document.getElementById("toastTitle");
        var toastBody = document.getElementById("toastBody");

        toastTitle.innerText = title;
        toastBody.innerText = body;

        toast.className = "show";
        setTimeout(
            () => {
                toast.className = toast.className.replace("show", ""); 
            },
            5000);
    };

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
        var notification = JSON.parse(payload.data.deviceNotification);
        var title = notification.sensorName;
        var body = formatMeasurement(notification.measuredProperty, notification.measuredValue);

        showToast(title, body);
    });

    messaging.onTokenRefresh(() => {
        messaging.getToken()
            .then(refreshedToken => {
                console.log('Token refreshed.');
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
            console.log('Notification permission granted.');
            proceed();
        })
        .catch(error => {
            console.log('Unable to get permission to notify.', error);
        });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
            messaging.useServiceWorker(registration);
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            // registerMessaging();
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
};

export function setupServiceWorker() {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}
