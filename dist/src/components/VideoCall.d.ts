/// <reference types="react" />
/**
 * @desc Wrapper component containing logic necessary for P2P connections using WebRTC (RTCPeerConnect API + MediaSession API) and WebSockets.
 * Any client can call another thus not all functions are invoked for every user.
 * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection, which we connected in our backend using RTConnect's importable  SignalingChannel
 * @param {string} this.props.URL
 * @returns A component that renders two VideoComponents (currently not dynamic), a
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
