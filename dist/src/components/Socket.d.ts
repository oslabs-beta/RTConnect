/// <reference types="react" />
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg }: {
    ws: any;
    getUsers: any;
    handleReceiveCall: any;
    handleAnswer: any;
    handleNewIceCandidateMsg: any;
}) => JSX.Element;
export default Socket;
