/// <reference types="react" />
declare type SocketType = {
    ws: WebSocket;
    getUsers: Function;
    handleReceiveCall: Function;
    handleAnswer: Function;
    handleNewIceCandidateMsg: Function;
};
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: SocketType) => JSX.Element;
export default Socket;
