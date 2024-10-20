import React, { Component } from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from 'redux-thunk';
import { rootReducer } from "./reducers";
import App from "./app";
import "./index.css";

const store = createStore(
  rootReducer,
  {
    loggedIn: false,
    sensors: []
  },
  applyMiddleware(
    thunk
  )
);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

render(<Root />, document.getElementById("root"));
