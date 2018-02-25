import { agentAPI } from "./config";

var storeToken = function (token) {
    localStorage.setItem("botToken", token);
};

export function getToken() {
    return localStorage.getItem("botToken");
}

export function authenticate(botId, botKey) {
    return new Promise((resolve, reject) => {
        var uri = agentAPI + "/api/tokens/device-group";
        var request = new XMLHttpRequest();

        var onLoaded = e => {
            if (request.readyState === 4) {
                storeToken(JSON.parse(request.responseText));
                resolve();
            }
        };

        var onError = e => {
            reject(request.statusText);
        };

        request.addEventListener("load", onLoaded);
        request.addEventListener("error", onError);
        request.overrideMimeType("application/json");
        request.open("GET", uri, true);
        request.setRequestHeader("yog-robot-device-group-id", botId);
        request.setRequestHeader("yog-robot-device-group-key", botKey);
        request.send(null);
    });
}

var httpSend = (method, url) => {

    return new Promise((resolve, reject) => {

        var request = new XMLHttpRequest();

        var onLoaded = e => {
            if (request.readyState === 4) {
                resolve(request.responseText);
            }
        };

        var onError = e => {
            if (request.readyState === 4) {
                reject(request.statusText);
            }
        };

        var token = getToken();

        if (token === null) {
            return reject("not authenticated");
        }

        request.addEventListener("load", onLoaded);
        request.addEventListener("error", onError);
        request.overrideMimeType("application/json");
        request.open(method, url, true);
        request.setRequestHeader("Authorization", "bearer " + token);
        request.send(null);
    });
};

var httpGet = (url) => {
    return httpSend("GET", url);
};

var httpPost = (url) => {
    return httpSend("POST", url);
};

export function getSensors() {
    var url = agentAPI + "/api/sensors";

    return httpGet(url);
}

export function  getHistory(sensorId, measeuredProperty) {
    var uri = agentAPI + "/api/sensor/" + sensorId + "/history";

    return httpGet(uri);
}

export function setSensorName (sensorId, sensorName) {
    var uri = agentAPI + "/api/sensor/" + sensorId + "/name/" + sensorName;

    return httpPost(uri);
}

export function registerClient (token) {
    var uri = agentAPI + "/api/push-notifications/subscribe/" + token + "/";

    return httpPost(uri);
}
