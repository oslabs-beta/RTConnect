"use strict";
exports.__esModule = true;
// const { WebSocket, WebSocketServer } = require('@types/ws/index');
//require after
//Cannot use import statement outside a module
var ws = require('ws');
var _a = require('../constants/actions.js'), OFFER = _a.OFFER, ANSWER = _a.ANSWER, ICECANDIDATE = _a.ICECANDIDATE, LOGIN = _a.LOGIN;
//how to use IIFE and classes?, on instantiation of this class it should start the websocket connection
//should not have to run SignalingChannel.connect() but rather be assigned to a variable and connected to signalling channel
// const findingType: WebSocketServer = new ws.Server(8080) //erase and delete last letter and look at modal
/**
 * @desc Signaling Channel
 * @params server
 * @returns
 */
var SignalingChannel = /** @class */ (function () {
    function SignalingChannel(server) {
        this.webSocketServer = new ws.Server(server);
        this.users = new Map();
        // this.rooms = new Map(); //focus on later
    }
    SignalingChannel.prototype.initializeConnection = function () {
        var _this = this;
        console.log(this.webSocketServer.clients.size);
        this.webSocketServer.on('connection', function (socket) {
            console.log('A user has connected to the websocket server.');
            socket.on('close', function () {
                var userToDelete = _this.getByValue(_this.users, socket);
                _this.users["delete"](userToDelete);
                socket.terminate();
                var userList = { ACTION_TYPE: LOGIN, payload: Array.from(_this.users.keys()) };
                _this.webSocketServer.clients.forEach(function (client) { return client.send(JSON.stringify(userList)); });
                console.log(_this.users.size);
            });
            socket.on('message', function (message) {
                var stringifiedMessage = message.toString('utf-8');
                var data = JSON.parse(stringifiedMessage);
                //use this console log with postman, "ws://localhost:3001"
                // console.log('websocket confirmation:', data.ACTION_TYPE, data.payload); 
                switch (data.ACTION_TYPE) {
                    case OFFER:
                        _this.transmit(data);
                        break;
                    case ANSWER:
                        _this.transmit(data);
                        break;
                    case ICECANDIDATE:
                        _this.transmit(data);
                        break;
                    case LOGIN:
                        _this.users.set(data.payload, socket);
                        console.log('all users connected', _this.users.size, _this.users.keys());
                        var userList_1 = { ACTION_TYPE: LOGIN, payload: Array.from(_this.users.keys()) };
                        _this.webSocketServer.clients.forEach(function (client) { return client.send(JSON.stringify(userList_1)); });
                }
            });
        });
    };
    // broadcast to other user, sender --> receiver
    SignalingChannel.prototype.transmit = function (data) {
        var _a;
        console.log("c% ".concat(data), "background-color: yellow");
        console.log('this is the current socket for:', data.ACTION_TYPE, data.receiver);
        (_a = this.users.get(data.receiver)) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(data));
        // this.webSocketServer.clients.forEach(client => client === this.users.get(data.receiver) ? client.send(JSON.stringify(data)) : console.log('this isn\'t the socket I want'));
        // this.webSocketServer.clients.forEach(client => {
        //     if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
        // })
        //option2 -- scales
        // WebSocketServer.clients.forEach(client => {
        // if (client !== socket && client.readyState === WebSocket.OPEN) client.send(data);
        // client.send(JSON.stringify({id: ws.id, message: event.toString('utf-8')}))
        // })
    };
    SignalingChannel.prototype.getByValue = function (map, searchValue) {
        var user = '';
        for (var _i = 0, _a = map.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value === searchValue)
                user = key;
        }
        return user;
    };
    return SignalingChannel;
}());
module.exports = SignalingChannel;
