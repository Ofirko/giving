import * as io from 'socket.io-client';
import {onlineUsers, userJoined, userLeft} from './actions';
let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('onlineUsers', data => {
            store.dispatch(
                onlineUsers(data);
            );
        });

        socket.on('userJoined', data => {
            store.dispatch(
                userJoined(data);
            );
        });

        socket.on('userLeft', data => {
            store.dispatch(
                userLeft(data);
            );
        });
    }

    return socket;
}





//
// 1. `chatMessages` — rendering 10 most recent chat messages when user navigates to `/chat` — **DO THIS FIRST.**
//    - `server.js` — store the chat messages in one of two ways:
//      1. build an array of chatMessages in the server, and whenever there's a new chat message, just `push` into that array
//      2. build a whole new db table just for chats!
//    - once we have an array of the 10 most recent chat messages…. `emit` it to the front!
//    - in `socket.js` listen for the socket event that was just emitted, then `dispatch`. Then `action`, then `reducer`
//    - Once reducer does its job, the chat messages array should now be in Redux! 
//    - Then the `Chat` component needs to render them on screen.
// 2. `newChatMessage` — what to do when a user posts a new chat message?
//    - in `chat.js` — capture user input and emit it to the server using sockets
//    - in `index.js` — listen for that socket message to come in
//      - if using array approach — db query to get info about person who posted message, and push object into the chatMessages array that contains info about user who posted message + the message itself
//      - if using table approach — `INSERT` into `chats` table, and do db query to get info about person who posted message. Then create an object that contains info about user + message they just posted
//      - once we have that object, we want to make sure EVERYONE gets a copy of that object… `io.sockets.emit()`
//    - listen for this event to come in in our `socket.js` file
//    - from there… `dispatch`, `action`, `reducer`
//      - if reducer does its job correctly… we should see the new message appear on screen!









//
// 1. Server
//
//     * create list of online users
//         * can be single object with socket ids as keys and user ids as values
//         * can be an array of objects each with a socketId property and a userId property
//     * listen for connection events
//         * send the socket the list of online users (emit the `"onlineUsers"` event)
//             * pass an array of user ids to a query function that uses `ANY`
//             * you get the array of user ids from the list of online users
//             * the list you send should contain user ids, first names, last names, and image urls
//         * if the user who just connected was no already in the list, then send an object representing that users to every socket EXCEPT the one that just connected (use `socket.broadcast.emit` to emit the `"userJoined"` event)
//         * add a `"disconnect"` handler to the socket to know when the socket disconnects
//             * remove the socket from the list of online users
//             * check to see if the user's id is still in the list of online users after the socket has been remove
//             * if the user is really gone, tell everybody (`io.emit` the `"userLeft"` event with the user's id as the payload)
//
// 2. Client
//     * start.js
//         * call the function exported by socket.js only if the user is logged in.
//         * when calling the function exported by socket.js, pass the store
//     * socket.js
//         * exports function that creates connection and attaches event handlers the first time it is called and always returns the socket
//         * the event handlers must use the store to dispatch actions.
//     * actions.js
//         * creates actions for the three events: `onlineUsers`, `"userJoined"`, and `"userLeft"`
//         * the action creators do not need to make axios calls. They will be passed the relevant data by the socket event handlers so they just need to return action objects with the correct type and the data attached
//     * reducers.js
//         * three new conditionals
//             * `"ONLINE_USERS"` - return a new state object that has all of the properties of the old state object but adds a new `onlineUsers` property whose value is the array of online user objects attached to the action. (this is much like the `"RECEIVE_FRIENDS_WANNABES"` in part 7)
//             * `"USER_JOINED"` - return a new state object that has all of the properties of the old state object except the old online users array is replaced with a new online users array that has in it all of the same objects as the old array but one more added, the one attached to the action
//             * `"USER_LEFT"`- - return a new state object that has all of the properties of the old state object except the old online users array is replaced with a new online users array that has in it all of the same objects as the old array but one removed, the one whose id is specified in the action
//     * online.js
//         * create a component that expects to receive an array of online users as a prop and  renders them
//         * create a `mapStateToProps` function that pulls the `onlineUsers` from the global redux state
//         * call connect and pass it the `mapStateToProps` and then the component and then export the result
//             ```js
//             export default connect(mapStateToProps)(OnlineUsers);
//             ```
//     * app.js
//         * create a route for the component exported by online.js
