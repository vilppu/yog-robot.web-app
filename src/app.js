import React, { Component } from 'react';
import { firebaseConfig } from './config';
import './toast.css';
import './layout.css';


import { setupServiceWorker } from "./firebase-messaging.js";
import {setupLogin } from "./login.js";
import {setupSensorView } from "./sensor-view.js";


class App extends Component {

    componentDidMount() {        
        setupServiceWorker();
        setupSensorView();
        setupLogin();
      }

    render() {
        window.firebase.initializeApp(firebaseConfig);
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
                </div>
            </div>

            <template id="sensor-template">
                <div className="sensor">
                    <a href="#" className="sensor-status">
                        <div className="sensor-name"></div>
                        <div className="measurement"></div>
                    </a>
                    <div className="sensor-details" styles={{display: 'none'}}>
                        <span className="battery"></span><span className="rssi"></span><a href="#" className="edit-name">&#9998;</a>

                        <div className="name-editor" styles={{display: 'none'}}>
                            <input className="edited-name"></input>
                            <a href="#" className="confirm-edit-name">Tallenna</a>
                            <a href="#" className="cancel-edit-name">Peruuta</a>.
                        </div>

                        <div className="history"></div>
                    </div>
                </div>
            </template>

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

export default App;
