import { login } from "./login.js";
import { authenticate, getSensors, getHistory, setSensorName } from "./agent-api.js";
import { setupFirebaseMessaging } from "./firebase-messaging.js";
import {
    RECEIVED_SENSORS,
    RECEIVED_HISTORY,
    SAVED_SENSOR_NAME
} from "./constants";

export const refreshHistory = (sensor) =>
    (dispatch, getState) =>
        getHistory(sensor.key)
            .then((sensorsHistoryJson) =>
                dispatch({
                    type: RECEIVED_HISTORY,
                    sensor: sensor,
                    history: JSON.parse(sensorsHistoryJson)
                })
            );

const refreshSensors = (dispatch, getState) => {
    const state = getState();

    return getSensors()
        .then((sensorsJson) => {
            dispatch({
                type: RECEIVED_SENSORS,
                loggedIn: true,
                sensors: JSON.parse(sensorsJson)
            });
            const sensorsWithHistory = state.sensors.filter(sensor => sensor.history);
            sensorsWithHistory.forEach(sensor => refreshHistory(sensor)(dispatch, getState));
        }
        );
};

const authenticateToAgent = (dispatch, getState, botId, botKey) => {
    return authenticate(botId, botKey).then(() => refreshSensors(dispatch, getState));
};

const startLogin = () => {
    return (dispatch, getState) => {
        return login()
            .then((user) => {
                return dispatch(async () => {
                    await setupFirebaseMessaging(() => refreshSensors(dispatch, getState));
                    authenticateToAgent(dispatch, getState, user.botId, user.botKey);
                }
                );
            }
            );
    };
};

export const refresh = () => {
    return (dispatch, getState) => {
        const state = getState();

        if (state.loggedIn) {
            return dispatch(refreshSensors());
        }
        else {
            return dispatch(startLogin());
        }
    };
};

export const saveSensorName = (sensor, sensorName) => {
    return (dispatch, getState) => {
        return setSensorName(sensor.key, sensorName)
            .then(() =>
                dispatch({
                    type: SAVED_SENSOR_NAME,
                    sensor: sensor,
                    sensorName: sensorName
                })
            );
    };
};
