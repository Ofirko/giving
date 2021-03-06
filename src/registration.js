import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
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
            .post("/register", {
                first: this.first,
                last: this.last,
                email: this.email,
                pass: this.pass
            })
            .then(({ data }) => {
                console.log("register returns:", data);
                if (data.success) {
                    console.log("YOU REGISTERED!!");
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
            <div className="form">
                {this.state.error && <div className="error"> Oops! </div>}
                <h1> Sign Up </h1>
                <input
                    name="first"
                    placeholder="first"
                    onChange={this.userEntry}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={this.userEntry}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={this.userEntry}
                />
                <input
                    name="pass"
                    placeholder="password"
                    type="password"
                    autoComplete="off"
                    onChange={this.userEntry}
                />
                <button onClick={this.submit}>Create Account</button>
                <h3>
                    <Link className="link" to="/login">
                        Already have an account?
                    </Link>
                </h3>
            </div>
        );
    }
}
