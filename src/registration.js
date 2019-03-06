import React from "react";
import axios from "./axios";
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
            <div>
                {this.state.error && <div className="error"> Oops! </div>}
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
                    onChange={this.userEntry}
                />
                <button onClick={this.submit}>Click</button>

                <h3>
                    Already a member? <a href=""> Log in!</a>
                </h3>
            </div>
        );
    }
}
