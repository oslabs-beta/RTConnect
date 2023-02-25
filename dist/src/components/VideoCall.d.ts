/// <reference types="react" />
/**
 * @desc Wrapper component containing the logic necessary for peer connections using WebRTC APIs (RTCPeerConnect API + MediaSession API) and WebSockets.
 *
 * ws, localVideo, remoteVideo, peerRef, localStream, otherUser, senders are all mutable ref objects that are created using the useRef hook. The useRef hook allows you to persist values between renders and it is used to store a mutable value that does NOT cause a re-render when updated.
 *
 * The WebSocket connection (ws.current) is established using the useEffect hook and once the component mounts, the Socket component is rendered. The Socket component adds event listeners that handle the offer-answer model and the exchange of SDP objects between peers and the socket.
 *
 * The WebSocket message event will filter through various events to determine the payloads that will be sent to other serverside socket connection via WebSocket.
 *
 * @type {object} ws is the mutable ref object that contains the WebSocket object (ws.current). The ws.current WebSocket object will be created using the useEffect hook and it will establish the WebSocket connection to the server.
 * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection and this WebSocket connection is connected to the server by using RTConnect's importable SignalingChannel module.
 * @type {state} username - username state stores the name the client enters. All users (see getUsers) will be able to see an updated list of all other users whenever a new user logs in or leaves.
 * @type {state} users - users state is the list of connected users that is rendered on the frontend.
 *
 * @param {Object} props
 * @param {String} props.URL - ws or wss link
 * @param {object} props.mediaOptions video embed attributes
 * @returns A component that renders two VideoComponents,
 */
declare const VideoCall: ({ URL, mediaOptions }: {
    URL: string;
    mediaOptions: {
        controls: boolean;
        style: {
            width: string;
            height: string;
        };
    };
}) => JSX.Element;
export default VideoCall;
