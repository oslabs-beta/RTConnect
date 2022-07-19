/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';
import VideoComponent from './VideoComponent';
import actions from '../constants/actions';
const { LOGIN, ICECANDIDATE, OFFER, ANSWER, LEAVE } = actions;

// starting off with defining interfaces for payloads that will be sent to other socket connections over websockets.
interface payloadObj {
  ACTION_TYPE: string, 
  sender?: string,
  receiver?: string
}

interface loginPayObj extends payloadObj {
  payload: string
}

interface offerPayObj extends payloadObj {
  payload: RTCSessionDescription | null | undefined
}


const Rtconnect = ({ URL }: { URL: string}): JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [users, setUsers] = useState<JSX.Element[]>();
  // const [userField, setUserField] = useState('')

  const ws = useRef<WebSocket>(null!);
  const localVideo = useRef<HTMLVideoElement>(null!);
  const remoteVideo = useRef<HTMLVideoElement>(null!);
  const peerRef = useRef<RTCPeerConnection>(null!); 
  // const test = useRef<T>(initialValue: T): MutableRefObject<T>
  const otherUser = useRef<string>(); 
  const localStream = useRef<MediaStream>(null!);
  const senders = useRef<RTCRtpSender[]>([]);

  //maybe try to use context/reference hooks here
  let userField = '';
  let receiver: string | null = '';

  //'stun:stun2.l.google.com:19302',
  const configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const constraints: MediaStreamConstraints = {
    video: {
      width: { min:640, ideal:1920, max:1920 },
      height: { min:480, ideal:1080, max:1080 },
    },
    audio: true
  };
  
  // const offerPayload: payloadObj = {
  //   ACTION_TYPE: OFFER,
  //   sender: username,
  //   receiver: userID,
  //   payload: peerRef.current.localDescription
  // };

  useEffect(() => {
    ws.current = new WebSocket(`ws://${URL}`);
    openUserMedia();
  },[]);

  const handleUsername = (): void => {

    const loginPayload: loginPayObj = {
      ACTION_TYPE: LOGIN, 
      payload: userField,
    };

    ws.current.send(JSON.stringify(loginPayload));
    setUsername(userField);
  };
    
  const handleOffer = (): void => {
    const inputField:HTMLInputElement | null = document.querySelector('#receiverName');

    if (inputField) {
      receiver = inputField.value;
      inputField.value = '';
      otherUser.current = receiver;
      callUser(receiver);
    }
  };

  const getUsers = (parsedData: {payload: string[]}): void => {
    const userList = parsedData.payload.map((name: string, idx:number) => (
      <div key={idx}>{name}</div>
    ));

    setUsers(userList);
  };

  const openUserMedia = async (): Promise<void> => {
    try {
      if (localVideo.current){
        localStream.current = localVideo.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
      }

    } catch (error) {
      console.log('Error in openUserMedia: ', error);
    }
  };

  const callUser = (userID: string): void => {
    if (peerRef.current) {
      peerRef.current = createPeer(userID);
      localStream.current.getTracks().forEach((track) => senders.current.push(peerRef.current.addTrack(track, localStream.current)));
    }
  };

  const createPeer = (userID: string): RTCPeerConnection => {
    const peer:RTCPeerConnection = new RTCPeerConnection(configuration);
    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    console.log('registerPeerConnectionListners has activated');

    peer.addEventListener('negotiationneeded', () => {
      console.log('negotiationneeded event has fired');
    });

    peer.addEventListener('icegatheringstatechange', () => {
      console.log(`ICE gathering state changed: ${peerRef.current?.iceGatheringState}`);
    });
      
    peer.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerRef.current?.connectionState}`);
      console.log(peerRef.current);
    });
      
    peer.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerRef.current?.signalingState}`);
    });
      
    peer.addEventListener('iceconnectionstatechange ', () => {
      console.log(`ICE connection state change: ${peerRef.current?.iceConnectionState}`);
    });

    return peer;
  };

  function handleNegotiationNeededEvent(userID: string): void {
    peerRef.current?.createOffer()
    .then((offer: object) => {
      return peerRef.current?.setLocalDescription(offer);
    })
    .then(() => {
      const offerPayload: offerPayObj = {
        ACTION_TYPE: OFFER,
        sender: username,
        receiver: userID,
        payload: peerRef.current?.localDescription
      };
      ws.current.send(JSON.stringify(offerPayload));
    })
    .catch(e => console.log(e));
  }

  function handleReceiveCall(data: { sender: string, payload: RTCSessionDescriptionInit }): void {
    otherUser.current = data.sender;
    peerRef.current = createPeer(data.sender);
    const desc = new RTCSessionDescription(data.payload);
    peerRef.current.setRemoteDescription(desc)
    .then(() => {
      localStream.current?.getTracks().forEach((track) => peerRef.current?.addTrack(track, localStream.current));
    })
    .then(() => {
      return peerRef.current?.createAnswer();
    })
    .then(answer => {
      return peerRef.current?.setLocalDescription(answer);
    })
    .then(() => {
      const answerPayload = {
        ACTION_TYPE: ANSWER,
        receiver: data.sender,
        sender: username,
        payload: peerRef.current?.localDescription
      };
      ws.current.send(JSON.stringify(answerPayload));
    });
  }

  function handleAnswer(data: {payload: RTCSessionDescriptionInit} ): void {
    const answerSDP = new RTCSessionDescription(data.payload);
    peerRef.current?.setRemoteDescription(answerSDP).catch((e) => console.log(e));
  }

  function handleIceCandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      const IcePayload = {
        ACTION_TYPE: ICECANDIDATE,
        receiver: otherUser.current,
        payload: e.candidate,
      };
      ws.current.send(JSON.stringify(IcePayload));
    }
  }

  function handleNewIceCandidateMsg(data: { payload: RTCIceCandidateInit }): void {
    const candidate = new RTCIceCandidate(data.payload);

    peerRef.current?.addIceCandidate(candidate)
    .catch((e) => console.log(e));
  }

  function handleTrackEvent(e: RTCTrackEvent) : void{
    remoteVideo.current.srcObject = e.streams[0];
  }

  //media constraints
  //server.ts module needs port and https server object configuration
  // experimental share screen function for a button
  function shareScreen(): void {
    //Rtconnect.jsx:273 Uncaught (in promise) DOMException: The peer connection is closed.
        
    navigator.mediaDevices.getDisplayMedia().then(stream => {
      console.log('shareScreen stream', stream);
      const screenTrack = stream.getTracks()[0];
      senders.current?.find(sender => sender.track?.kind === 'video')?.replaceTrack(screenTrack);
      screenTrack.onended = function() {
        senders.current?.find(sender => sender.track?.kind === 'video')?.replaceTrack(localStream.current.getTracks()[1]);
      };
    });
  }

  //still need to reflect changes from latest commit from workingdemo branch to this file
  function endCall(isEnded: boolean): void {
    const LeavePayload = {
      ACTION_TYPE: LEAVE,
      receiver: otherUser.current,
    };
    peerRef.current?.close();
    isEnded ? peerRef.current?.close() : ws.current?.send(JSON.stringify(LeavePayload));
    remoteVideo.current.srcObject = null;
  }


  return(
    <>
      {users}

      <div style={{display: 'flex', flexDirection:'column', top: '20%', left: '28%', margin: '0 auto', marginTop:'10%', height: '500px', width: '600px', borderStyle: 'solid', borderRadius: '25px', justifyContent: 'center', alignItems: 'center'}}>  
        <input 
          type='text' 
          placeholder='username' 
          id="username-field" 
          onChange={(e) => userField = e.target.value}
          style={{paddingBottom:'70px', width:'200px'}}
        ></input>
                
        <button 
          onClick={() => handleUsername()}
        >Submit Username</button>
      </div>

      {ws.current ? <Socket 
        ws={ws.current}
        getUsers={getUsers}
        handleReceiveCall={handleReceiveCall} 
        handleAnswer={handleAnswer} 
        handleNewIceCandidateMsg={handleNewIceCandidateMsg}
        endCall={endCall}
      /> : ''}
      {/* 'conditionally rendering' if websocket has a value otherwise on page re-rendering events multiple websocket connections will be made and error 
          every user when one closes their browser */}

      <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black', flexDirection:'column', padding:'10px', marginTop: '10%'} }>
        <div id="main-video-container" style= {{display: 'flex', flexDirection: 'row', gap: '100px', justifyContent:'center', alignItems:'center'}}>
          <div id="local-video-container">
            <VideoComponent video={localVideo}/>
          </div>
          <div id="remote-video-container">
            <VideoComponent video={remoteVideo} />
          </div>
        </div>
      </div>
                
      <div id="button-container" style= {{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent:'center', marginTop:'10px'}}>

        <button
          onClick={() => shareScreen()}
        >
          Share Screen
        </button>

        <button
          onClick={() => endCall(false)}
        >
          End Call
        </button> 
                    
        <button 
          onClick={handleOffer} 
          style={{marginBottom:'25px', marginLeft:'400px', width: '200px'}}
        >
          Enter receiver name
        </button>
                
        <input type='text' id='receiverName'style={{marginBottom:'3px'}}></input>
      </div>
    </>
  );
};

export default Rtconnect;
