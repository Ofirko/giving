import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./welcome";
import App from "./app";
import Logo from "./logo";

let elem;
console.log(location.pathname);
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <div>
            <App />
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
