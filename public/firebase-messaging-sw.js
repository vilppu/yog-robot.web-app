importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');


formatNumber = number => {
    return parseFloat(number).toString().replace(".", ",");
};

formatMeasurement = (measuredProperty, measuredValue) => {
    switch (measuredProperty) {
        case "Temperature":
            return formatNumber(measuredValue);

        case "RelativeHumidity":
            return formatNumber(measuredValue);

        case "Motion":
            return measuredValue ? "Liikettä" : "Ei liikettä";

        case "OpenClosed":
            return measuredValue ? "Auki" : "Kiinni";

        case "Contact":
            return measuredValue ? "Auki" : "Kiinni";

        case "PresenceOfWater":
            return measuredValue ? "Vettä" : "Ei vettä";

        case "BatteryVoltage":
            return formatNumber(measuredValue);

        case "Rssi":
            return formatNumber(measuredValue);
        default:
            return measuredValue;
    }
};

var formatTimestamp = timestamp => {
    var date = timestamp.getDate() + "." + (timestamp.getMonth() + 1) + ".";
    var minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
    var time = "klo " + timestamp.getHours() + ":" + minutes;

    return date + " " + time;
};

firebase.initializeApp({
    apiKey: "AIzaSyBpmkFfL8OqhotFd3Xeg7vQXuFLmKcOwZE",
    authDomain: "yogbot-2d3a4.firebaseapp.com",
    databaseURL: "https://yogbot-2d3a4.firebaseio.com",
    projectId: "yogbot-2d3a4",
    storageBucket: "yogbot-2d3a4.appspot.com",
    messagingSenderId: "900133155210",
    appId: "1:900133155210:web:8b8add16d6ae311af4d873",
    measurementId: "G-30857E7654"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    var notification = JSON.parse(payload.data.deviceNotification);
    var measurement = formatMeasurement(notification.measuredProperty, notification.measuredValue);
    var notificationTag = notification.deviceId;
    var notificationFilter = {
        tag: notificationTag
    };
    var messageBody = measurement + " " + formatTimestamp(new Date(notification.timestamp));

    return self.registration.getNotifications(notificationFilter)
        .then(function (notifications) {

            for (var i = 0; i < notifications.length; i++) {
                notifications[i].close();
            }

            const notificationOptions = {
                body: messageBody,
                icon: "/images/touch/homescreen72.png",
                tag: notificationTag
            };

            return self.registration.showNotification(notification.sensorName, notificationOptions);
        });
});
