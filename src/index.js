import React from "react";
import { render } from "react-dom";
import App from "./app";
import {initGlobalStates} from "./initglobalstates"

// if you're in create-react-app import the files as:
// import store from "./js/store/index";
// import App from "./js/components/App.jsx";
initGlobalStates()

render(
  <App />,
  // The target element might be either root or app,
  // depending on your development environment
  // document.getElementById("app")
  document.getElementById("root")
);
