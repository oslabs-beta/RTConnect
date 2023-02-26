/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useState, useRef, useEffect } from 'react';
import Socket from './Socket';
import VideoComponent from './VideoComponent';
import actions from '../constants/actions';
import constraints from '../constants/mediaStreamConstraints';
import configuration from '../constants/rtcConfiguration';
const { LOGIN, ICECANDIDATE, OFFER, ANSWER, LEAVE } = actions;

// These interfaces describe the different events that the WebSocket message event will filter through and the payloads that will be sent to other socket connections via webSocket. 
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

interface answerPayObj extends payloadObj {
  payload: RTCSessionDescription | null | undefined
}

interface icePayObj extends payloadObj {
  payload: RTCIceCandidate
}

/**
 * @desc Wrapper component containing the logic necessary for peer connections using WebRTC APIs (RTCPeerConnect API + MediaSession API) and WebSockets. 
 * 
 * ws, localVideo, remoteVideo, peerRef, localStream, otherUser, senders are all mutable ref objects that are created using the useRef hook. The useRef hook allows you to persist values between renders and it is used to store a mutable value that does NOT cause a re-render when updated.
 * 
 * The WebSocket connection (ws.current) is established using the useEffect hook and once the component mounts, the Socket component is rendered. The Socket component adds event listeners that handle the offer-answer model and the exchange of SDP objects between peers and the socket.
 * 
 * The WebSocket message event will filter through various events to determine the payloads that will be sent to other serverside socket connection via WebSocket.
 * 
 * @type {state} username - username state stores the name the client enters. All users (see getUsers) will be able to see an updated list of all other users whenever a new user logs in or leaves.
 * @type {state} users - users state is the list of connected users that is rendered on the frontend.
 * 
 * @param {Object} props
 * @param {String} props.URL - ws or wss link
 * @param {object} props.mediaOptions video embed attributes
 * @returns A component that renders two VideoComponents, 
 */
