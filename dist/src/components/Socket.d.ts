/// <reference types="react" />
declare type SocketType = {
    ws: WebSocket;
    getUsers: (val: []) => void;
    handleReceiveCall: (val: object) => void;
    handleAnswer: (val: object) => void;
    handleNewIceCandidateMsg: (val: object) => void;
};
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: SocketType) => JSX.Element;
export default Socket;
