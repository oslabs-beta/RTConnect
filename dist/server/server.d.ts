/// <reference types="node" />
/// <reference types="node" />
import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { Server as httpsServer } from 'https';
/**
 * @class
 * @classdesc The SignalingChannel class which utilizes WebSockets in order to facillitate communication between clients connected to the WebSocket server.
 * @prop { WebsocketServer } websocketServer - a simple websocket server
 * @prop { Map } users - an object of users in the following fashion { username1: socket1, username2: socket2, usernameN: socketN, ... }
 */
declare class SignalingChannel {
    webSocketServer: WebSocketServer;
    users: Map<string, WebSocket>;
    /**
     * @constructor constructing a websocket server with an https object passed in upon instantiating SignalingChannel
     * @param {Server} server - pass in a server (http or https), or pass in port (not the same port (this port can't be the same as the application port and has to listen on the same port in rtconnect!)
     */
    constructor(server: Server | httpsServer | number);
    /**
     * @description Upon creation and connection to the websocket server, the websocket server will add these event listeners to their socket to perform key functionality
     * @function initializeConnection Signaling server will listen to client when client has been connected.
     * when the message event is triggered, it will either send each user list to each user upon login or sending the receiver the data
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
