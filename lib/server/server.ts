import { WebSocket, WebSocketServer } from "ws";

const ws = require('ws');
const { OFFER, ANSWER, ICECANDIDATE, LOGIN } = require('../actions');


//how to use IIFE and classes?, on instantiation of this class it should start the websocket connection
    //should not have to run SignalingChannel.connect() but rather be assigned to a variable and connected to signalling channel
const test: { prop1: string }  = {prop1: 'test'};
const findingType = WebSocket //erase and delete last later and look at modal



class SignalingChannel {
    webSocketServer: any
    users: Map<String, WebSocket | any>

    constructor(server: any) { //no config defined yet, just passing in a server (https, app), can pass in port too (not the same port)
    this.webSocketServer = new ws.Server(server)
    this.users = new Map();
    // this.rooms = new Map(); //focus on later
    }
    
    initializeConnection(): void {
        console.log(this.webSocketServer.clients.size);
        this.webSocketServer.on('connection', (socket) => {
            console.log('A user has connected to the websocket server.')

            socket.on('close', () => {
                const userToDelete = this.getByValue(this.users, socket)
                    this.users.delete(userToDelete);
                    socket.terminate();
                

                const userList = { ACTION_TYPE: LOGIN, payload: Array.from(this.users.keys()) };
                this.webSocketServer.clients.forEach(client => client.send(JSON.stringify(userList)));

                console.log(this.users.size);
            })

            socket.on('message', (message) => {
                
                const stringifiedMessage = message.toString('utf-8')
                const data = JSON.parse(stringifiedMessage);
                
                //use this console log with postman, "ws://localhost:3001"
                // console.log('websocket confirmation:', data.ACTION_TYPE, data.payload); 

                switch (data.ACTION_TYPE) {
                    case OFFER:
                        this.transmit(data);
                        break;
                    case ANSWER:
                        this.transmit(data);
                        break;
                    case ICECANDIDATE:
                        this.transmit(data);
                        break;
                    case LOGIN:
                        this.users.set(data.payload, socket)
                        console.log('all users connected', this.users.size, this.users.keys());

                        const userList = { ACTION_TYPE: LOGIN, payload: Array.from(this.users.keys()) };
                        this.webSocketServer.clients.forEach(client => client.send(JSON.stringify(userList)));
                }
            })
        })
    }


        // broadcast to other user, sender --> receiver
        transmit(data: any): void {
            console.log('this is the current socket for:', data.ACTION_TYPE, data.receiver);
            if (this.users.get(data.receiver)) this.users.get(data.receiver).send(JSON.stringify(data));
            // this.webSocketServer.clients.forEach(client => client === this.users.get(data.receiver) ? client.send(JSON.stringify(data)) : console.log('this isn\'t the socket I want'));
            
            // this.webSocketServer.clients.forEach(client => {
            //     if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
            // })

            //option2 -- scales
            // WebSocketServer.clients.forEach(client => {
            // if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
            // client.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')}))
            // })
        }

        getByValue (map: any, searchValue: any): string {
            let user = '';
            for (let [key, value] of map.entries()) {
              if (value === searchValue) user = key;
        }
        return user;
    }


// createRoom
/**
 * contains each room created by the client
 * key: room (possible the generated id), values: [users] (each user is the socket, socket.send)
 * {roomID: [me, raisa]}
 */

// handleLeaveRoom
    //delete room when nobody is longer in.
}

module.exports = SignalingChannel;
