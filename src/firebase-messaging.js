import { registerClient } from "./agent-api";
import { firebaseConfig } from "./config";
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const setupFirebaseMessaging = async (refreshSensors) => {
    const app = initializeApp(firebaseConfig);

    const messaging = getMessaging(app);
    await Notification.requestPermission();
    const token = await getToken(messaging, { vapidKey: "BJh6qgRwaxOW3Vt-1QmgyFNKUedagBDGaoFFtMMINXQo7bxyUGHcOD0O-6o4qqmuG3mJK-UVdEOQlIqvWYhzskA" });

    registerClient(token);

    onMessage(messaging, function (payload) {
        refreshSensors();
    });

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    }
};
