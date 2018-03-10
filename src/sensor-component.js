import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refreshHistory, saveSensorName } from "./actions";

class Sensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            editMode: false,
            name: props.sensor.name
        };
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.editing = this.editing.bind(this);
    }

    toggleExpanded(event) {
        event.stopPropagation();

        const { sensor, dispatch } = this.props;
        const { expanded, editMode } = this.state;
        
        if(!expanded) {
            dispatch(refreshHistory(sensor));
        }

        this.setState({
            expanded: !expanded,
            editMode: editMode,
        });
    }

    toggleEditMode(event) {
        event.stopPropagation();

        const { expanded, editMode } = this.state;

        this.setState({
            expanded: expanded,
            editMode: !editMode,
        });
    }

    saveChanges(event) {
        const { sensor, dispatch } = this.props;
        const { name } = this.state;

        dispatch(saveSensorName(sensor, name));

        this.toggleEditMode(event);
    }

    cancelEdit(event) {
        this.toggleEditMode(event);
    }

    editing(event) {
        this.setState({
            ...this.state,
            name: event.target.value
        });        
    }

    render() {
        const { expanded, editMode, name } = this.state;
        return (
            <div className="sensor">
                <a className="sensor-status" onClick={this.toggleExpanded}>
                    <div className="sensor-name">{this.props.sensor.name}</div>
                    <div className="measurement">
                        <span className={this.props.sensor.measuredProperty}>{this.props.sensor.measurement}</span>
                    </div>
                </a>
                {expanded &&
                <div className="sensor-details">
                    <span className="battery">{this.props.sensor.signal}</span>
                    <span className="rssi">{this.props.sensor.signal}</span>
                    <a className="edit-name" onClick={this.toggleEditMode}>&#9998;</a>
                    
                    {editMode &&
                    <div className="name-editor">
                        <input className="edited-name" value={name} onChange={this.editing}></input>
                        <a className="confirm-edit-name" onClick={this.saveChanges}>Tallenna</a>&nbsp;
                        <a className="cancel-edit-name" onClick={this.cancelEdit}>Peruuta</a>
                    </div>
                    }
                    
                    <div className="history">
                    {this.props.sensor.history.map((entry) =>
                            <div className="history-entry" key={entry.key}>
                                <div className="timestamp">{entry.timestamp}</div>
                                <div className="measurement">
                                    <span className={this.props.sensor.measuredProperty}>{entry.measurement}</span>
                                </div>
                        </div>
                    )}
                    </div>
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

