import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <div>Welcome!</div>
            <img className="welcome" src="/assets/agora200.png" />
            <Registration />
        </div>
    );
}
