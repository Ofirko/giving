import React from "react";
import ReactDOM from "react-dom";
import * as io from "socket.io-client";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { Provider } from "react-redux";
import Welcome from "./welcome";
import App from "./app";
import { getSocket } from "./socket";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
const socket = io.connect();
// import Logo from "./logo";

let elem;
console.log(location.pathname);
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    getSocket(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
