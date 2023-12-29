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
 * @func VideoCall
 * @param {String} props.URL - ws or wss link that establishes a connection between the WebSocket object and the server
 * @param {object} props.mediaOptions video embed attributes
 
 * @desc Wrapper component containing the logic necessary for peer connections using WebRTC APIs (RTCPeerConnect API + MediaSession API) and WebSockets. 
 * 
 * ws, localVideoRef, remoteVideo, peerRef, localStreamRef, otherUser, senders are all mutable ref objects that are created using the useRef hook. The useRef hook allows you to persist values between renders and it is used to store a mutable value that does NOT cause a re-render when updated.
 * 
 * The WebSocket connection (ws.current) is established using the useEffect hook and once the component mounts, the Socket component is rendered. The Socket component adds event listeners that handle the offer-answer model and the exchange of SDP objects between peers and the socket.
 * 
 * The WebSocket message event will filter through various events to determine the payloads that will be sent to other serverside socket connection via WebSocket.
 * 
 * @type {state} username - username state stores the name the client enters. All users (see getUsers) will be able to see an updated list of all other users whenever a new user logs in or leaves.
 * @type {state} users - users state is the list of connected users that is rendered on the frontend.
 * 
 * @returns A component that renders two VideoComponents, 
 */

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
   *  |-------------------------->|------------------>|       ICE Candidates from Peer A, these steps repeat and are only necessary if Peer B can't connect to the 
   *  |       |                   |                   |         earlier candidates sent.
   *  |<--------------------------|-------------------|       ICE Candidate trickling from Peer B, could also take a second if there's a firewall to be 
   *  |       |                   |                   |         circumvented.
   *  |       |                   |                   |       Connected! Peer to Peer connection is made and now both users are streaming data to eachother!
   * 
   * If Peer A starts a call their order of functions being invoked is... handleOffer --> callUser --> createPeer --> peerRef.current.negotiationNeeded event (handleNegotiationNeededEvent) --> ^send Offer SDP^ --> start ICE trickle, handleIceCandidateEvent --> ^receive Answer^ SDP --> handleIceCandidateMsg --> once connected, handleTrackEvent
   * If Peer B receives a call then we invoke... ^Receive Offer SDP^ --> handleReceiveCall --> createPeer --> ^send Answer SDP^ --> handleIceCandidateMsg --> handleIceCandidateEvent --> once connected, handleTrackEvent
   * 
   * Note: Media is attached to the Peer Connection and sent along with the offers/answers to describe what media each client has.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack
*/

