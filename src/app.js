import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { refresh, refreshHistory } from "./actions";
import Sensor from "./sensor-component";
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
                        {this.props.sensors.map((sensor) => <Sensor sensor={sensor} expanded={false} />)}
                </div>
                </div>
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

    return {
        sensors
    };
}

export default connect(mapStateToProps)(App);

