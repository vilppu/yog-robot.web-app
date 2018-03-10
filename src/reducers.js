import {
    RECEIVED_SENSORS,
    RECEIVED_HISTORY,
    SAVED_SENSOR_NAME
 } from "./constants";
 import {
    formatMeasurement,
    formatTimestamp
} from "./measurements";


const initialState = {
    loggedIn: false,
    sensors: []
};

const isActive = (sensor) => {
    if (sensor.sensorUpdated) {
        var now = new Date();
        var diff = Math.abs(now - sensor.sensorUpdated);
        var hours = Math.floor((diff/1000)/60) / 60;

        return hours <= 24 || true;
    }
    else {
        return true;
    }
};

const alphabeticOrder = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
};

const batteryPercentage = (voltage) => {
    const maxVoltage = 3.25;
    const minVoltage = 2.75;    
    const zeroBasedMax = maxVoltage - minVoltage;
    const zeroBasedValue = Math.max(voltage - minVoltage, 0);
    const fraction = zeroBasedValue/zeroBasedMax;
    const percentage = Math.min(Math.trunc(fraction * 100), 100);

    return percentage;
};

const reduceSensor = (state, updatedSensor) => {
    const sensorState = state.sensors.find(p => p.key === updatedSensor.sensorId);
    const history = sensorState ? sensorState.history : [];
    return {
        key: updatedSensor.sensorId,
        name: updatedSensor.sensorName,
        battery: batteryPercentage(updatedSensor.batteryVoltage) + "%",
        signal: updatedSensor.signalStrength + "dB",
        measurement: formatMeasurement(updatedSensor.measuredProperty, updatedSensor.measuredValue),
        measuredProperty: updatedSensor.measuredProperty,
        sensorUpdated: updatedSensor.lastActive ? new Date(updatedSensor.lastActive) : null,
        history: history || []
    };
};

const reduceSensors = (state, updatedSensors) => {    
    const reducedSensors = updatedSensors.map(sensor => reduceSensor(state, sensor));

    return reducedSensors.filter(isActive).sort(alphabeticOrder);
};

const reduceHistoryEntry = (sensorState, historyEntry) => {
    return {
        key: `${historyEntry.timestamp}:${historyEntry.measuredValue}`,
        measurement: formatMeasurement(sensorState.measuredProperty, historyEntry.measuredValue),
        timestamp: formatTimestamp(new Date(historyEntry.timestamp)),
        measuredProperty: sensorState.measuredProperty
    };
};

const updateSensorHistory = (state, updatedSensor, updatedHistory) => {    
    const reducedSensors = state.sensors.map(sensor => {
        if(sensor.key === updatedSensor.key){
            return {
                ...sensor,
                history: updatedHistory.entries.map(entry => reduceHistoryEntry(sensor, entry))
            };
        }
        else{
            return sensor;
        }
    });

    return reducedSensors;
};

const updateSensorName = (state, updatedSensor, sensorName) => {    
    const reducedSensors = state.sensors.map(sensor => {
        if(sensor.key === updatedSensor.key){
            return {
                ...sensor,
                name: sensorName
            };
        }
        else{
            return sensor;
        }
    });

    return reducedSensors;
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED_SENSORS:
            return {
                ...state,
                sensors: reduceSensors(state, action.sensors)
            };

        case RECEIVED_HISTORY:
            return {
                ...state,
                sensors: updateSensorHistory(state, action.sensor, action.history)
            };

        case SAVED_SENSOR_NAME:
            return {
                ...state,
                sensors: updateSensorName(state, action.sensor, action.sensorName)
            };

        default:
            return state;
    }
};
