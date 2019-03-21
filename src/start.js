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
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

// "store" is another word for the global Redux state.
// we don't really do much with the store -- we mostly just need it for Redux to work!
// but it's good to know that the store has methods on it that we can use to interact with the global state.
// the only one of those methods we care about is called "dispatch." dispatch is a method that, when invoked, starts the process of adding data to Redux.
