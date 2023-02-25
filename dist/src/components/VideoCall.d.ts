/// <reference types="react" />
/**
 * @desc Wrapper component containing the logic necessary for P2P connections using WebRTC APIs (RTCPeerConnect API + MediaSession API) and WebSockets.
 *
 * Any client can call another client and thus not all functions are invoked for every user.
 *
 * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection and this WebSocket connection is connected to the server by using RTConnect's importable SignalingChannel module.
 *
 * @param {object} props
 * @param {string} props.URL ws or wss link
 * @param {object} props.mediaOptions video embed attributes
 * @returns A component that renders two VideoComponents
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
