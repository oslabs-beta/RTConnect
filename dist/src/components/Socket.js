"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const actions_1 = __importDefault(require("../constants/actions"));
const { LOGIN, ICECANDIDATE, OFFER, ANSWER, LEAVE } = actions_1.default;
/**
 * @desc Using the initial WebSocket connection, this functional component provides the event listeners for each client's socket connection to allow bilateral communication.
 * @param {string} props.ws - the ws or wss socket url that will initiate the connection with the WebSocket server
 * @param {function} props.getUser - When data (the list of connected users) is received from the WebSocketServer/backend, getUser
 * function is invoked and it updates the userList state so that the list of currently connected users
 * can be displayed on the frontend.
 * @param props.handleReceiveCall
 * @param props.handleAnswer
 * @param props.handleNewIceCandidate
 * @param props.endCall
 * @returns an empty element when rendered and populates the client's socket connection with event listeners that can handle the offer-answer model and SDP objects being exchanged between peers.
 */
const Socket = ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidate, endCall }) => {
    // IIFE, this function gets invoked when a new socket component is created
    (function initalizeConnection() {
        ws.addEventListener('open', () => {
            console.log('Websocket connection has opened.');
        });
        ws.addEventListener('close', () => {
            console.log('Websocket connection closed.');
        });
        ws.addEventListener('error', (e) => {
            console.error('Socket Error:', e);
        });
        ws.addEventListener('message', message => {
            const parsedData = JSON.parse(message.data);
            switch (parsedData.ACTION_TYPE) {
                case LOGIN:
                    getUsers(parsedData);
                    break;
                case OFFER:
                    handleReceiveCall(parsedData);
                    break;
                case ANSWER:
                    handleAnswer(parsedData);
                    break;
                case ICECANDIDATE:
                    handleNewIceCandidate(parsedData);
                    break;
                case LEAVE:
                    endCall(true);
                    break;
                default:
                    console.error('error', parsedData);
                    break;
            }
        });
    })();
    // should return an empty JSX fragment
    return (react_1.default.createElement(react_1.default.Fragment, null));
};
exports.default = Socket;
