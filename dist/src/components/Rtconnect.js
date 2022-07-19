"use strict";
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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const react_1 = __importStar(require("react"));
const Socket_1 = __importDefault(require("./Socket"));
const VideoComponent_1 = __importDefault(require("./VideoComponent"));
const actions_1 = __importDefault(require("../constants/actions"));
const { LOGIN, ICECANDIDATE, OFFER, ANSWER, LEAVE } = actions_1.default;
const Rtconnect = ({ URL }) => {
    const [username, setUsername] = (0, react_1.useState)('');
    const [users, setUsers] = (0, react_1.useState)();
    // const [userField, setUserField] = useState('')
    const ws = (0, react_1.useRef)(null);
    const localVideo = (0, react_1.useRef)(null);
    const remoteVideo = (0, react_1.useRef)(null);
    const peerRef = (0, react_1.useRef)(null);
    // const test = useRef<T>(initialValue: T): MutableRefObject<T>
    const otherUser = (0, react_1.useRef)();
    const localStream = (0, react_1.useRef)(null);
    const senders = (0, react_1.useRef)([]);
    //maybe try to use context/reference hooks here
    let userField = '';
    let receiver = '';
    //'stun:stun2.l.google.com:19302',
    const configuration = {
        iceServers: [
            {
                urls: 'stun:stun1.l.google.com:19302',
            },
        ],
        iceCandidatePoolSize: 10,
    };
    const constraints = {
        video: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 },
        },
        audio: true
    };
    // const offerPayload: payloadObj = {
    //   ACTION_TYPE: OFFER,
    //   sender: username,
    //   receiver: userID,
    //   payload: peerRef.current.localDescription
    // };
    (0, react_1.useEffect)(() => {
        console.log('hi, where am  i');
        ws.current = new WebSocket(`ws://${URL}`);
        openUserMedia();
    }, []);
    const handleUsername = () => {
        const loginPayload = {
            ACTION_TYPE: LOGIN,
            payload: userField,
        };
        ws.current.send(JSON.stringify(loginPayload));
        setUsername(userField);
    };
    const handleOffer = () => {
        const inputField = document.querySelector('#receiverName');
        if (inputField) {
            receiver = inputField.value;
            inputField.value = '';
            otherUser.current = receiver;
            callUser(receiver);
        }
    };
    const getUsers = (parsedData) => {
        const userList = parsedData.payload.map((name, idx) => (react_1.default.createElement("div", { key: idx }, name)));
        setUsers(userList);
    };
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
    const callUser = (userID) => {
        peerRef.current = createPeer(userID);
        localStream.current.getTracks().forEach((track) => { var _a; return senders.current.push((_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.addTrack(track, localStream.current)); });
    };
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
    function handleAnswer(data) {
        var _a;
        const answerSDP = new RTCSessionDescription(data.payload);
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.setRemoteDescription(answerSDP).catch((e) => console.log(e));
    }
    function handleIceCandidateEvent(e) {
        if (e.candidate) {
            const IcePayload = {
                ACTION_TYPE: ICECANDIDATE,
                receiver: otherUser.current,
                payload: e.candidate,
            };
            ws.current.send(JSON.stringify(IcePayload));
        }
    }
    function handleNewIceCandidateMsg(data) {
        var _a;
        const candidate = new RTCIceCandidate(data.payload);
        (_a = peerRef.current) === null || _a === void 0 ? void 0 : _a.addIceCandidate(candidate).catch((e) => console.log(e));
    }
    function handleTrackEvent(e) {
        remoteVideo.current.srcObject = e.streams[0];
    }
    //media constraints
    //server.ts module needs port and https server object configuration
    // experimental share screen function for a button
    function shareScreen() {
        //Rtconnect.jsx:273 Uncaught (in promise) DOMException: The peer connection is closed.
        navigator.mediaDevices.getDisplayMedia().then(stream => {
            var _a, _b;
            console.log('shareScreen stream', stream);
            const screenTrack = stream.getTracks()[0];
            (_b = (_a = senders.current) === null || _a === void 0 ? void 0 : _a.find(sender => { var _a; return ((_a = sender.track) === null || _a === void 0 ? void 0 : _a.kind) === 'video'; })) === null || _b === void 0 ? void 0 : _b.replaceTrack(screenTrack);
            screenTrack.onended = function () {
                var _a, _b;
                (_b = (_a = senders.current) === null || _a === void 0 ? void 0 : _a.find(sender => { var _a; return ((_a = sender.track) === null || _a === void 0 ? void 0 : _a.kind) === 'video'; })) === null || _b === void 0 ? void 0 : _b.replaceTrack(localStream.current.getTracks()[1]);
            };
        });
    }
    //still need to reflect changes from latest commit from workingdemo branch to this file
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
    return (react_1.default.createElement(react_1.default.Fragment, null,
        users,
        react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column', top: '20%', left: '28%', margin: '0 auto', marginTop: '10%', height: '500px', width: '600px', borderStyle: 'solid', borderRadius: '25px', justifyContent: 'center', alignItems: 'center' } },
            react_1.default.createElement("input", { type: 'text', placeholder: 'username', id: "username-field", onChange: (e) => userField = e.target.value, style: { paddingBottom: '70px', width: '200px' } }),
            react_1.default.createElement("button", { onClick: () => handleUsername() }, "Submit Username")),
        ws.current ? react_1.default.createElement(Socket_1.default, { ws: ws.current, getUsers: getUsers, handleReceiveCall: handleReceiveCall, handleAnswer: handleAnswer, handleNewIceCandidateMsg: handleNewIceCandidateMsg, endCall: endCall }) : '',
        react_1.default.createElement("div", { style: { display: 'flex', justifyContent: 'space-around', border: '1px solid black', flexDirection: 'column', padding: '10px', marginTop: '10%' } },
            react_1.default.createElement("div", { id: "main-video-container", style: { display: 'flex', flexDirection: 'row', gap: '100px', justifyContent: 'center', alignItems: 'center' } },
                react_1.default.createElement("div", { id: "local-video-container" },
                    react_1.default.createElement(VideoComponent_1.default, { video: localVideo })),
                react_1.default.createElement("div", { id: "remote-video-container" },
                    react_1.default.createElement(VideoComponent_1.default, { video: remoteVideo })))),
        react_1.default.createElement("div", { id: "button-container", style: { display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', marginTop: '10px' } },
            react_1.default.createElement("button", { onClick: () => shareScreen() }, "Share Screen"),
            react_1.default.createElement("button", { onClick: () => endCall(false) }, "End Call"),
            react_1.default.createElement("button", { onClick: handleOffer, style: { marginBottom: '25px', marginLeft: '400px', width: '200px' } }, "Enter receiver name"),
            react_1.default.createElement("input", { type: 'text', id: 'receiverName', style: { marginBottom: '3px' } }))));
};
exports.default = Rtconnect;
