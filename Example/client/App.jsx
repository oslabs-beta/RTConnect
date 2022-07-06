// If I uncomment ws.send on Line 135, an error occurs

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
    const [username, setUsername] = useState('');

    

    // function handleInputChange(e) {
    //     setMessage(e.target.value);
    // }

    // function handleSubmit(){
    //     console.log(`%c line 50 - handleSubmit button clicked: App.jsx, handleSubmit(), message: ${message}`, 'color: green');
    //     ws.send(message)
    //     setMessage('');
    // }
    
    // // Sending message in input form and sending it to backend when Send Message Button clicked 
    // ws.onmessage = (messageBack) => { 
    //     console.log("line 65:  App.jsx, ws.onmessage, messageBack.data:", messageBack.data);
    //     setBackMessage(JSON.parse(messageBack.data));
    // }

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
    let roomId = null;

    const handleUsername = () => {

    }

    // listens for changes/event listeners
    const registerPeerConnectionListeners = async () => {
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

    // gets local webcam permissions and starts local stream
    async function openUserMedia() {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        document.querySelector('.localVideo').srcObject = stream;
        localStream = stream;
    }

    // the functions that are in common for both createOffer and createAnswer
    const createPeerConnection = async () => {
        peerConnection = new RTCPeerConnection(configuration);
        remoteStream = new MediaStream();
        console.log('remote Stream')
        document.querySelector('.remoteVideo').srcObject = remoteStream;

        if (!localStream) {
            openUserMedia();
        }
        // media tracks are then added to the RTCPeerConnection by passing them into addTrack(). 
        localStream.getTracks().forEach((track) => {
            console.log('Line 105 - localstream', track);
            peerConnection.addTrack(track, localStream);
        });

        // event listener for when our peer adds tracks 
        peerConnection.ontrack = (event) => {
            console.log('Got remote track:', event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
              remoteStream.addTrack(track);
            });
        };

        // event listener whenever we create an ICE candidate
        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) { // whenever ice candidate is created
                console.log('Line 119 - New ICE candidate:', event.candidate);
                const icePayload = {
                    action_type: 'ICECANDIDATE',
                    candidate: event.candidate, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
                };
                ws.iceCandidate = icePayload;
                ws.send(JSON.stringify(icePayload));
            }
        }

    }

    // peer 1: remoteDescription = offer and localDescription = offer

    // creates offer, sets LocalDescription, and sends offer and roomId
    const createOffer = async () => {
        await createPeerConnection();

        // create offer
        let offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        const payload = {
            action_type: 'OFFER',
            offer: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
        };

        // each video chat session = a room. A user can create a new room by clicking Create Room button. This will generate an ID that the remote party can use to join the same room.
        roomId = 'ROOMKEY';
        ws.roomId = roomId;

        ws.roomOffer = payload;
        ws.send(JSON.stringify(payload));

        console.log("Line 161 - peerConnection: ", peerConnection);
    }

    // peer 2: remoteDescription = offer and localDescription = answer
    // creates answer, sends it via ws
    async function createAnswer(offer) {
        await createPeerConnection();
        await peerConnection.setRemoteDescription(offer);

        // create answer
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer); // set answer as the local description,

        // after peer 2 creates answer, they have to send back their answer 

        const answerPayload = {
            action_type: 'ANSWER',
            answer: answer,
        }
        ws.roomAnswer = answerPayload;
        ws.send(JSON.stringify(answerPayload))
    }

    // Lets Peer 1 set their remote description after getting an answer back from peer 2
    const addAnswer = async (ans) => {
        if (!peerConnection.currentRemoteDescription) {
            peerConnection.setRemoteDescription(ans)
        }

    }
    // SENDING ICE CANDIDATE VIA WS
    // async function handleIceCandidates(pc, websocket) {
    //     pc.addEventListener('icecandidate', event => {
    //         if (!event.candidate) {
    //           console.log('Got final candidate!', event.candidate);
    //           return;
    //         }
    //         console.log('Line 104 - Got candidate: ', event.candidate);
    //         const payload = {
    //             action_type: 'ICECANDIDATE',
    //             content: event.candidate
    //         }
    //         ws.candidate = payload;
    //         // ws.send(JSON.stringify(payload)) // causes Join Room button to stop working
    //     });
    // }

    const createRoom = async () => {
        // generate a room key and render on frontend
        document.querySelector('.createRoomText').innerHTML = 'ROOMKEY';
        console.log("Room Created")

        try {
            await openUserMedia(); // sets local video to local stream
        } catch (error) {
            console.log('usermedia not valid: ', error)
        }

        await createOffer();

        // handler for track events to handle inbound video and audio tracks that have been negotiated to be received by this peer connection
        peerConnection.ontrack = ({track, streams}) => {
            track.onunmute = () => {
              if (document.querySelector(".remoteVideo").srcObject) {
                console.log('working')
                return;
            }
              document.querySelector(".remoteVideo").srcObject = streams[0];
            };
        };

        registerPeerConnectionListeners();
    }

    // when Join Room button is clicked
    const joinRoom = async () => {
        document.querySelector('.remoteVideo-div').style.display = 'block';

        try {
            // if there is an offer
            if (ws.roomOffer.offer !== null) {
                peerConnection = new RTCPeerConnection(configuration);

                localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, localStream);
                });
    
            // ************* Code for creating SDP answer below *************
                const {offer} = ws.roomOffer; // extracting the offer from the caller 
                await createAnswer(offer);
            }
            console.log('Line 247 peerConnection', peerConnection)

            registerPeerConnectionListeners();

        } catch (error) {
            // alert('Create a room first');
            console.error('Error in joinRoom function in App.jsx', error);
        }
    }

    const handleCreateRoomClick = async () => {
        try {
            await createRoom();

    
            ws.addEventListener('message', async message => {
                const data = JSON.parse(message.data);
                const parsedMessage = JSON.parse(data.message)
                // console.dir(data)
                console.dir(parsedMessage)
                // console.dir(data)
                
            // const payload = {
            //     action_type: 'OFFER',
            //     offer: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
            // };
                // NEED TO REPLACE STRINGS 'offer', 'answer' and 'icecandidate'
                switch (parsedMessage.action_type) {
                    case 'OFFER':
                        createAnswer(ws.roomAnswer.answer);
                        break;
                    case 'ANSWER':
                        addAnswer('answer')
                        break;
                    case 'ICECANDIDATE':
                        if (peerConnection) {
                            peerConnection.addIceCandidate('candidate')
                        }
                        break;
                }
            });
            
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }
      
    return(
        !username ? 
        <div>  
            <input type='text' placeholder='username'></input>
            <button onClick={() => handleUsername()}>Submit Username</button>
        </div>

        :


            <div>
                <VideoComponent
                    // handleCreateRoomClick={handleCreateRoomClick}
                    createRoom={createRoom}
                    openUserMedia={openUserMedia}
                    hasJoined={hasJoined}
                    // handleJoinRoomClick={handleJoinRoomClick}
                    joinRoom={joinRoom}
                    autoplay
                />
            </div>
            
                        {/* <input
                name='newMessage'
                type='text'
                value={message}
                onChange={handleInputChange}
            > */}
            {/* </input>
            <button type='submit' onClick={() => handleSubmit()}>Send Message</button>
            <ChatMessage
                messageChat={backMessage}
            /> */}
    
    )
}

export default App;



