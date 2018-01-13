"use strict";
(function () {
    var storeToken = function (token) {
        localStorage.setItem("botToken", token);
    };

    var getToken = function () {
        return localStorage.getItem("botToken");
    };

    var authenticate = (botId, botKey) => {
        return new Promise((resolve, reject) => {
            var uri = window.agentAPI + "/api/tokens/device-group";
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
    };

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

    var getOverview = () => {
        var url = window.agentAPI + "/api/sensors";

        return httpGet(url);
    };

    var getHistory = (sensorId, measeuredProperty) => {
        var uri = window.agentAPI + "/api/sensor/" + sensorId + "/history";

        return httpGet(uri);
    };

    var setSensorName = (sensorId, sensorName) => {
        var uri = window.agentAPI + "/api/sensor/" + sensorId + "/name/" + sensorName;

        return httpPost(uri);
    };

    var registerClient = (token) => {
        var uri = window.agentAPI + "/api/push-notifications/subscribe/" + token + "/";

        return httpPost(uri);
    };

    window.agent = {
        getToken: getToken,
        authenticate: authenticate,
        getOverview: getOverview,
        getHistory: getHistory,
        setSensorName: setSensorName,
        registerClient: registerClient
    };
})();
