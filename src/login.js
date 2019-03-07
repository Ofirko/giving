import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userEntry = this.userEntry.bind(this);
        this.submit = this.submit.bind(this);
    }

    userEntry(e) {
        this[e.target.name] = e.target.value;
    }

    submit() {
        console.log(this.first);
        axios
            .post("/login", {
                email: this.email,
                password: this.pass
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("YOU LOGGED IN!!");
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error"> Oops! </div>}
                <input
                    name="email"
                    placeholder="e-mail adress"
                    onChange={this.userEntry}
                />
                <input
                    name="pass"
                    placeholder="password"
                    type="password"
                    autoComplete="off"
                    onChange={this.userEntry}
                />
                <button onClick={this.submit}>Log in</button>
                <h3>
                    Not registered yet? <Link to="/">Register!</Link>
                </h3>
            </div>
        );
    }
}
