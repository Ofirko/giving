import React from "react";
import { connect } from "react-redux";
import { fetchFriends, acceptFriend, unfriend } from "./actions.js";
import axios from "./axios";

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchFriends());
    }

    render() {
        const { friends, wannabes } = this.props;
        console.log("friends:", friends);
        console.log("wannabes", wannabes);
        if (!wannabes) {
            return null;
        }
        return (
            <div>
                {!!wannabes.length && (
                    <h1>These people want to be your friends</h1>
                )}
                {!!wannabes.length &&
                    wannabes.map(friend => {
                        return (
                            <div key={friend.id}>
                                <img
                                    className="friendpic"
                                    src={
                                        friend.picurl ||
                                        "/assets/iconmonstr-user-20.svg"
                                    }
                                />
                                {friend.firstname} {friend.lastname}
                                <button
                                    className="friends"
                                    onClick={() =>
                                        this.props.dispatch(
                                            acceptFriend(friend.id)
                                        )
                                    }
                                >
                                    Accept Friend request!
                                </button>
                            </div>
                        );
                    })}
                {friends.length && (
                    <h1>These people are currently your friends</h1>
                )}
                {friends.length &&
                    friends.map(friend => {
                        return (
                            <div key={friend.id}>
                                <img
                                    className="friendpic"
                                    src={
                                        friend.picurl ||
                                        "/assets/iconmonstr-user-20.svg"
                                    }
                                />
                                {friend.firstname} {friend.lastname}
                                <button
                                    className="friends"
                                    onClick={() =>
                                        this.props.dispatch(unfriend(friend.id))
                                    }
                                >
                                    Remove from your Friends
                                </button>
                            </div>
                        );
                    })}
                {!friends && <h1> NO FRIENDS TO SHOW </h1>}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        friends:
            state.data && state.data.filter(friend => friend.accepted == true),
        wannabes:
            state.data && state.data.filter(friend => friend.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
