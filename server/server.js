const ws = require('ws');

class SignalingChannel {
    constructor(configuration) {//no config defined yet, just passing in a server (https, app)
    this.websocketServer = ws.Server({server: configuration})
    this.users = new Map();
    this.rooms = new Map();

/**
 * contains each room created by the client
 * key: room (possible the generated id), values: [users] (each user is the socket, socket.send)
 * {roomID: [me, raisa]}
 * //if (client !== currentClient (ws) && client.readyState === WebSocket.OPEN) client.send(data);
 */
    }
    
    /**
     * listens to each client connecting
     */
    initializeConnection() {
        this.websocketServer.on('connection', (socket) => {
            // this.users.set('')
        })
    }
//do stuff..

onMessage
//onLogin
//ice candidate handling
    //answer
    //offer
        //return ready if message sent to server is type: READY (?)

createRoom

handleLeaveRoom
//delete room when nobody is longer in.

onClose 
}