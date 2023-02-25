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
    handleNewIceCandidate: (data: {
        payload: RTCIceCandidateInit;
    }) => void;
    endCall: (parsedData: boolean) => void;
};
/**
 * @desc Using the initial WebSocket connection, this functional component provides the event listeners for each client's socket connection to allow bilateral communication.
 * @param props ws is the socket that will initiate the connection with the WebSocket server and getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidate, endCall are the functions that are executed upon on each switch case event.
 * @returns an empty element when rendered and populates the client's socket connection with event listeners that can handle the offer-answer model and SDP objects being exchanged between peers.
 */
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidate, endCall }: SocketType) => JSX.Element;
export default Socket;
