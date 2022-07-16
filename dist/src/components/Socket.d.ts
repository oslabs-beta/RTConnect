/// <reference types="react" />
declare type SocketType = {
    ws: WebSocket;
    getUsers: (parsedData: []) => void;
    handleReceiveCall: (parsedData: object) => void;
    handleAnswer: (parsedData: object) => void;
    handleNewIceCandidateMsg: (parsedData: object) => void;
};
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: SocketType) => JSX.Element;
export default Socket;
