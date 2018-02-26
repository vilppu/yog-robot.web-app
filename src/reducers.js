import {
    mapSensorViewWithHistory,
    mapToSensorView,
    isActive,
    alphabeticOrder } from "./sensor";
import {
    RECEIVED_SENSORS,
    RECEIVED_HISTORY
 } from "./constants";

const initialState = {
    loggedIn: false,
    sensors: []
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED_SENSORS:
            return {
                loggedIn: state.loggedIn,                
                sensors: action.sensors.map(mapToSensorView).filter(isActive).sort(alphabeticOrder)
            };

        case RECEIVED_HISTORY:
            return {
                loggedIn: state.loggedIn,
                sensors: state.sensors.map(sensor => mapSensorViewWithHistory(sensor, action.history))
            };

        default:
            return state;
    }
};
