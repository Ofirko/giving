import axios from "./axios";
import React from "react";

// you could also rewrite this using async / await
export async function fetchFriends() {
    const { data } = await axios.get("/friendslist");
    console.log("data in actions:", data);
    return {
        type: "FRIEND_LIST",
        data: data
    };
}

export async function unfriend(rec) {
    const { data } = await axios.post("/postFriendship", {
        action: "delete",
        reciever: rec
    });
    console.log("data in actions:", data);
    return {
        type: "UNFRIENDED",
        data: data
    };
}

export async function acceptFriend(rec) {
    const { data } = await axios.post("/postFriendship", {
        action: "update",
        reciever: rec
    });
    console.log("data in actions:", data);
    return {
        type: "ACCEPTED_FRIEND",
        data: data
    };
}

export async function chats(data) {
    console.log("chats on actions:", data);
    return {
        type: "MESSAGES",
        messages: data
    };
}
export async function newMessage(data) {
    console.log("chats on actions:", data);
    return {
        type: "MESSAGES",
        messages: data
    };
}
// sendReq(action) {
//     console.log(action);
//     axios
//         .post("/postFriendship", {
//             action: action,
//             reciever: this.props.rec
//         })
//         .then(({ data }) => {
//             console.log(data);
//         });
// }
