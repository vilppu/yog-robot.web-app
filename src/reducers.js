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

const initialState = {
    loggedIn: false,
    authenticatedToAgent: false,
    sensors: []
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGGING_IN:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case LOGGED_IN:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };
        
        case LOGGED_OUT:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case AUTHENTICATING_TO_AGENT:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case AUTHENTICATED_TO_AGENT:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case RECEIVING_SENSORS:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case RECEIVED_SENSORS:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: action.sensors
            };

        case RECEIVING_HISTORY:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        case RECEIVED_HISTORY:
            return {
                loggedIn: state.loggedIn,
                authenticatedToAgent: state.authenticatedToAgent,
                sensors: state.sensors
            };

        default:
            return state;
    }
};
