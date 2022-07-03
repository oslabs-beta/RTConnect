const ws = require('ws');
const { OFFER, ANSWER, ICECANDIDATE, LOGIN } = require('../actions');


//how to use IIFE and classes?, on instantiation of this class it should start the websocket connection
    //should not have to run SignalingChannel.connect() but rather be assigned to a variable and started

class SignalingChannel {
    constructor(configuration) { //no config defined yet, just passing in a server (https, app)
    this.webSocketServer = ws.Server({server: configuration})
    this.users = new Map();
    this.rooms = new Map(); //focus on later

//option1 --quick and easy for test purposes
    //user = {id: socket}
    //user = {1: anthony'sWebSocket, 2: yoojin'sWebSocket}
    //users[2].send(data.payload)
    //users[id].send(data.payload)
    //socket.send(JSON.stringify(data.payload));

//option2 -- scales
    //WebSocketServer.clients.forEach(client => {
    //if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
    // client.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')
    //}

/**
 * contains each room created by the client
 * key: room (possible the generated id), values: [users] (each user is the socket, socket.send)
 * {roomID: [me, raisa]}
 */
    }
    
    /**
     * listens to each client connecting
     * can use iife here too?
     */
    initializeConnection() {
        this.webSocketServer.on('connection', (socket) => {
            // this.users.set('')
            console.log('A user has connected to the websocket server.')
            socket.send(JSON.stringify)

            socket.on('message', (message) => {
                const data = message.toString();
                switch (data.ACTION_TYPE) {
                    case OFFER:
                        this.webSocketServer.clients.forEach(client => {
                            if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
                            })
                        break;
                    case ANSWER:
                        this.webSocketServer.clients.forEach(client => {
                            if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
                        })
                        break;
                    case ICECANDIDATE:
                        this.webSocketServer.clients.forEach(client => {
                            if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
                        })
                        break;
                    case LOGIN:
                        //data.payload should contain a username
                        //store username in users
                            //users ={username: socket}
                }
            })
        })
    }

    //create a function
        //broadcast/sendto all users except the user that sent the message
        //eliminate wet code

// onMessage
// //onLogin
// //ice candidate handling
//     //answer
//     //offer
//         //return ready if message sent to server is type: READY (?)

// createRoom

// handleLeaveRoom
// //delete room when nobody is longer in.

// onClose 
}

module.exports = SignalingChannel;