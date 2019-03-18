import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);

        this.state = {
            addFriendVis: false,
            acceptReqVis: false,
            DelReqVis: false,
            DelFriendVis: false
        };
    }
    componentDidMount() {
        console.log("mount happens");
        console.log("current id:", this.props.rec);
        axios
            .get("/friendships/" + this.props.rec)
            .then(({ data }) => {
                console.log("friendship back from the axios:", data);
                if (data == false) {
                    this.setState({ addFriendVis: true });
                } else if (data.accepted == true) {
                    this.setState({ DelFriendVis: true });
                } else if (data.sender == this.props.rec) {
                    this.setState({ acceptReqVis: true });
                } else {
                    this.setState({ DelReqVis: true });
                }
            })
            .catch(err => {
                console.log("error", err);
            });
    }
    // bioScreen() {
    //     console.log("edit bio");
    //     this.setState({
    //         addBtnVis: false,
    //         editBtnVis: false,
    //         editBoxVis: true
    //     });
    // }

    sendReq(action) {
        console.log(action);
        axios
            .post("/postFriendship", {
                action: action,
                reciever: this.props.rec
            })
            .then(({ data }) => {
                if (action == "insert") {
                    this.setState({
                        addFriendVis: false,
                        DelReqVis: true
                    });
                } else if (action == "update") {
                    this.setState({
                        acceptReqVis: false,
                        DelFriendVis: true
                    });
                } else if (action == "delete") {
                    this.setState({
                        addFriendVis: true,
                        DelReqVis: false,
                        DelFriendVis: false
                    });
                } else {
                    console.log("ERROR");
                }
                // this.setState({});
            });
    }
    render() {
        return (
            <div>
                {this.state.addFriendVis && (
                    <button
                        className="friends"
                        onClick={() => this.sendReq("insert")}
                    >
                        Add Friend!
                    </button>
                )}
                {this.state.acceptReqVis && (
                    <button
                        className="friends"
                        onClick={() => this.sendReq("update")}
                    >
                        Accept Friend request!
                    </button>
                )}
                {this.state.DelReqVis && (
                    <button
                        className="friends"
                        onClick={() => this.sendReq("delete")}
                    >
                        Cancel Friend request
                    </button>
                )}
                {this.state.DelFriendVis && (
                    <button
                        className="friends"
                        onClick={() => this.sendReq("delete")}
                    >
                        Remove from your Friends
                    </button>
                )}
            </div>
        );
    }
}
