import * as io from "";

export function getSocket() {
    if (!socket) {
        socket = io.connect();
    }
}
