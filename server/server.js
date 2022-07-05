const ws = require('ws');
const { OFFER, ANSWER, ICECANDIDATE, LOGIN } = require('../actions');


//how to use IIFE and classes?, on instantiation of this class it should start the websocket connection
    //should not have to run SignalingChannel.connect() but rather be assigned to a variable and started

class SignalingChannel {
    constructor(server) { //no config defined yet, just passing in a server (https, app), can pass in port too (not the same port)
    this.webSocketServer = new ws.Server(server)
    this.users = new Map();
    // this.rooms = new Map(); //focus on later
    }


//option1 --quick and easy for test purposes
    //user = {id: socket}
    //user = {1: anthony'sWebSocket, 2: yoojin'sWebSocket}
    //users[2].send(data.payload)
    //users[id].send(data.payload)
    //socket.send(JSON.stringify(data.payload));

//option2 -- scales
    // WebSocketServer.clients.forEach(client => {
    // if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
    // client.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')}))
    // })


/**
 * contains each room created by the client
 * key: room (possible the generated id), values: [users] (each user is the socket, socket.send)
 * {roomID: [me, raisa]}
 */
    
    /**
     * listens to each client connecting
     * can use iife here too?
     */
    initializeConnection() {
        console.log(this.webSocketServer.clients.size);
        this.webSocketServer.on('connection', (socket) => {
            console.log('A user has connected to the websocket server.')

            socket.on('message', (message) => {
                
                const stringifiedMessage = message.toString('utf-8')
                const data = JSON.parse(stringifiedMessage);
                console.log('websocket confirmation:', data.ACTION_TYPE, data.payload);

                switch (data.ACTION_TYPE) {
                    case OFFER:
                        this.transmit();
                        break;
                    case ANSWER:
                        this.transmit();
                        break;
                    case ICECANDIDATE:
                        this.transmit();
                        break;
                    case LOGIN:
                        console.log('username received:', data.payload);
                        this.users.set(data.payload, socket)
                        console.log('all users connected', this.users.size);
                        console.log('list of users', this.users.keys());
                }
            })
        })
    }

        transmit(action) {
            this.webSocketServer.clients.forEach(client => {
                if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
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
