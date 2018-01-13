"use strict";
(function () {

    var showDetails = (element, overviewEntry) => {
        agent.getHistory(overviewEntry.sensorId, overviewEntry.measuredProperty).then(historyJson => {
            var history = JSON.parse(historyJson);
            var historyEntryTemplate = document.querySelector("#history-entry-template");
            var sensorDetails = element.querySelector(".sensor-details");
            var historyElement = element.querySelector(".history");  

            historyElement.innerHTML = "";

            for (var entry of history.entries) {
                var cloned = document.importNode(historyEntryTemplate.content, true);
                var historyEntry = cloned.querySelector(".history-entry");
                var measurement = historyEntry.querySelector(".measurement");
                var timestamp = historyEntry.querySelector(".timestamp");

                measurement.innerText = formatMeasurement(overviewEntry.measuredProperty, entry.measuredValue);
                measurement.classList.add(overviewEntry.measuredProperty);
                timestamp.innerText = formatTimestamp(new Date(entry.timestamp));

                historyElement.appendChild(historyEntry);
            }
        });
    };

    var toggle = (block, displayType, onDisplay) => {
        if (block.style.display !== "none") {
            block.style.display = "none";
        }
        else {
            block.style.display = displayType;
            onDisplay();
        }
    };

    var detailsClicked = (element, sensor) => () => {
        var sensorDetails = element.querySelector(".sensor-details");
        toggle(sensorDetails, "block", () => showDetails(element, sensor));
    };

    var toggleEditor = (element) => {
        var nameEditor = element.querySelector(".name-editor");

        toggle(nameEditor, "inline-block", () => {});        

        return false;
    };

    var editClicked = (element, sensor) => () => {
        var editedName = element.querySelector(".edited-name");
        editedName.value = sensor.sensorName;

        return toggleEditor(element);
    };

    var editConfirmed = (element, sensor) => () => {
        var editedName = element.querySelector(".edited-name");

        window.agent.setSensorName(sensor.sensorId, editedName.value).then(() =>{
            location.reload();
        });

        return;
    };

    var editCanceled = (element, sensor) => () => {
        return toggleEditor(element);
    };

    var isInActive = (sensor) => {
        if (!sensor.lastActive) {
            return false;
        }

        var now = new Date();
        var sensorUpdated = new Date(sensor.lastActive);
        var diff = Math.abs(now - sensorUpdated);
        var hours = Math.floor((diff/1000)/60) / 60;

        return hours > 24;
    };

    var setupOverview = sensorsJson => {

        var devices = document.querySelector("#devices");
        var deviceTemplate = document.querySelector("#sensor-template");
        var sensors = JSON.parse(sensorsJson);

        var alphabeticOrder = (a, b) => {
            if (a.sensorName < b.sensorName) return -1;
            if (a.sensorName > b.sensorName) return 1;
            return 0;
        };

        for (var sensor of sensors.sort(alphabeticOrder)) {
            if (sensor.measuredProperty === "BatteryVoltage") {
                continue;
            }

            if (sensor.measuredProperty === "Rssi") {
                continue;
            }

            if (isInActive(sensor)) {
                continue;
            }

            var cloned = document.importNode(deviceTemplate.content, true);

            var sensorElement = cloned.querySelector(".sensor");
            sensorElement.querySelector(".sensor-name").innerText = sensor.sensorName;
            sensorElement.querySelector(".edit-name").setAttribute("data-name", sensor.sensorName);
            sensorElement.querySelector(".edit-name").addEventListener("click", editClicked(sensorElement, sensor));
            sensorElement.querySelector(".confirm-edit-name").addEventListener("click", editConfirmed(sensorElement, sensor));
            sensorElement.querySelector(".cancel-edit-name").addEventListener("click", editCanceled(sensorElement, sensor));
            sensorElement.querySelector(".battery").innerText = sensor.batteryVoltage + "V";
            sensorElement.querySelector(".rssi").innerText = "-" + sensor.signalStrength + "dB";


            var measurement = sensorElement.querySelector(".measurement");
            measurement.innerText = formatMeasurement(sensor.measuredProperty, sensor.measuredValue);
            measurement.classList.add(sensor.measuredProperty);

            var sensorStatus = sensorElement.querySelector(".sensor-status");
            sensorStatus.addEventListener("click", detailsClicked(sensorElement, sensor));

            devices.appendChild(cloned);
        }
    };

    document.addEventListener('authenticated', e => {
        agent.authenticate(e.detail.user.botId, e.detail.user.botKey)
            .then(() => {
                if (agent.getToken() !== null) {
                    agent.getOverview().then(setupOverview);
                }
            });
    }, false);
})();
