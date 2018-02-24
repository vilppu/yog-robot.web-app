import { login } from "./login.js";
import { authenticate, getOverview } from "./agent-api.js";
import { setupServiceWorker } from "./firebase-messaging.js";
import { firebaseConfig } from "./config";
import {
    LOGGING_IN,
    LOGGED_IN,
    LOGGED_OUT,
    AUTHENTICATING_TO_AGENT,
    AUTHENTICATED_TO_AGENT,
    RECEIVING_SENSORS,
    RECEIVED_SENSORS,
    RECEIVING_HISTORY,
    RECEIVED_HISTORY
} from "./constants";

const getSensors = (dispatch) => {
    dispatch({
        type: RECEIVING_SENSORS,
        loggedIn: true,
        authenticatedToAgent: true,
        sensors: []
    });

    return getOverview()
        .then((sensorsJson) => {
            dispatch({
                type: RECEIVED_SENSORS,
                loggedIn: true,
                authenticatedToAgent: true,
                sensors: JSON.parse(sensorsJson)
            });
            }
        );
};

const authenticateToAgent = (dispatch, botId, botKey) => {
    dispatch({
        type: AUTHENTICATING_TO_AGENT,
        loggedIn: true,
        authenticatedToAgent: false,
        sensors: []
    });

    return authenticate(botId, botKey)
        .then(() => {
            dispatch({
                type: AUTHENTICATED_TO_AGENT,
                loggedIn: true,
                authenticatedToAgent: true,
                sensors: []
            });

            return getSensors(dispatch);
        }
        );
};

const startLogin = () => {
    return dispatch => {
        dispatch({
            type: LOGGING_IN,
            loggedIn: false,
            authenticatedToAgent: false,
            sensors: []
        });

        return login()
            .then((user) => {
                dispatch({
                    type: LOGGED_IN,
                    loggedIn: false,
                    authenticatedToAgent: false,
                    sensors: []
                });                
                window.firebase.initializeApp(firebaseConfig);
                setupServiceWorker();
                return dispatch(() => authenticateToAgent(dispatch, user.botId, user.botKey));
            }
            );
    };
};

const receiveSensors = (json) => {
    return dispatch => {
        return {
            type: RECEIVING_SENSORS,
            sensors: json.data()
        };
    };
};

export const refresh = () => {
    return (dispatch, getState) => {
        const state = getState();

        if (state.loggedIn) {
            return dispatch(getSensors());
        }
        else {
            return dispatch(startLogin());
        }
    };
};
