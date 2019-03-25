import React from "react";
import axios from "./axios";
import { getSocket } from "./socket";
import { connect } from "react-redux";

class ChatMessages extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.msgEntry = this.msgEntry.bind(this);
    }

    msgEntry(e) {
        if (e.which == 13) {
            console.log(e.target.value);
            console.log("SEND");
            getSocket().emit("newChatMessage", [
                e.target.value,
                this.props.user
            ]);
            e.target.value = "";
        }
    }
    render() {
        const { messages } = this.props;
        console.log("CHAT PROPS", this.props.user);
        return (
            <div>
                <h1>Chat Room!</h1>
                {messages &&
                    messages.data.map(message => {
                        return (
                            <div id="msgblock" key={message.created_at}>
                                {message.firstname} {message.lastname}
                                <p> {message.message} </p>
                            </div>
                        );
                    })}
                <div>
                    <textarea
                        className="newmsg"
                        name="message"
                        onKeyPress={this.msgEntry}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("This is state:", state);
    return {
        messages: state.messages
    };
};

export default connect(mapStateToProps)(ChatMessages);
