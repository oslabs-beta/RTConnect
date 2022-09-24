/// <reference types="node" />
/// <reference types="node" />
import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { Server as httpsServer } from 'https';
/**
 * @class
 * @classdesc The SignalingChannel class, which utilizes WebSockets in order to facillitate communication between clients connected to the WebSocket server.
 * @prop { WebsocketServer } websocketServer - a simple WebSocket server
 * @prop { Map } users - object containing key-value pairs consisting of users' names and their corresponding WebSocket in the following fashion { username1: socket1, username2: socket2, ... , usernameN: socketN }
 */
declare class SignalingChannel {
    webSocketServer: WebSocketServer;
    users: Map<string, WebSocket>;
    /**
     * @constructor constructing a websocket server with an http/https object or port passed in upon instantiating SignalingChannel
     * @param {Server} server - pass in a server (http or https) or pass in a port (this port cannot be the same as the application port and it has to listen on the same port)
     */
    constructor(server: Server | httpsServer | number);
    /**
     * @description Upon creation and connection to the WebSocket server, the WebSocket server will add these event listeners to their socket to perform key functionality
     * @function initializeConnection Signaling server will listen to client when client has connected.
     * When the message event is triggered, it will either send each user list to each user upon login or send data to the receiver
     * @return a socket that corresponds to the client connecting.
     */
    initializeConnection(): void;
    /**
     * @description Broadcasting from sender to receiver. Accessing the receiver from the data object and if the user exists, the data is sent
     * @param {object} data
     */
    transmit(data: {
        ACTION_TYPE: string;
        receiver: string;
    }): void;
    /**
     * @description Getting user from Map
     * @function getByValue identifies user and their specific websocket
     * @param {Map} map
     * @param {WebSocket} searchValue
     * @returns {string} user
     */
    getByValue(map: Map<string, WebSocket>, searchValue: WebSocket): string;
}
export default SignalingChannel;
