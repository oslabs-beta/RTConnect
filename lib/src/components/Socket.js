"use strict";
exports.__esModule = true;
var react_1 = require("react");
var actions_js_1 = require("../constants/actions.js");
var LOGIN = actions_js_1["default"].LOGIN, ICECANDIDATE = actions_js_1["default"].ICECANDIDATE, OFFER = actions_js_1["default"].OFFER, ANSWER = actions_js_1["default"].ANSWER;
var Socket = function (_a) {
    //<Socket ws={ws} getUsers={getUsers} handleReceiveCall={handleReceiveCall} handleAnswer={handleAnswer} handleNewIceCandidateMsg={handleNewIceCandidateMsg} />
    var ws = _a.ws, getUsers = _a.getUsers, handleReceiveCall = _a.handleReceiveCall, handleAnswer = _a.handleAnswer, handleNewIceCandidateMsg = _a.handleNewIceCandidateMsg;
    //potentially use immediately invoked function expression
    var initalizeConnection = function () {
        ws.addEventListener('open', function () {
            console.log('Websocket connection has opened.');
        });
        ws.addEventListener('close', function () {
            console.log('Websocket connection closed.');
        });
        ws.addEventListener('error', function (e) {
            console.error('Socket Error:', e);
        });
        ws.addEventListener('message', function (message) {
            var parsedData = JSON.parse(message.data);
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
    };
    initalizeConnection();
    return (<>
        </>);
};
exports["default"] = Socket;