const VideoCall = ({ URL, mediaOptions }: { URL: string, mediaOptions: { controls: boolean, style: { width: string, height: string }}}): JSX.Element => {
 
  const [username, setUsername] = useState<string>('');

  const [users, setUsers] = useState<JSX.Element[]>();

  /**
   * @type {mutable ref WebSocket object} ws is the mutable ref object that contains the WebSocket object in its .current property (ws.current). It cannot be null or undefined.
   * 
   * @desc ws.current property contains the WebSocket object, which is created using the useEffect hook and it establishes the WebSocket connection to the server. The useEffect Hook creates the WebSocket object using the URL parameter when the component mounts.
   * 
   * ws.current.send enqueues the specified messages that need to be transmitted to the server over the WebSocket connection and this WebSocket connection is connected to the server by using RTConnect's importable SignalingChannel module.
   */
  const ws = useRef<WebSocket>(null!);

  /**
   * @type {mutable ref object} localVideoRef - video element of the local user. It will not be null or undefined.
   * @property {HTMLVideoElement} localVideoRef.current 
   */
  const localVideoRef = useRef<HTMLVideoElement>(null!);

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
   * @type {mutable ref object} localStreamRef - It cannot be null or undefined.
   */
  const localStreamRef = useRef<MediaStream>(null!);

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
   * @async
   * @function openUserMedia is invoked in the useEffect Hook after WebSocket connection is established.
   * @desc If the localVideoRef.current property exists, openUserMedia invokes the MediaDevices interface getUserMedia() method to prompt the clients for audio and video permission. 
   * 
   * If clients grant permissions, getUserMedia() uses the video and audio constraints to assign the local MediaStream from the clients' cameras/microphones to the local <video> element.
   * 
   * @param {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   */
  const openUserMedia = async (): Promise<void> => {
    try {
      if (localVideoRef.current){
        localStreamRef.current = localVideoRef.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
      }
    } catch (error) {
      console.log('Error in openUserMedia: ', error);
    }
  };
  

  /**
   * @func handleUsername 
   * 
   * @desc Invoked when clients click the Submit Username button. A loginPayload object is initiated - it contains the LOGIN event and its payload contains the client's username. 
   * 
   * The loginPayload object is sent via the WebSocketServer (ws.current.send(loginPayload)) to the backend/SignalingChannel. 
   * 
   * Then, the username state is updated with the userField string (the username entered by the client when they clicked the Submit Username). setUsername(userField)
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
   * @desc When a username is entered into the input field that the client wants to "Call" and the client clicks the Call button, this starts the SDP Offer-Answer  exchange
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
   * @desc When data (the list of connected users) is received from the WebSocketServer, getUser is invoked and it creates div tags to render the names of each of the connected users on the front end. 
   * @param {Object} parsedData - The object (containing the payload with the array of connected usernames) that is returned from backend/WebSocketServer. parsedData.payload contains the array with the strings of connected usernames
   * @returns Re-renders the page with the new list of connected users
  */
  const getUsers = (parsedData: { payload: string[] }): void => {
    const userList = parsedData.payload.map((name: string, idx:number) => (
      <div key={idx}>{name}</div>
    ));
    setUsers(userList);
  };

  /**
   * @function callUser - Constructs a new RTCPeerConnection object using the createPeer function and then adds the local client's (Peer A/caller) media tracks to peer connection ref object.
   * @param {string} userID the remote client's (Peer B/callee) username
  */
  const callUser = (userID: string): void => {
    peerRef.current = createPeer(userID);
    localStreamRef.current.getTracks().forEach((track) => senders.current.push(peerRef.current.addTrack(track, localStreamRef.current)));
  };

  /**
   * @function createPeer - Creates a new RTCPeerConnection object, which represents a WebRTC connection between the local device and a remote peer and adds event listeners (handleIceCandidateEvent, handleTrackEvent, handleNegotiationNeededEvent) to it
   * @param {string} userID the remote client's (Peer B/callee) username
   * @returns {RTCPeerConnection} RTCPeerConnection object 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionstatechange_event and other events
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
  */
  const createPeer = (userID: string): RTCPeerConnection => {
    const peer: RTCPeerConnection = new RTCPeerConnection(configuration);
    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    peer.addEventListener('negotiationneeded', () => {
      console.log('negotiationneeded event has fired');
    });

    peer.addEventListener('icegatheringstatechange', () => {
      // const stateOfIceGathering = peer.iceGatheringState; // returns a string that describes the connection's ICE gathering state (new, gathering, or complete)
      // console.log(`ICE gathering state: ${stateOfIceGathering}`);
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
   * @desc creates an SDP offer and sends it through the signaling channel to the remote peer: invokes WebRTC's built-in createOffer() function to create an SDP offer, which is an RTCSessionDescription object. After creating the offer, the local end is configured by calling RTCPeerConnection.setLocalDescription().
   *  
   * Then a signaling message is created and sent to the remote peer through the signaling server, to share the offer with the other peer. The other peer should recognize this message and follow up by creating its own RTCPeerConnection, setting the remote description with setRemoteDescription(), and then creating an answer to send back to the offering peer. Finally, the offer, sender and receiver is sent via ws.current.send to the Signaling Channel in the backend
   * 
   * @param {string} userID the remote client's (Peer B/callee) username
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/negotiationneeded_event
  */
  function handleNegotiationNeededEvent(userID: string): void {
    peerRef.current?.createOffer()
    .then((offer) => {
      return peerRef.current?.setLocalDescription(offer);
    })
    .then(() => {
      const offerPayload: offerPayObj = {
        ACTION_TYPE: OFFER,
        sender: username, // local peer
        receiver: userID,
        payload: peerRef.current?.localDescription
      };
      ws.current.send(JSON.stringify(offerPayload));
    })
    .catch(e => console.log(e));
  }

  /**
   * @namespace handleReceiveCall
   * @function handleReceiveCall
   * @desc When Peer A (caller) calls Peer B (callee), Peer B receives an Offer from the SignalingChannel and this function is invoked. It creates a new RTCPeerConnection with the Peer A's media attached and an Answer is created. The Answer is then sent back to Peer A through the SignalingChannel.
   * @returns answerPayload object with ANSWER action type and the local description as the payload is sent via WebSocket.
   * @param {Object} data payload object
   * @property {string} data.sender is the person making the call
   * @property { RTCSessionDescriptionInit object } data.payload object providing the session description and it consists of a string containing a SDP message indicating an Offer from Peer A. This value is an empty string ("") by default and may not be null.
   * 
   * @function createPeer
   * @desc Creates a new RTCPeerConnection object, which represents a WebRTC connection between the local device and a remote peer and adds event listeners to it
   * @memberof handleReceiveCall
   * 
   * @function RTCSessionDescription
   * @desc initializes a RTCSessionDescription object, which consists of a description type indicating which part of the offer/answer negotiation process it describes and of the SDP descriptor of the session.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCSessionDescription
   * @memberof handleReceiveCall
   * 
   * @function setRemoteDescription
   * @desc If Peer B wants to accept the offer, setRemoteDescription() is called to set the RTCSessionDescriptionInit object's remote description to the incoming offer from Peer A. The description specifies the properties of the remote end of the connection, including the media format.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
   * @memberof handleReceiveCall
   * 
   * @function createAnswer
   * @desc Creates an Answer to the Offer received from Peer A during the offer/answer negotiation of a WebRTC connection. The Answer contains information about any media already attached to the session, codecs and options supported by the browser, and any ICE candidates already gathered. 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
   * @memberof handleReceiveCall
   * 
   * @function setLocalDescription
   * @desc WebRTC selects an appropriate local configuration by invoking setLocalDescription(), which automatically generates an appropriate Answer in response to the received Offer from Peer A. Then we send the Answer through the signaling channel back to Peer A.
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
     * @property {string} desc.type - description type with incoming offer
     * @property {string} desc.sdp - string containing a SDP message, the format for describing multimedia communication sessions. SDP contains the codec, source address, and timing information of audio and video
     * @see https://developer.mozilla.org/en-US/docs/Glossary/SDP
     */
    const desc = new RTCSessionDescription(data.payload);

    peerRef.current.setRemoteDescription(desc)
    .then(() => {
      localStreamRef.current?.getTracks().forEach((track) => peerRef.current?.addTrack(track, localStreamRef.current));
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
        payload: peerRef.current?.localDescription // localDescription is an RTCSessionDescription describing the session for the local end of the connection
      };
      ws.current.send(JSON.stringify(answerPayload));
    });
  }

  /**
   * @function handleAnswer - The local client's remote description is set as the incoming Answer SDP to define who we are trying to connect to on the other end of the connection.
   * @param {object} data SDP answer
  */
  function handleAnswer(data: { payload: RTCSessionDescriptionInit } ): void {
    const remoteDesc = new RTCSessionDescription(data.payload);
    peerRef.current
    ?.setRemoteDescription(remoteDesc)
    .catch((e) => console.log(e));
  }

  /**
   * @function handleIceCandidateEvent As the local client's ICE Candidates are being generated, they are being sent to the remote client to complete the connection
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
   * @function handleNewIceCandidate ICE Candidates being sent from each end of the connection are added to a list of potential connection methods until both ends have a way of connecting to eachother
   * @param {Object} data containing a property payload with an incoming ICE Candidate
  */
  function handleNewIceCandidate(data: { payload: RTCIceCandidateInit }): void {
    const candidate = new RTCIceCandidate(data.payload);
    peerRef.current
    ?.addIceCandidate(candidate)
    .catch((e) => console.log(e));
  }
  
  /**
   * @function handleTrackEvent - Once the connection is made, the RTCRtpReceiver interface is exposed and this function is then able to extract the MediaStreamTrack from the sender's RTCPeerConnection.
   * @param {RTCTrackEvent} e An Event Object, also contains the stream
  */
  function handleTrackEvent(e: RTCTrackEvent) : void{
    remoteVideo.current.srcObject = e.streams[0];
  }

  /**
   * @function shareScreen
   * @desc Enables screen sharing using MediaSession.getDisplayMedia()
   * 
   * @method getDisplayMedia - getDisplayMedia() method of the MediaStream interface prompts the user to select and grant permission to capture the contents or portion (such as a window) of their screen as a MediaStream.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
   * 
   * @method getTracks - getTracks() method of the MediaStream interface returns an array of all the MediaStreamTrack objects in the stream
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/getTracks
   * 
   * @method replaceTrack - The RTCRtpSender method replaceTrack() replaces the track currently being used as the sender's source with a new MediaStreamTrack.
   * 
  */
  function shareScreen(): void {
    //TODOS: On a new connection the local and streamed screen bugs producing: Rtconnect.jsx:273 Uncaught (in promise) DOMException: The peer connection is closed.
    navigator.mediaDevices.getDisplayMedia()
    .then(stream => {

      const screenTrack = stream.getTracks()[0]; // local video stream 

      senders.current
      ?.find(sender => sender.track?.kind === 'video')
      ?.replaceTrack(screenTrack);
      localVideoRef.current.srcObject = stream; // changing local video to display what is being screen shared to the other peer

      screenTrack.onended = function() { // ended event is fired when playback or streaming has stopped because the end of the media was reached or because no further data is available
        senders.current
        ?.find(sender => sender.track?.kind === 'video')
        ?.replaceTrack(localStreamRef.current.getTracks()[1]); // 
        localVideoRef.current.srcObject = localStreamRef.current;  // changing local video displayed back to webcam
      };
    });
  }

  /**
   * @function endCall - if any client chooses to end their call then the person who ends the call first closes their connection and resets the remote video component while also sending a message to the remote peer to also go through the same process.
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
        className='div1' 
        style={{
          display: 'flex',
          flexDirection:'column',
          justifyContent: 'space-around',
          marginTop: '10%', 
          padding:'10px', 
        }}
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
                  className='input-username'
                  id="username-field" 
                  onChange={(e) => userField = e.target.value} 
                  placeholder='username' 
                  style={{
                    paddingBottom:'40px', 
                    width:'200px'
                  }} 
                  type='text'
                ></input>
                  
                <button
                  className='submit-username-btn'
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
              Connected Users: {users}
            </div>
        }

        <div 
          className='' 
          id="main-video-container" 
          style= {{
            alignItems:'center',
            display: 'flex', 
            flexDirection: 'row', 
            gap: '100px', 
            justifyContent:'center'
          }}
        >

          <div 
            className='' 
            id="local-video-container"
            style={{
              alignContent: 'center', 
              display:'flex', 
              flexDirection:'column', 
              justifyContent: 'center' 
            }}
          >

            <VideoComponent 
              video={localVideoRef} 
              mediaOptions={mediaOptions}
            />
            
            <div 
              className='' 
              id="local-button-container"
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
                style={{ 
                  backgroundColor:'#ff6961', 
                  borderRadius: '50px',
                  borderWidth: '0',
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
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
            className='' 
            id="remote-video-container"
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
              className='' 
              id="remote-button-container"
              style= {{
                display: 'flex', 
                flexDirection: 'row', 
                gap: '10px', 
                justifyContent:'center', 
                marginTop:'10px'
              }}
            >
              
              <button
                className='call-btn'
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
                className='input-receiver-name' 
                id='receiverName'
                type='text' 
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