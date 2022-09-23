"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc actions used by the SignalingChannel and Socket component to filter and identify the data being passed through the WebSocket message event.
*/
const actions = {
    CONNECTION: 'CONNECTION',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    LOGIN: 'LOGIN',
    ICECANDIDATE: 'ICECANDIDATE',
    LEAVE: 'LEAVE',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM'
};
exports.default = actions;
