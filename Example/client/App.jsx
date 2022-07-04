import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import VideoComponent from '../../client/src/components/VideoComponent.jsx';
import actions from '../../actions.js';
import Socket from '../../client/src/components/Socket.jsx'

const {OFFER, ANSWER, ICECANDIDATE} = actions
const ws = new WebSocket('ws://localhost:3001');

// whenever client connects to homepage,
ws.addEventListener('open', () => {
    console.log('Websocket connection has opened.');
    ws.send('I connected! Is the back-end able to see this?');
})

ws.addEventListener('close', () => {
    console.log('Websocket connection closed.');
})

ws.addEventListener('error', (e) => {
    console.log('Websocket error:', e);
})

// ws.addEventListener('message', (message) => {
//     console.log("line 15: message.data, ws.onmessage, App.jsx ", message.data);
// })

const App = () => {

    const [messageBoard, setMessageBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [backMessage, setBackMessage] = useState('');
    const [hasJoined, setHasJoined] = useState(true);


    function handleInputChange(e) {
        setMessage(e.target.value);
    }

    function handleSubmit(){
        console.log(`%c line 50 - handleSubmit button clicked: App.jsx, handleSubmit(), message: ${message}`, 'color: green');
        ws.send(message)
        setMessage('');
    }
    
    // Sending message in input form and sending it to backend when Send Message Button clicked 
    ws.onmessage = (messageBack) => { 
        console.log("line 65:  App.jsx, ws.onmessage, messageBack.data:", messageBack.data);
        setBackMessage(JSON.parse(messageBack.data));
    }

    const configuration = {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
        iceCandidatePoolSize: 10,
    };
    let peerConnection = null;
    let localStream = null;
    let remoteStream = null;
    let roomDialog = null;
    let roomId = null;

    function registerPeerConnectionListeners() {
        console.log('registerPeerConnectionListeners function invoked')
        peerConnection.addEventListener('Line 71: icegatheringstatechange', () => {
          console.log(
              `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
        });
      
        peerConnection.addEventListener('connectionstatechange', () => {
          console.log(`Connection state change: ${peerConnection.connectionState}`);
        });
      
        peerConnection.addEventListener('Line 80: signalingstatechange', () => {
          console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });
      
        peerConnection.addEventListener('Line 84: iceconnectionstatechange ', () => {
          console.log(
              `ICE connection state change: ${peerConnection.iceConnectionState}`);
        });
    }

    async function openUserMedia() {
        const stream = await navigator.mediaDevices.getUserMedia(
            {video: true, audio: true});
        document.querySelector('.localVideo').srcObject = stream;
        localStream = stream;
        remoteStream = new MediaStream();
        document.querySelector('.remoteVideo').srcObject = remoteStream;
      
        console.log('Stream:', document.querySelector('.localVideo').srcObject);
        // document.querySelector('#cameraBtn').disabled = true;
        // document.querySelector('#joinBtn').disabled = false;
        // document.querySelector('#createBtn').disabled = false;
        // document.querySelector('#hangupBtn').disabled = false;
      }
      
    const createRoom = async () => {
        // generate a room key and render on frontend
        document.querySelector('.createRoomText').innerHTML = 'ROOMKEY';
        console.log("Room Created")
        await openUserMedia();

        peerConnection = new RTCPeerConnection(configuration);

        registerPeerConnectionListeners();

    // ************* CODE FOR CREATING A ROOM ****************
        // each video chat session = a room. 
        // A user can create a new room by clicking Create Room button. 
        // This will generate an ID that the remote party can use to join the same room.
        
        // creates an RTCSessionDescription that will represent the offer from the caller
        const offer = await peerConnection.createOffer();
        // set as the local description,
        await peerConnection.setLocalDescription(offer);
    
        console.log('Line 125: Check peerConnection.localDescription', peerConnection)
        const payload = {
            action_type: 'OFFER',
            offer: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
        }

        ws.roomOffer = payload;

        const roomId = 'ROOMKEY';
        ws.roomId = roomId;

        // console.log(`%c ${message}`, 'color: green')
        console.log(`%c ws line 139`, 'color: green')
        console.dir(ws);

        console.log("peerConnection: ", peerConnection.currentRemoteDescription);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
          });

    // ============ END CODE FOR CREATING A ROOM ============

    // ************* Code for collecting ICE candidates below *************

    // ============ Code for collecting ICE candidates above ============

        peerConnection.addEventListener('track', event => {
            console.log('Got remote track:', event.streams[0]);
            event.streams[0].getTracks().forEach(track => {
              console.log('Add a track to the remoteStream:', track);
              remoteStream.addTrack(track);
            });
        });     
  // ************* Listening for remote session description below *************
        // Need to detect when an answer from the callee has been added.
        if (peerConnection.currentRemoteDescription === null && ws.roomAnswer !== null) {
            console.log('Set remote description: ', ws.roomOffer);
        // This will wait until the callee writes the RTCSessionDescription for the answer, and set that as the remote description on the caller RTCPeerConnection.
            const answer = new RTCSessionDescription(ws.roomAnswer.answer)
        //     console.log("answer", answer)
            await peerConnection.setRemoteDescription(answer);
        }

  // ============ Listening for remote session description above ============

  // ************* Listen for remote ICE candidates below *************

  // ============ Listen for remote ICE candidates above ============

        // ws.send(JSON.stringify(payload));

    }

    // when Join Room button is clicked
    const joinRoom = async () => {
        try {
            console.log(`%c Line 185 ws.roomOffer.offer: ${ws.roomOffer.offer}`, 'color: red');

            // extracting the offer from the caller
            if (ws.roomOffer.offer) {
                console.log('Create PeerConnection with configuration: ', configuration);
                peerConnection = new RTCPeerConnection(configuration);
                registerPeerConnectionListeners();

                // localStream.getTracks().forEach(track => {
                //     peerConnection.addTrack(track, localStream);
                // });
    
            // ************* Code for collecting ICE candidates below *************
    
            // ============ Code for collecting ICE candidates above ============
    
            peerConnection.addEventListener('track', event => {
                console.log('Got remote track:', event.streams[0]);
                event.streams[0].getTracks().forEach(track => {
                  console.log('Add a track to the remoteStream:', track);
                  remoteStream.addTrack(track);
                });
            });
    
        // ************* Code for creating SDP answer below *************
            // extracting the offer from the caller 
            const {offer} = ws.roomOffer;

            // set the offer as the remote description
            await peerConnection.setRemoteDescription(offer);
        
            // create answer to offer
            const answer = await peerConnection.createAnswer();

            // set answer as the local description,
            await peerConnection.setLocalDescription(answer);
            console.log(`Line 227 answer: ${peerConnection}`, 'color: red');

            const roomAnswer = {
                action_type: 'ANSWER',
                answer: answer,
            }

            console.log("roomAnswer", roomAnswer)
            ws.roomAnswer = roomAnswer;
            // ============ Code for creating SDP answer above ============
        
            // ************* Listening for remote ICE candidates below *************
        
            // ============ Listening for remote ICE candidates above ============
        }
        console.log('peerConnection', peerConnection)

        } catch (error) {
            alert('Create a room first');
            console.error('Error in joinRoom function in App.jsx', error);
        }

    }
    // const handleJoinRoomClick = () => {
    //     console.log('Join Room function')
    //     joinRoom();
    // }

    const handleCreateRoomClick = async () => {
        try {
            await createRoom();
            ws.addEventListener('message', async message => {
                const data = JSON.parse(message.data);
                const parsedMessage = JSON.parse(data.message)
                // console.dir(data)
                console.dir(parsedMessage)
                // console.dir(data)
                switch (parsedMessage.ACTION_TYPE) {
                    case 'OFFER':
                        // data = {
                        //     action_type: OFFER,
                        //     payload: 'adskfjasdlkfjasdflkjasdfk asdfjsa'
                        // }
                        // const { payload } = data
                        const offerPayload = parsedMessage.payload;
                        const offerDesc = new RTCSessionDescription(offerPayload);
                        peerConnection.setRemoteDescription(offerDesc)
                        const answer = await peerConnection.createAnswer()
                        await peerConnection.setLocalDescription(answer)
                        ws.send({'answer': answer})
                        break;
                        //handle offer
                    case 'ANSWER':
                        // ({ payload } = data)
                        const answerPayload = parsedMessage.payload;
                        const answerDesc = new RTCSessionDescription(answerPayload);
                        await peerConnection.setRemoteDescription(answerDesc);
                        break;
                    case 'ICECANDIDATE':
                        //handle ice candidates
                        // ({payload} = data)
                        const answerIceCandidate = parsedMessage.payload;
                        peerConnection.addIceCandidate(answerIceCandidate)
                        break;
                }
            });
            
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }
      
    return(
        <>
            <input
                name='newMessage'
                type='text'
                value={message}
                onChange={handleInputChange}
            >
            </input>
            <button type='submit' onClick={() => handleSubmit()}>Send Message</button>
            <ChatMessage
                messageChat={backMessage}
            />
            <div>
                <input type='text' placeholder="Enter your name"></input>
                <button>Submit</button>

                <div>
                    {/* <button id="hangupBtn">End Call</button> */}
                    <button id="createBtn" onClick={handleCreateRoomClick}>Create Room</button>
                    <button id="joinBtn" onClick={joinRoom}>Join Room</button>
                </div>

                <VideoComponent
                    handleCreateRoomClick={handleCreateRoomClick}
                    hasJoined={hasJoined}
                    // handleJoinRoomClick={handleJoinRoomClick}
                    joinRoom={joinRoom}
                    autoplay
                />
            </div>
        </>
    )
}

export default App;



