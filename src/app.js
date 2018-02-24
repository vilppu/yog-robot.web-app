import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refresh } from "./actions";
import "./toast.css";
import "./layout.css";

class App extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(refresh());
    }

    render() {
        return (
            <div>
            <header>
                <a href="#" id="logout">Poistu</a>
            </header>

            <div id="content">
                <div id="toast">
                    <div id="toastTitle"></div>
                    <div id="toastBody"></div>
                </div>

                <div id="devices">
                    { this.props.sensors.map((sensor) => (
                        
                        <div className="sensor">
                            <a href="#" className="sensor-status">
                                <div className="sensor-name">{sensor.sensorName}</div>
                                <div className="measurement">{sensor.measuredValue}</div>
                            </a>
                            <div className="sensor-details" styles={{display: "none"}}>
                                <span className="battery">{sensor.batteryVoltage}</span><span className="rssi">{sensor.signalStrength}</span><a href="#" className="edit-name">&#9998;</a>

                                <div className="name-editor" styles={{display: "none"}}>
                                    <input className="edited-name"></input>
                                    <a href="#" className="confirm-edit-name">Tallenna</a>
                                    <a href="#" className="cancel-edit-name">Peruuta</a>.
                                </div>

                                <div className="history"></div>
                            </div>
                        </div>
                    )) };
                </div>
            </div>

            <template id="history-entry-template">
                <div className="history-entry">
                    <div className="timestamp"></div>
                    <div className="measurement"></div>
                </div>
            </template>
            </div>
        );
    }
}
 
App.propTypes = {  
  sensors: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { sensors } = state 
        const { sensors: [] } = { sensors: [] };
   
    return {
        sensors
    };
  };
   
export default connect(mapStateToProps)(App)

