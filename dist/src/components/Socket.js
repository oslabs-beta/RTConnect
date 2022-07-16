"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const actions_1 = __importDefault(require("../constants/actions"));
const { LOGIN, ICECANDIDATE, OFFER, ANSWER } = actions_1.default;
const Socket = ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }) => {
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
                    handleNewIceCandidateMsg(parsedData);
                    break;
                default:
                    console.error('error', parsedData);
                    break;
            }
        });
    })();
    return (react_1.default.createElement(react_1.default.Fragment, null));
};
exports.default = Socket;
