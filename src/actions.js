import { login } from "./login.js";
import { authenticate, getSensors, getHistory } from "./agent-api.js";
import { setupServiceWorker } from "./firebase-messaging.js";
import { firebaseConfig } from "./config";
import {
    RECEIVED_SENSORS,
    RECEIVED_HISTORY
} from "./constants";

const refreshSensors = (dispatch) => {
    return getSensors()
        .then((sensorsJson) => {
            dispatch({
                type: RECEIVED_SENSORS,
                loggedIn: true,
                sensors: JSON.parse(sensorsJson)
            });
            }
        );
};

const authenticateToAgent = (dispatch, botId, botKey) => {
    return authenticate(botId, botKey)
        .then(() => {
            return refreshSensors(dispatch);
        }
        );
};

const startLogin = () => {
    return dispatch => {
        return login()
            .then((user) => {      
                window.firebase.initializeApp(firebaseConfig);
                setupServiceWorker();
                return dispatch(() => authenticateToAgent(dispatch, user.botId, user.botKey));
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

export const refreshHistory = (sensor) => {
    return (dispatch, getState) => {
        const state = getState();

        return getHistory(sensor.sensorId, sensor.measuredProperty)
            .then((sensorsHistoryJson) => {
                dispatch({
                    type: RECEIVED_HISTORY,
                    sensor: sensor,
                    history: JSON.parse(sensorsHistoryJson)
                });
                }
            );
    };
};