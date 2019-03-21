import React from "react";
import axios from "./axios";

export default class ChatMessages extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.msgEntry = this.msgEntry.bind(this);
    }

    componentDidMount() {
        axios
            .get("/chats")
            .then(({ data }) => {
                console.log("chat", data);
            })
            .catch(err => {
                console.log("error", err);
            });
    }

    msgEntry(e) {
        if (e.which == 13) {
            console.log(e.target.value);
            console.log("SEND");
            axios
                .post("/postMessage", {
                    message: e.target.value
                })
                .then(({ data }) => {
                    console.log("message added:", data);
                });
        }
    }
    render() {
        return (
            <div>
                <textarea
                    className="newmsg"
                    name="message"
                    onKeyPress={this.msgEntry}
                />
            </div>
        );
    }
}
