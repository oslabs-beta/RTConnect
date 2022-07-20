/// <reference types="react" />
declare type SocketType = {
    ws: WebSocket;
    getUsers: (parsedData: {
        payload: string[];
    }) => void;
    handleReceiveCall: (data: {
        sender: string;
        payload: RTCSessionDescriptionInit;
    }) => void;
    handleAnswer: (parsedData: {
        payload: RTCSessionDescriptionInit;
    }) => void;
    handleNewIceCandidateMsg: (data: {
        payload: RTCIceCandidateInit;
    }) => void;
    endCall: (parsedData: boolean) => void;
};
/**
 * @desc Using the initial websocket connection, this functional component provides the event listeners for each client socket to allow bi-lateral communication.
 * @param props containing the socket starting the connection with the websocket server and functions to be performed on each switch case event
 * @returns an empty element when rendered but populates the client's socket connection with event listeners to be able to handle the offer-answer model and SDP objects being communicated between both peers.
 */
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidateMsg, endCall }: SocketType) => JSX.Element;
export default Socket;
