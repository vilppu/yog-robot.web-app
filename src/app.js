import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refresh } from "./actions";
import "./toast.css";
import "./layout.css";

class Sensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    toggleExpanded(props) {
        const { expanded } = this.state;
        this.setState({
            expanded: !expanded
        });
    }

    render() {
        const { expanded } = this.state;
        return (
            <div className="sensor" onClick={this.toggleExpanded}>
                <a href="#" className="sensor-status">
                    <div className="sensor-name">{this.props.sensor.name}</div>
                    <div className="measurement"><span className={this.props.sensor.measuredProperty}>{this.props.sensor.measurement}</span></div>
                </a>
                {expanded &&
                <div className="sensor-details" styles={{ display: "none" }}>
                    <span className="battery">{this.props.sensor.signal}</span><span className="rssi">{this.props.sensor.signal}</span><a href="#" className="edit-name">&#9998;</a>

                    <div className="name-editor" styles={{ display: "none" }}>
                        <input className="edited-name"></input>
                        <a href="#" className="confirm-edit-name">Tallenna</a>
                        <a href="#" className="cancel-edit-name">Peruuta</a>
                    </div>

                    <div className="history"></div>
                </div>
                }
            </div>
        );
    }
}

Sensor.propTypes = {
    sensor: PropTypes.object.isRequired
};

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
                        {this.props.sensors.map((sensor) => <Sensor sensor={sensor} expanded={false} />)}
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
    const { sensors } = state;
    const { sensors: [] } = { sensors: [] };

    return {
        sensors
    };
}

export default connect(mapStateToProps)(App);

