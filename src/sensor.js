import { formatMeasurement, formatTimestamp } from "./measurements";

export const alphabeticOrder = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
};

export const isActive = (sensor) => {
    if (!sensor.lastActive) {
        return true;
    }

    var now = new Date();
    var sensorUpdated = new Date(sensor.lastActive);
    var diff = Math.abs(now - sensorUpdated);
    var hours = Math.floor((diff/1000)/60) / 60;

    return hours <= 24;
};

export const mapToSensorView = (sensor) => {
    return {
        key: sensor.sensorId + "." + sensor.measuredProperty,
        sensorId: sensor.sensorId,
        name: sensor.sensorName,
        battery: sensor.batteryVoltage + "V",
        signal: sensor.signalStrength + "dB",
        measurement: formatMeasurement(sensor.measuredProperty, sensor.measuredValue),
        measuredProperty: sensor.measuredProperty,
        lastActive: sensor.lastActive,
        history: []
    };
};

const mapToHistoryEntryView = (sensor, entry) => {    
    const timestamp = formatTimestamp(new Date(entry.timestamp));

    return {
        key: timestamp,
        measurement: formatMeasurement(sensor.measuredProperty, entry.measuredValue),
        timestamp: timestamp,
        measuredProperty: sensor.measuredProperty
    };
};

export const mapSensorViewWithHistory = (sensor, history) => {
    return {
        key: sensor.key,
        name: sensor.name,
        battery: sensor.battery,
        signal: sensor.signal,
        measurement: sensor.measurement,
        measuredProperty: sensor.measuredProperty,
        history: history.entries.map(entry => mapToHistoryEntryView(sensor, entry))
    };
};
