"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });

const ws_1 = require("ws");
const actions_1 = __importDefault(require("../src/constants/actions"));
const { OFFER, ANSWER, ICECANDIDATE, LOGIN, LEAVE } = actions_1.default;

/**
 * @class
 * @classdesc Class representing the SignalingChannel using websockets to allow communication between clients connected to the websocket server
 * @prop { WebsocketServer } websocketServer - a simple websocket server
 * @prop { Map } users - an object of users in the following fashion { username1: socket1, username2: socket2, usernameN: socketN, ... }
 */
class SignalingChannel {
    /**
     *
     * @constructor constructing a websocket server with an https object passed in upon instantiating SignalingChannel
     * @param {Server} server - pass in a server (http or https), or pass in port (not the same port (this port can't be the same as the application port and has to listen on the same port in rtconnect!)
     */
    constructor(server) {
        this.webSocketServer = typeof server === 'number' ? new ws_1.WebSocket.Server({ port: server }) : new ws_1.WebSocket.Server({ server: server });
        this.users = new Map();
        // this.rooms = new Map(); // focus on later when constructing 2+ video conferencing functionality, SFU topology
    }
    
    /**
     * @description Upon creation and connection to the websocket server, the websocket server will add these event listeners to their socket to perform key functionality
     * @function initializeConnection Signaling server will listen to client when client has been connected.
     * when the message event is triggered, it will either send each user list to each user upon login or sending the receiver the data
     * @return a socket that corresponds to the client conencting.
     */
    initializeConnection() {
        this.webSocketServer.on('connection', (socket) => {
            console.log('A user has connected to the websocket server.');
            // when a client closes their browser or connection to the websocket server (onclose), their socket gets terminated and they are removed from the map of users
            // lastly a new user list is sent out to all clients connected to the websocket server. 
            socket.on('close', () => {
                const userToDelete = this.getByValue(this.users, socket);
                this.users.delete(userToDelete);
                socket.terminate();
                const userList = { ACTION_TYPE: LOGIN, payload: Array.from(this.users.keys()) };
                this.webSocketServer.clients.forEach(client => client.send(JSON.stringify(userList)));
            });
            
            // the meat of the websocket server, when messages are received from the client...
            // we will filter through what course of action to take based on data.ACTION_TYPE (see constants/actions.ts)
            socket.on('message', (message) => {
                // messages sent between the client and websocket server must be strings
                // importantly, messages sent to the websocket server are passed as Buffer objects encoded in utf-8 format
                const stringifiedMessage = message.toString('utf-8');
                const data = JSON.parse(stringifiedMessage);
                
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
                        this.users.set(data.payload, socket);
                        this.webSocketServer.clients.forEach(client => client.send(JSON.stringify({
                            ACTION_TYPE: LOGIN,
                            payload: Array.from(this.users.keys())
                        })));
                        break;
                    case LEAVE:
                        this.transmit(data);
                        break;
                    default:
                        console.error('error', data);
                        break;
                }
            });
        });
    }
    
    /**
     * @description Broadcasting from sender to receiver. Accessing the receiver from the data object and if the user exists, the data is sent
     * @param {object} data
     */
    transmit(data) {
        var _a;
        (_a = this.users.get(data.receiver)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(data));
    }
    
    /**
     * @description Getting user from Map
     * @function getByValue identifies user and their specific websocket
     * @param {Map} map
     * @param {WebSocket} searchValue
     * @returns {string} user
     */
    getByValue(map, searchValue) {
        let user = '';
        for (const [key, value] of map.entries()) {
            if (value === searchValue)
                user = key;
        }
        return user;
    }
}
exports.default = SignalingChannel;