const VideoCall = ({ URL, mediaOptions }: { URL: string, mediaOptions: { controls: boolean, style: { width: string, height: string }}}): JSX.Element => {
 
  const [username, setUsername] = useState<string>('');

  const [users, setUsers] = useState<JSX.Element[]>();

  /**
   * @type {mutable ref WebSocket object} ws is the mutable ref object that contains the WebSocket object (ws.current). It cannot be null or undefined.
   * 
   * @desc The ws.current WebSocket object is created using the useEffect hook and it will establish the WebSocket connection to the server. This WebSocket connection is made on component mount and the function openUserMedia is invoked, which makes a permissions request for the client's video and audio.
   * 
   * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection and this WebSocket connection is connected to the server by using RTConnect's importable SignalingChannel module.
   */
  const ws = useRef<WebSocket>(null!);

  /**
   * @type {mutable ref object} localVideo - video stream of the local user. It will not be null or undefined.
   */
  const localVideo = useRef<HTMLVideoElement>(null!);

  /** 
   * @type {mutable ref object} remoteVideo - video stream of the remote user. It cannot be null or undefined.
   */
  const remoteVideo = useRef<HTMLVideoElement>(null!);

  /**
   * @type {mutable ref object} peerRef - It cannot be null or undefined.
   */
  const peerRef = useRef<RTCPeerConnection>(null!);

  /**
   * @type {mutable ref string} otherUser - 
   */
  const otherUser = useRef<string>();

  /**
   * @type {mutable ref object} localStream - It cannot be null or undefined.
   */
  const localStream = useRef<MediaStream>(null!);

  /**
   * @type {mutable ref array} senders - 
   */
  const senders = useRef<RTCRtpSender[]>([]);

  /** 
   * @type {string} userField - the username that is entered in the input field when the Submit Username button is clicked.
  */
  let userField = '';

  /** 
   * @type {string} receiver - .
  */
  let receiver: string | null = '';

  useEffect(() => {
    ws.current = new WebSocket(URL);
    openUserMedia();
  },[]);

  /**
   * A diagram of the WebRTC Connection logic
   * Peer A  Stun    Signaling Channel(WebSockets)  Peer B   Step
   *  |------>|                   |                   |       Who Am I? + RTCPeerConnection(configuration) this contains methods to connect to a remote Peer
   *  |<------|                   |                   |       Symmetric NAT (your ip that you can be connected to)
   *  |-------------------------->|------------------>|       Calling Peer B, Offer SDP is generated and sent over WebSocket
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
   * @func handleUsername
   * @desc When the client enters a username and clicks the Submit Username button, a LOGIN event is triggered and the loginPayload is sent via the WebSocketServer (ws.current.send(loginPayload)) to the backend/server. 
   * 
   * Then, username state is updated with the string stored in the userField variable (the username entered by the client when they clicked the Submit Username).
  */
  const handleUsername = (): void => {
    const loginPayload: loginPayObj = {
      ACTION_TYPE: LOGIN, 
      payload: userField,
    };

    ws.current.send(JSON.stringify(loginPayload));
    setUsername(userField);
  };

  /**
   * @func handleOffer
   * @desc When a username is entered that the client wants to "Call" and the client clicks the Call button,  into the input field, this starts the Offer-Answer Model exchange
   */
  const handleOffer = (): void => {
    const inputField:HTMLInputElement | null = document.querySelector('#receiverName');

    if (inputField) {
      receiver = inputField.value;
      inputField.value = '';
      otherUser.current = receiver;
      callUser(receiver);
    }
  };

  /**
   * @function getUser
   * @desc When data (the list of connected users) is received from the WebSocketServer/backend, getUser function is invoked and it updates the userList state so that the list of currently connected users can be displayed on the frontend. 
   * @param {Array<string>} parsedData - data (the array of usernames that are connected) that is returned from backend/WebSocketServer.
   * @returns Re-renders the page with the new User List
  */
  const getUsers = (parsedData: { payload: string[] }): void => {
    const userList = parsedData.payload.map((name: string, idx:number) => (
      <div key={idx}>{name}</div>
    ));
    setUsers(userList);
  };

  /**
   * @async
   * @function openUserMedia
   * @param
   * @desc Asks for the client's permissions to open their webcam and microphone.
   */
  const openUserMedia = async (): Promise<void> => {
    try {
      if (localVideo.current){
        localStream.current = localVideo.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
      }
    } catch (error) {
      console.log('Error in openUserMedia: ', error);
    }
  };

  /**
   * @function callUser
    * @desc Constructs a new RTCPeerConnection object that also adds the local client's media tracks to this object.
    * @param {string} userID
  */
  const callUser = (userID: string): void => {
    peerRef.current = createPeer(userID);
    localStream.current.getTracks().forEach((track) => senders.current.push(peerRef.current.addTrack(track, localStream.current)));
  };

  /**
   * @function createPeer
   * @desc Creates a new RTCPeerConnection object, which represents a WebRTC connection between the local device and a remote peer and adds event listeners to it
   * @param {string} userID
   * @returns {RTCPeerConnection} RTCPeerConnection object 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event and other events
  */
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

  /**
   * @function handleNegotiationNeededEvent
   * @desc invokes WebRTC's built-in createOffer() function to create an SDP offer, which is an RTCSessionDescription object. This offer is then set as the local description using WebRTC's built-in setLocalDescription() function. Finally, the offer, sender and receiver is sent via ws.current.send to the Signaling Channel in the backend
   * @param {string} userID
  */
  function handleNegotiationNeededEvent(userID: string): void {
    peerRef.current
    ?.createOffer()
    .then((offer) => {
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

  /**
   * @namespace handleReceiveCall
   * @function handleReceiveCall - When Peer A (caller) calls Peer B (callee), Peer B receives an Offer from the SignalingChannel and this function is invoked. It creates a new RTCPeerConnection with the Peer A's media attached and an Answer is created. The Answer is then sent back to Peer A through the SignalingChannel.
   * @returns answerPayload object with ANSWER action type and the local description as the payload is sent via WebSocket.
   * @param {Object} data payload object
   * @property {string} data.sender is the person making the call
   * @property { RTCSessionDescriptionInit object } data.payload object providing the session description and it consists of a string containing a SDP message indicating an Offer from Peer A. This value is an empty string ("") by default and may not be null.
   * 
   * @function createPeer - Creates a new RTCPeerConnection object, which represents a WebRTC connection between the local device and a remote peer and adds event listeners to it
   * @memberof handleReceiveCall
   * 
   * @function RTCSessionDescription - initializes a RTCSessionDescription object, which consists of a description type indicating which part of the offer/answer negotiation process it describes and of the SDP descriptor of the session.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
   * @memberof handleReceiveCall
   * 
   * @function setRemoteDescription - If Peer B wants to accept the offer, setRemoteDescription() is called to set the RTCSessionDescriptionInit object's remote description to the incoming offer from Peer A. The description specifies the properties of the remote end of the connection, including the media format.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
   * @memberof handleReceiveCall
   * 
   * @function createAnswer - Creates an Answer to the Offer received from Peer A during the offer/answer negotiation of a WebRTC connection. The Answer contains information about any media already attached to the session, codecs and options supported by the browser, and any ICE candidates already gathered. 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
   * @memberof handleReceiveCall
   * 
   * @function setLocalDescription - WebRTC selects an appropriate local configuration by invoking setLocalDescription(), which automatically generates an appropriate Answer in response to the received Offer from Peer A. Then we send the Answer through the signaling channel back to Peer A.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription
   * @memberof handleReceiveCall
   * 
   * @returns {Promise} A Promise whose fulfillment handler is called with an RTCSessionDescriptionInit object containing the SDP Answer to be delivered to Peer A.
   * 
  */
  function handleReceiveCall(data: { sender: string, payload: RTCSessionDescriptionInit }): void {
    otherUser.current = data.sender;
    peerRef.current = createPeer(data.sender);

    /**
     * @type {RTCSessionDescriptionInit object} desc - consists of a description type indicating which part of the answer negotiation process it describes and the SDP descriptor of the session.
     * @params {string} desc.type - description type with incoming offer
     * @params {string} desc.sdp - string containing a SDP message, the format for describing multimedia communication sessions. SDP contains the codec, source address, and timing information of audio and video
     * @see https://developer.mozilla.org/en-US/docs/Glossary/SDP
     */
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
      const answerPayload: answerPayObj = {
        ACTION_TYPE: ANSWER,
        receiver: data.sender,
        sender: username,
        payload: peerRef.current?.localDescription
      };
      ws.current.send(JSON.stringify(answerPayload));
    });
  }

  /**
  * @desc The local client's remote description is set as the incoming Answer SDP to define who we are trying to connect to on the other end of the connection.
  * @param {object} data SDP answer
  */
  function handleAnswer(data: { payload: RTCSessionDescriptionInit } ): void {
    const remoteDesc = new RTCSessionDescription(data.payload);
    peerRef.current
    ?.setRemoteDescription(remoteDesc)
    .catch((e) => console.log(e));
  }
  /**
  * @desc As the local client's ICE Candidates are being generated, they are being sent to the remote client to complete the connection
  * @param {RTCPeerConnectionIceEvent} e
  */
  function handleIceCandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) { // Contains the RTCIceCandidate containing the candidate associated with the event,
      const IcePayload: icePayObj = {
        ACTION_TYPE: ICECANDIDATE,
        receiver: otherUser.current, // username for other user
        payload: e.candidate, 
      };
      ws.current.send(JSON.stringify(IcePayload));
    }
  }

  /**
  * @desc ICE Candidates being sent from each end of the connection are added to a list of potential connection methods until both ends have a way of connecting to eachother
  * @param {Object} data containing a property payload with an incoming ICE Candidate
  */
  function handleNewIceCandidate(data: { payload: RTCIceCandidateInit }): void {
    const candidate = new RTCIceCandidate(data.payload);
    peerRef.current
    ?.addIceCandidate(candidate)
    .catch((e) => console.log(e));
  }
  
  /**
  * @desc Once the connection is made, the RTCRtpReceiver interface is exposed and this function is then able to extract the MediaStreamTrack from the sender's RTCPeerConnection.
  * @param {RTCTrackEvent} e An Event Object, also contains the stream
  */
  function handleTrackEvent(e: RTCTrackEvent) : void{
    remoteVideo.current.srcObject = e.streams[0];
  }
  /**
  * @desc Enables screen sharing using MediaSession.getDisplayMedia()
  */
  function shareScreen(): void {
    //TODOS: On a new connection the local and streamed screen bugs producing: Rtconnect.jsx:273 Uncaught (in promise) DOMException: The peer connection is closed.
    navigator.mediaDevices.getDisplayMedia()
    .then(stream => {
      const screenTrack = stream.getTracks()[0];
      senders.current
      ?.find(sender => sender.track?.kind === 'video')
      ?.replaceTrack(screenTrack);
      localVideo.current.srcObject = stream; // changing local video to reflect what we're sharing to the other end of the connection

      screenTrack.onended = function() {
        senders.current
        ?.find(sender => sender.track?.kind === 'video')
        ?.replaceTrack(localStream.current.getTracks()[1]);
        localVideo.current.srcObject = localStream.current;  // changing local video displayed back to webcam
      };
    });
  }
  /**
  * @desc if any client chooses to end their call then the person who ends the call first closes their connection and resets the remote video component while also sending a message to the remote peer to also go through the same process.
  * @param {boolean} isEnded 
  */
  function endCall(isEnded: boolean): void {
    const LeavePayload: payloadObj = {
      ACTION_TYPE: LEAVE,
      receiver: otherUser.current,
    };
    peerRef.current?.close();
    isEnded ? peerRef.current?.close() : ws.current?.send(JSON.stringify(LeavePayload));
    remoteVideo.current.srcObject = null;
  }

  // const buttonStyling = { 
  //   backgroundColor: '#C2FBD7',
  //   borderRadius: '50px',
  //   borderWidth: '0',
  //   boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
  //   color: '#008000',
  //   cursor: 'pointer',
  //   display: 'inline-block',
  //   fontFamily: 'Arial, Helvetica, sans-serif',
  //   fontSize: '1em',
  //   height: '50px',
  //   padding: '0 25px',
  // };

  /* 'conditionally rendering' if WebSocket has a value otherwise on page re-rendering events 
  multiple WebSocket connections will be made and error 
  every user when one closes their browser
  */

  return(
    <>
      {
        ws.current ?
          <Socket 
            ws={ws.current}
            getUsers={getUsers}
            handleReceiveCall={handleReceiveCall} 
            handleAnswer={handleAnswer} 
            handleNewIceCandidate={handleNewIceCandidate}
            endCall={endCall}
          /> : 
          ''
      }

      <div 
        className='' 
        style={{
          display: 'flex',
          flexDirection:'column',
          justifyContent: 'space-around',
          marginTop: '10%', 
          padding:'10px', 
        } }
      > 
      
        { 
          username === '' ? 
            <>
              <div 
                className='input-div' 
                style={{
                  alignItems: 'center',
                  display: 'flex', 
                  flexDirection:'column',
                  height: '100px',
                  justifyContent: 'center',
                  left: '2%',
                  margin: '0 auto', 
                  top: '2%', 
                  width: '100px'
                }}
              >
                <input
                  className=''
                  type='text' 
                  placeholder='username' 
                  id="username-field" 
                  onChange={(e) => userField = e.target.value}
                  style={{
                    paddingBottom:'40px', 
                    width:'200px'
                  }}
                ></input>
                  
                <button
                  className=''
                  data-testid='submit-username-btn'
                  onClick={() => handleUsername()}
                  // style={ buttonStyling }
                  style={{
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
                  }}
                >
                  Submit Username
                </button>
              </div>
            </> 
            
            : 

            <div 
              className='users-list' 
              style={{ 
                fontFamily: 'Arial, Helvetica, sans-serif', 
                fontSize: '16px' 
              }}
            >
              Users connected: {users}
            </div>
        }

        <div 
          id="main-video-container" 
          className='' 
          style= {{
            alignItems:'center',
            display: 'flex', 
            flexDirection: 'row', 
            gap: '100px', 
            justifyContent:'center'
          }}
        >

          <div 
            id="local-video-container"
            className='' 
            style={{
              alignContent: 'center', 
              display:'flex', 
              flexDirection:'column', 
              justifyContent: 'center' 
            }}
          >

            <VideoComponent 
              video={localVideo} 
              mediaOptions={mediaOptions}
            />
            
            <div 
              id="local-button-container"
              className='' 
              style= {{
                display: 'flex', 
                flexDirection: 'row', 
                gap: '10px', 
                justifyContent:'center', 
                marginTop:'10px'
              }}
            >

              <button
                className='share-btn'
                data-testid='share-screen-btn'
                onClick={() => shareScreen()}
                // style={buttonStyling}
                style={{
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
                }}
              >
                Share Screen
              </button>

              <button
                className='end-btn'
                data-testid='end-call-btn'
                onClick={() => endCall(false)}
                // style={{ 
                //   ...buttonStyling, 
                //   backgroundColor:'#ff6961', 
                //   color:'#28282B' 
                // }}
                style={{ 
                  // backgroundColor: '#C2FBD7',
                  backgroundColor:'#ff6961', 
                  borderRadius: '50px',
                  borderWidth: '0',
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
                  // color: '#008000',
                  color:'#28282B',
                  cursor: 'pointer',
                  display: 'inline-block',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontSize: '1em',
                  height: '50px',
                  padding: '0 25px',
                }}
              >
                End Call
              </button>

            </div>
          </div>

          <div 
            id="remote-video-container"
            className='' 
            style={{
              alignContent: 'center',
              display:'flex', 
              flexDirection:'column', 
              justifyContent: 'center' 
            }}
          >
            <VideoComponent 
              video={remoteVideo} 
              mediaOptions={mediaOptions} 
            />

            <div 
              id="remote-button-container"
              className=''
              style= {{
                display: 'flex', 
                flexDirection: 'row', 
                gap: '10px', 
                justifyContent:'center', 
                marginTop:'10px'
              }}
            >
              
              <button
                className=''
                data-testid='call-btn'
                onClick={handleOffer} 
                // style={buttonStyling}
                style={{ 
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
                }}
              >
                Call
              </button>
                
              <input
                className='' 
                type='text' 
                id='receiverName'
                style={{
                  marginLeft:'2%'
                }}></input>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCall;