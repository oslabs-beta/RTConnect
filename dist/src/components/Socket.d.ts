/// <reference types="react" />
/**
 *  @file Socket.tsx is the component that initalizes and loads the client's socket connection with event listeners.
 */
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
declare const Socket: ({ ws, getUsers, handleReceiveCall, handleAnswer, handleNewIceCandidate, endCall }: SocketType) => JSX.Element;
export default Socket;
