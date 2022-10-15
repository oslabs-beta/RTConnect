"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Socket_1 = __importDefault(require("./Socket"));
const VideoComponent_1 = __importDefault(require("./VideoComponent"));
const actions_1 = __importDefault(require("../constants/actions"));
const { LOGIN, ICECANDIDATE, OFFER, ANSWER, LEAVE } = actions_1.default;
/**
 * @desc Wrapper component containing logic necessary for P2P connections using WebRTC (RTCPeerConnect API + MediaSession API) and Websockets.
 * Any client can call another thus not all functions are invoked for every user.
 * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection, which we connected in our backend using RTConnect's importable  SignalingChannel
 * @param {string} this.props.URL
 * @returns A component that renders two VideoComponents (currently not dynamic), a
 */
//mediaOptions: { controls: boolean, style: { width: string, height: string }
const VideoCall = ({ URL, mediaOptions }) => {
    //username will store a name the client enters and users (see getUsers) will be updated whenever a user logs in or leaves
    const [username, setUsername] = (0, react_1.useState)('');
    const [users, setUsers] = (0, react_1.useState)();
    // const [message, setMessage] = useState<string>();
    // useRef allows our variables to be stored in Immutable Objects and do not force page re-renders when its value is changed
    // The Websocket connection is made later in useEffect once the component mounts then we render <Socket>, an empty component but adds event listeners to the socket
    const ws = (0, react_1.useRef)(null);
    const localVideo = (0, react_1.useRef)(null);
    const remoteVideo = (0, react_1.useRef)(null);
    const peerRef = (0, react_1.useRef)(null);
    const otherUser = (0, react_1.useRef)();
    const localStream = (0, react_1.useRef)(null);
    const senders = (0, react_1.useRef)([]);
    //maybe try to use context/reference hooks here for html input elements
    let userField = '';
    let receiver = '';
    // this configuration defines the parameters for how an RTCPeerConnection should be created, also ice trickling is enabled with iceCandidatePoolSize set to a value
    // stun servers are used to identify users so that peers can connect to eachother directly without the use of a middleman server (which would create latency)
    //'stun:stun2.l.google.com:19302', an additional ice server
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun1.l.google.com:19302',
            },
        ],
        iceCandidatePoolSize: 10,
    };
    // These constraints will be used for our webcam video stream quality
    const constraints = {
        video: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 },
        },
        audio: true
    };
    // a new one-time websocket connection is made on component mount and a permissions request for the client's video and audio is made
    (0, react_1.useEffect)(() => {
        ws.current = new WebSocket(URL);
        openUserMedia();
    }, []);
    /**
     * A diagram of the WebRTC Connection logic
     * Peer A  Stun    Signaling Channel(Websockets)  Peer B   Step
     *  |------>|                   |                   |       Who Am I? + RTCPeerConnection(configuration) this contains methods to connect to a remote Peer
     *  |<------|                   |                   |       Symmetric NAT (your ip that you can be connected to)
     *  |-------------------------->|------------------>|       Calling Peer B, Offer SDP is generated and sent over websockets
     *  |-------------------------->|------------------>|       ICE Candidates are also being trickled in, where and what IP:PORT can Peer B connect to Peer A
     *  |       |<------------------|-------------------|       Who Am I? PeerB this time!
     *  |       |-------------------|------------------>|       Peer B's NAT
     *  |<--------------------------|-------------------|       Accepting Peer A's call, sending Answer SDP
     *  |<--------------------------|-------------------|       Peer B's ICE Candidates are now being trickled in to peer A for connectivity.
     *  |-------------------------->|------------------>|       ICE Candidates from Peer A, these steps repeat and are only necessary if Peer B can't connect to the earlier candidates sent.
     *  |<--------------------------|-------------------|       ICE Candidate trickling from Peer B, could also take a second if there's a firewall to be circumvented.
     *  |       |                   |                   |       Connected! Peer to Peer connection is made and now both users are streaming data to eachother!
     *
     * If Peer A starts a call their order of functions being invoked is... handleOffer --> callUser --> createPeer --> peerRef.current.negotiationNeeded event (handleNegotiationNeededEvent) --> ^send Offer SDP^ --> start ICE trickle, handleIceCandidateEvent --> ^receive Answer^ SDP --> handleIceCandidateMsg --> once connected, handleTrackEvent
     * If Peer B receives a call then we invoke... ^Receive Offer SDP^ --> handleReceiveCall --> createPeer --> ^send Answer SDP^ --> handleIceCandidateMsg --> handleIceCandidateEvent --> once connected, handleTrackEvent
     *
     * Note: Media is attached to the Peer Connection and sent along with the offers/answers to describe what media each client has. (see RTCPeerConnection.addTrack() MDN)
     */
    /**
    * @desc An event triggered on a button click.
    * Once the client enters and submits a name in the username field, this name is set stored in the WebSocketServer along with the socket
    * that sent the name to later send messages to the right client using this socket.
    */
    const handleUsername = () => {
        const loginPayload = {
            ACTION_TYPE: LOGIN,
            payload: userField,
        };
        ws.current.send(JSON.stringify(loginPayload));
        setUsername(userField);
    };
    // const handleChange = (e): void => {
    //   setMessage(e.target.value)
    // }
    /**
     * @desc When a name is entered and submitted into the input field, this starts the Offer-Answer Model exchange
     */
    const handleOffer = () => {
        const inputField = document.querySelector('#receiverName');
        if (inputField) {
            receiver = inputField.value;
            inputField.value = '';
            otherUser.current = receiver;
            callUser(receiver);
        }
    };
    /**
    * @desc When data is received from the WebSocketServer, this function is invoked.
    * Based off of the users connected, each user is displayed in a div.
    * @param {Array<string>} parsedData
    * @returns Re-renders the page with the new User List
    */
    const getUsers = (parsedData) => {
        const userList = parsedData.payload.map((name, idx) => (react_1.default.createElement("div", { key: idx }, name)));
        setUsers(userList);
    };
    /**
    * @desc Asks for the client's permissions to open their webcam and microphone.
    */
    const openUserMedia = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (localVideo.current) {
                localStream.current = localVideo.current.srcObject = yield navigator.mediaDevices.getUserMedia(constraints);
            }
        }
        catch (error) {
            console.log('Error in openUserMedia: ', error);
        }
    });
    /**
    * @desc Constructs a new RTCPeerConnection object that also adds the local client's media tracks to this object.
    * @param {string} userID
    */
    const callUser = (userID) => {
        peerRef.current = createPeer(userID);
        localStream.current.getTracks().forEach((track) => senders.current.push(peerRef.current.addTrack(track, localStream.current)));
    };
    /**
    * @desc Creates a new RTCPeerConnection object, which represents a WebRTC connection between the local device and a remote peer and adds event listeners to it
    * @param {string} userID
    * @returns {RTCPeerConnection} RTCPeerConnection object
    * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event and other events
    */
    const createPeer = (userID) => {
        const peer = new RTCPeerConnection(configuration);
        peer.onicecandidate = handleIceCandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
        console.log('registerPeerConnectionListners has activated');
        peer.addEventListener('negotiationneeded', () => {
            console.log('negotiationneeded event has fired');
        });
        peer.addEventListener('icegatheringstatechange', () => {
            var _a;
            console.log(`ICE gathering state changed: ${(_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.iceGatheringState}`);
        });
        peer.addEventListener('connectionstatechange', () => {
            var _a;
            console.log(`Connection state change: ${(_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.connectionState}`);
            console.log(peerRef.current);
        });
        peer.addEventListener('signalingstatechange', () => {
            var _a;
            console.log(`Signaling state change: ${(_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.signalingState}`);
        });
        peer.addEventListener('iceconnectionstatechange ', () => {
            var _a;
            console.log(`ICE connection state change: ${(_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.iceConnectionState}`);
        });
        return peer;
    };
    /**
    * @desc invokes WebRTC's built-in createOffer() function to create an SDP offer, which is an RTCSessionDescription object. This offer is then set as the local description using WebRTC's built-in setLocalDescription() function. Finally, the offer, sender and receiver is sent via ws.current.send to the Signaling Channel in the backend
    * @param {string} userID
    */
    function handleNegotiationNeededEvent(userID) {
        var _a;
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.createOffer().then((offer) => {
            var _a;
            return (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.setLocalDescription(offer);
        }).then(() => {
            var _a;
            const offerPayload = {
                ACTION_TYPE: OFFER,
                sender: username,
                receiver: userID,
                payload: (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.localDescription
            };
            ws.current.send(JSON.stringify(offerPayload));
        }).catch(e => console.log(e));
    }
    /**
    * @desc When an offer is received from the SignalingChannel, this function is invoked, creating a new RTCPeerConnection with the local client's media attached and an Answer is created that is then sent back to the original caller through the websocket connection.
    * @param {RTCSessionDescriptionInit} data
    * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
    */
    function handleReceiveCall(data) {
        otherUser.current = data.sender;
        peerRef.current = createPeer(data.sender);
        const desc = new RTCSessionDescription(data.payload);
        peerRef.current.setRemoteDescription(desc)
            .then(() => {
            var _a;
            (_a = localStream.current) === null || _a === void 0 ? void 0 : _a.getTracks().forEach((track) => { var _a; return (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.addTrack(track, localStream.current); });
        })
            .then(() => {
            var _a;
            return (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.createAnswer();
        })
            .then(answer => {
            var _a;
            return (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.setLocalDescription(answer);
        })
            .then(() => {
            var _a;
            const answerPayload = {
                ACTION_TYPE: ANSWER,
                receiver: data.sender,
                sender: username,
                payload: (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.localDescription
            };
            ws.current.send(JSON.stringify(answerPayload));
        });
    }
    /**
    * @desc The local client's remote description is set as the incoming Answer SDP to define who we are trying to connect to on the other end of the connection.
    * @param {object} data SDP answer
    */
    function handleAnswer(data) {
        var _a;
        const remoteDesc = new RTCSessionDescription(data.payload);
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.setRemoteDescription(remoteDesc).catch((e) => console.log(e));
    }
    /**
    * @desc As the local client's ICE Candidates are being generated, they are being sent to the remote client to complete the connection
    * @param {RTCPeerConnectionIceEvent} e
    */
    function handleIceCandidateEvent(e) {
        if (e.candidate) { // Contains the RTCIceCandidate containing the candidate associated with the event,
            const IcePayload = {
                ACTION_TYPE: ICECANDIDATE,
                receiver: otherUser.current,
                payload: e.candidate,
            };
            ws.current.send(JSON.stringify(IcePayload));
        }
    }
    /**
    * @desc ICE Candidates being sent from each end of the connection are added to a list of potential connection methods until both ends have a way of connecting to eachother
    * @param {Object} data containing a property payload with an incoming ICE Candidate
    */
    function handleNewIceCandidate(data) {
        var _a;
        const candidate = new RTCIceCandidate(data.payload);
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.addIceCandidate(candidate).catch((e) => console.log(e));
    }
    /**
    * @desc Once the connection is made, the RTCRtpReceiver interface is exposed and this function is then able to extract the MediaStreamTrack from the sender's RTCPeerConnection.
    * @param {RTCTrackEvent} e An Event Object, also contains the stream
    */
    function handleTrackEvent(e) {
        remoteVideo.current.srcObject = e.streams[0];
    }
    /**
    * @desc Enables screen sharing using MediaSession.getDisplayMedia()
    */
    function shareScreen() {
        //TODOS: On a new connection the local and streamed screen bugs producing: Rtconnect.jsx:273 Uncaught (in promise) DOMException: The peer connection is closed.
        navigator.mediaDevices.getDisplayMedia()
            .then(stream => {
            var _a, _b;
            const screenTrack = stream.getTracks()[0];
            (_b = (_a = senders.current) === null || _a === void 0 ? void 0 : _a.find(sender => { var _a; return ((_a = sender.track) === null || _a === void 0 ? void 0 : _a.kind) === 'video'; })) === null || _b === void 0 ? void 0 : _b.replaceTrack(screenTrack);
            localVideo.current.srcObject = stream; // changing local video to reflect what we're sharing to the other end of the connection
            screenTrack.onended = function () {
                var _a, _b;
                (_b = (_a = senders.current) === null || _a === void 0 ? void 0 : _a.find(sender => { var _a; return ((_a = sender.track) === null || _a === void 0 ? void 0 : _a.kind) === 'video'; })) === null || _b === void 0 ? void 0 : _b.replaceTrack(localStream.current.getTracks()[1]);
                localVideo.current.srcObject = localStream.current; // changing local video displayed back to webcam
            };
        });
    }
    /**
    * @desc if any client chooses to end their call then the person who ends the call first closes their connection and resets the remote video component while also sending a message to the remote peer to also go through the same process.
    * @param {boolean} isEnded
    */
    function endCall(isEnded) {
        var _a, _b, _c;
        const LeavePayload = {
            ACTION_TYPE: LEAVE,
            receiver: otherUser.current,
        };
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.close();
        isEnded ? (_b = peerRef.current) === null || _b === void 0 ? void 0 : _b.close() : (_c = ws.current) === null || _c === void 0 ? void 0 : _c.send(JSON.stringify(LeavePayload));
        remoteVideo.current.srcObject = null;
    }
    const buttonStyling = {
        backgroundColor: '#C2FBD7',
        borderRadius: '50px',
        borderWidth: '0',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
        color: '#008000',
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '1em',
        height: '50px',
        padding: '0 25px',
    };
    /* 'conditionally rendering' if websocket has a value otherwise on page re-rendering events
    multiple websocket connections will be made and error
    every user when one closes their browser
    */
    return (react_1.default.createElement(react_1.default.Fragment, null,
        ws.current ?
            react_1.default.createElement(Socket_1.default, { ws: ws.current, getUsers: getUsers, handleReceiveCall: handleReceiveCall, handleAnswer: handleAnswer, handleNewIceCandidate: handleNewIceCandidate, endCall: endCall })
            : '',
        react_1.default.createElement("div", { className: '', style: { display: 'flex', justifyContent: 'space-around', flexDirection: 'column', padding: '10px', marginTop: '10%' } },
            username === '' ? react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: 'input-div', style: { display: 'flex', flexDirection: 'column', top: '2%', left: '2%', margin: '0 auto', height: '100px', width: '100px', justifyContent: 'center', alignItems: 'center' } },
                    react_1.default.createElement("input", { className: '', type: 'text', placeholder: 'username', id: "username-field", onChange: (e) => userField = e.target.value, style: { paddingBottom: '40px', width: '200px' } }),
                    react_1.default.createElement("button", { className: '', onClick: () => handleUsername(), style: buttonStyling }, "Submit Username"))) :
                react_1.default.createElement("div", { className: 'users-list', style: { fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '16px' } },
                    "Users connected: ",
                    users),
            react_1.default.createElement("div", { id: "main-video-container", className: '', style: { display: 'flex', flexDirection: 'row', gap: '100px', justifyContent: 'center', alignItems: 'center' } },
                react_1.default.createElement("div", { id: "local-video-container", className: '', style: { display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' } },
                    react_1.default.createElement(VideoComponent_1.default, { video: localVideo, mediaOptions: mediaOptions }),
                    react_1.default.createElement("div", { id: "local-button-container", className: '', style: { display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', marginTop: '10px' } },
                        react_1.default.createElement("button", { className: '', onClick: () => shareScreen(), style: buttonStyling }, "Share Screen"),
                        react_1.default.createElement("button", { className: '', onClick: () => endCall(false), style: Object.assign(Object.assign({}, buttonStyling), { backgroundColor: '#ff6961', color: '#28282B' }) }, "End Call"))),
                react_1.default.createElement("div", { id: "remote-video-container", className: '', style: { display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' } },
                    react_1.default.createElement(VideoComponent_1.default, { video: remoteVideo, mediaOptions: mediaOptions }),
                    react_1.default.createElement("div", { id: "remote-button-container", className: '', style: { display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', marginTop: '10px' } },
                        react_1.default.createElement("button", { className: '', onClick: handleOffer, style: buttonStyling }, "Call"),
                        react_1.default.createElement("input", { className: '', type: 'text', id: 'receiverName', style: { marginLeft: '2%' } })))))));
};
exports.default = VideoCall;
