import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refresh, refreshHistory } from "./actions";
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
        const { sensor, dispatch } = this.props;
        const { expanded } = this.state;
        
        if(!expanded) {
            dispatch(refreshHistory(sensor));
        }

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
                    <span className="battery">{this.props.sensor.signal}</span>
                    <span className="rssi">{this.props.sensor.signal}</span>
                    <a href="#" className="edit-name">&#9998;</a>

                    <div className="name-editor" styles={{ display: "none" }}>
                        <input className="edited-name"></input>
                        <a href="#" className="confirm-edit-name">Tallenna</a>
                        <a href="#" className="cancel-edit-name">Peruuta</a>
                    </div>
                    
                    {this.props.sensor.history.map((entry) =>
                        <div className="history">
                            <div className="history-entry">
                                <div className="timestamp">{entry.timestamp}</div>
                                <div className="measurement">{entry.measurement}</div>
                            </div>
                        </div>
                    )}
                </div>
                }
            </div>
        );
    }
}

Sensor.propTypes = {
    sensor: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { sensors } = state;    

    return {
        sensors
    };
}

export default connect(mapStateToProps)(Sensor);

