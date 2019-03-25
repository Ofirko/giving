export default function(state = {}, action) {
    if (action.type === "FRIEND_LIST") {
        state = { ...state, data: action.data };
    }
    if (action.type === "UNFRIENDED") {
        console.log("action:", action);
        state = {
            ...state,
            data: state.data.filter(friend => {
                friend.id == action.data[0].sender || action.data[0].receiver;
            })
        };
    }
    if (action.type === "ACCEPTED_FRIEND") {
        console.log("here", action);
        state = {
            ...state,
            data: state.data.map(friend => {
                console.log("here it is", friend);
                if (
                    friend.id == action.data[0].sender ||
                    friend.id == action.data[0].receiver
                ) {
                    console.log("found", friend);
                    friend.accepted = true;
                    return friend;
                }
                return friend;
            })
        };
    }
    if (action.type === "MESSAGES") {
        console.log("action:", action);
        console.log(action.messages);
        state = {
            ...state,
            messages: action.messages
        };
    }
    return state;
}
