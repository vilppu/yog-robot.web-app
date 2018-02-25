import { formatMeasurement, formatTimestamp } from "./measurements";

const isInActive = (sensor) => {
    if (!sensor.lastActive) {
        return false;
    }

    var now = new Date();
    var sensorUpdated = new Date(sensor.lastActive);
    var diff = Math.abs(now - sensorUpdated);
    var hours = Math.floor((diff/1000)/60) / 60;

    return hours > 24;
};

export function mapToSensorView(sensor) {
    return {
        name: sensor.sensorName,
        battery: sensor.batteryVoltage + "V",
        signal: sensor.signalStrength + "dB",
        measurement: formatMeasurement(sensor.measuredProperty, sensor.measuredValue),
        measuredProperty: sensor.measuredProperty,
        isInActive: isInActive(sensor)
    };
}
