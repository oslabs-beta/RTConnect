"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc actions that will be used by SignalingChannel and Socket component for being able to filter and identify data passed through websocket message event
*/
const actions = {
    CONNECTION: 'CONNECTION',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    LOGIN: 'LOGIN',
    ICECANDIDATE: 'ICECANDIDATE',
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM'
};
exports.default = actions;
// module.exports = actions;
