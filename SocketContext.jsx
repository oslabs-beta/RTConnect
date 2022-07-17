import React, { createContext, useState, useEffect, useRef } from "react";
import { LOGIN } from "./lib/src/constants/actions";

// create context
const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  // the value that will be given to the context
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [userField, setUserField] = useState(null);
  const [receiver, setReceiver] = useState(null);

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef(); // RTCPeerConnection Object
  const otherUser = useRef();
  const localStream = useRef('stream');
  const senders = useRef([]);

  // let userField = null;
  // let receiver = null;

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
        width:{ min:640, ideal:1920, max:1920 },
        height:{ min:480, ideal:1080, max:1080 },
    },
    audio: true
  }

  const getUsers = (data) => {
    const userList = data.payload.map(name => (
      <div>{name}</div>
    ))
    setUsers(userList);
  }

  const handleUsername = () => {
    const loginPayload = {
      ACTION_TYPE: LOGIN, 
      payload: userField
    }
    console.log(userField);
    
    ws.send(JSON.stringify(loginPayload))
    setUsername(userField);
  }

  const handleOffer = () => {
    let inputField = document.querySelector('#receiverName');
    receiver = inputField.value;
    inputField.value = ''
    otherUser.current = receiver;
    callUser(receiver);
  }

  function handleReceiveCall(data) {
    otherUser.current = data.sender;
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(data.payload);
    peerRef.current.setRemoteDescription(desc)
    .then(() => {
        localStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, localStream.current));
    })
    .then(() => {
        return peerRef.current.createAnswer();
    })
    .then(answer => {
        return peerRef.current.setLocalDescription(answer);
    })
    .then(() => {
        const answerPayload = {
            ACTION_TYPE: ANSWER,
            receiver: data.sender,
            sender: username,
            payload: peerRef.current.localDescription
        }
        ws.send(JSON.stringify(answerPayload));
    })
  }
  function handleAnswer(data) {
    const answerSDP = new RTCSessionDescription(data.payload);
    peerRef.current.setRemoteDescription(answerSDP).catch(e => console.log(e));
  }

  function handleNewIceCandidateMsg(data) {
    const candidate = new RTCIceCandidate(data.payload);

    peerRef.current.addIceCandidate(candidate)
        .catch(e => console.log(e));
  }

  const openUserMedia = async () => {
    try {
        localStream.current = localVideo.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
      } catch (error) {
        console.log('localStream', localStream)

        console.log('Error in openUserMedia: ', error);
    }
  }

  const callUser = (userID) => {
    peerRef.current = createPeer(userID);
    localStream.current.getTracks().forEach(track => senders.current.push(peerRef.current.addTrack(track, localStream.current)));
  }

  const createPeer = (userID) => {
    const peer = new RTCPeerConnection(configuration)
    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    console.log('registerPeerConnectionListners has activated');

    peer.addEventListener('negotiationneeded', () => {
        console.log(`negotiationneeded event has fired`);
    });

    peer.addEventListener('icegatheringstatechange', () => {
      console.log(`ICE gathering state changed: ${peerRef.current.iceGatheringState}`);
    });
  
    peer.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerRef.current.connectionState}`);
      console.log(peerRef.current);
    });
  
    peer.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerRef.current.signalingState}`);
    });
  
    peer.addEventListener('iceconnectionstatechange ', () => {
      console.log(`ICE connection state change: ${peerRef.current.iceConnectionState}`);
    });

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current.createOffer()
      .then(offer => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const offerPayload = {
          ACTION_TYPE: OFFER,
          sender: username,
          receiver: userID,
          payload: peerRef.current.localDescription
        };
        ws.send(JSON.stringify(offerPayload));
      })
      .catch(e => console.log(e));
}

function handleIceCandidateEvent(e) {
  if (e.candidate) {
    const IcePayload = {
      ACTION_TYPE: ICECANDIDATE,
      receiver: otherUser.current,
      payload: e.candidate,
    }
    ws.send(JSON.stringify(IcePayload));
  }
}

function handleTrackEvent(e) {
    remoteVideo.current.srcObject = e.streams[0];
};

//media constraints
//server.ts module needs port and https server object configuration
//
// experimental share screen function for a button
// function shareScreen() {
//     navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
//         const screenTrack = stream.getTracks()[0];
//         senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
//         screenTrack.onended = function() {
//             senders.current.find(sender => sender.track.kind === "video").replaceTrack(localStream.current.getTracks()[1]);
//         }
//     })
// }
// <RTConnectVideo WS: ws://localhost:3001' />


  const providerValue = {
    getUsers,
    openUserMedia,
    handleUsername,
    handleOffer,
    callUser,
    createPeer,
    handleNegotiationNeededEvent,
    handleReceiveCall,
    handleAnswer,
    handleIceCandidateEvent,
    handleNewIceCandidateMsg,
    handleTrackEvent,
    localVideo,
    remoteVideo,
    peerRef,
    otherUser,
    users,
    receiver,
    setUsers,
    setUserField,
    setReceiver
  };

  return(
    <SocketContext.Provider value={providerValue}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketContextProvider }