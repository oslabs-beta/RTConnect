// If I uncomment ws.send on Line 135, an error occurs

import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import VideoComponent from '../../client/src/components/VideoComponent.jsx';
import Socket from '../../client/src/components/Socket.jsx'
import { LOGIN, ICECANDIDATE, OFFER, ANSWER } from '../../actions.js';

import { Button, Input, Container, Grid, Center } from "@mantine/core";


const App = () => {

    const [messageBoard, setMessageBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [backMessage, setBackMessage] = useState('');
    const [hasJoined, setHasJoined] = useState(true);
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

    let receiver = null;
    let peerConnection = null;
    let localStream;
    let remoteStream = null;
    let roomId = null;
    
    //list of users to display, stretch feature


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

    const ws = new WebSocket('ws://localhost:3001');

// whenever client connects to homepage,
    ws.addEventListener('open', () => {
    console.log('Websocket connection has opened.');
    // ws.send('I connected! Is the back-end able to see this?');
})

    ws.addEventListener('close', () => {
    console.log('Websocket connection closed.');
})

    ws.addEventListener('error', (e) => {
    console.log('Websocket error:', e);
})

    ws.addEventListener('message', async message => {
    const { data } = message;
    const parsedData = JSON.parse(data);
    console.log(data);
    
// const payload = {
//     ACTION_TYPE: 'OFFER',
//     offer: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
// };


    switch (parsedData.ACTION_TYPE) {
        case LOGIN: 
            getUsers(parsedData);
        case OFFER:
            receiver = parsedData.sender  //swap receiver and sender
            createAnswer(parsedData);
            break;
        case ANSWER:
            addAnswer(parsedData);
            console.log(peerConnection);
            break;
        case ICECANDIDATE:
            if (peerConnection) {
                peerConnection.addIceCandidate(parsedData.payload)
            }
            break;
    }
});

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


    const handleUsername = () => {
        const inputValue = document.querySelector('#username-field').value;
        // document.querySelector('.peer-1').innerText = inputValue;
        console.log(inputValue);
        const loginPayload = {
            ACTION_TYPE: LOGIN, 
            payload: inputValue
        }
        ws.send(JSON.stringify(loginPayload))
        setUsername(inputValue);
    }

    const getUsers = (data) => {
        setUsers(data.payload);
        console.log(users);
    }
    
    const handleOffer = () => {
        let inputField = document.querySelector('#receiverName');
        console.log(`receiver: ${inputField.value}`)
        console.log(`receiver state ${receiver}`);

        receiver = inputField.value;

        inputField.value = ''

        createOffer(receiver);
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
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        document.querySelector('.localVideo').srcObject = stream;
        localStream = stream;
    }

    // the functions that are in common for both createOffer and createAnswer
    const createPeerConnection = async () => {
        peerConnection = new RTCPeerConnection(configuration);
        remoteStream = new MediaStream();
        document.querySelector('.remoteVideo').srcObject = remoteStream; // 

        // console.log('peerConnection:', peerConnection, 'remoteStream:', remoteStream);

        if (!localStream) {
            openUserMedia();
            console.dir(localStream)
        }
        // media tracks are then added to the RTCPeerConnection by passing them into addTrack(). 
        localStream.getTracks().forEach((track) => {
            console.log('Line 105 - localstream TRACK', track);
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
            if (event && event.candidate) { // whenever ice candidate is created
                console.log('Line 119 - New ICE candidate:', event.candidate);
                console.log(peerConnection);

                // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
                //event.candidate contains ice candidate to be sent to remote peer (callee)
                
                const icePayload = {
                    ACTION_TYPE: ICECANDIDATE,
                    payload: event.candidate,
                    sender: username,
                    receiver: receiver
                };
                // ws.iceCandidate = icePayload;
                ws.send(JSON.stringify(icePayload));
            }
        }
        registerPeerConnectionListeners();
    }

    // peer 1: remoteDescription = offer and localDescription = offer

    // creates offer, sets LocalDescription, and sends offer and roomId
    const createOffer = async (receiver) => {
        await createPeerConnection();

        // create offer
        let offer = await peerConnection.createOffer();
        console.log(`%c MY OFFER ${ JSON.stringify(offer) }`, 'color: red')
        await peerConnection.setLocalDescription(offer);

        const offerPayload = {
            ACTION_TYPE: OFFER,
            payload: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
            sender: username,
            receiver: receiver
        };

        // each video chat session = a room. A user can create a new room by clicking Create Room button. This will generate an ID that the remote party can use to join the same room.
        // roomId = 'ROOMKEY';
        // ws.roomId = roomId;

        // ws.roomOffer = payload;
        ws.send(JSON.stringify(offerPayload));

        console.log("Line 161 - peerConnection: ", peerConnection);
    }

    // peer 2: remoteDescription = offer and localDescription = answer
    // creates answer, sends it via ws
    async function createAnswer(offer) {
        console.log(offer)
        await createPeerConnection();
        await peerConnection.setRemoteDescription(offer.payload);
        // create answer
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer); // set answer as the local description,

        // after peer 2 creates answer, they have to send back their answer 
        
        registerPeerConnectionListeners()

        const answerPayload = {
            ACTION_TYPE: ANSWER,
            answer: answer,
            sender: username,
            receiver: offer.sender
        }
        // ws.roomAnswer = answerPayload;
        ws.send(JSON.stringify(answerPayload))
    }

    // Lets Peer 1 set their remote description after getting an answer back from peer 2
    const addAnswer = async (ans) => {
        
        if (!peerConnection.currentRemoteDescription) {
            console.log(ans)
            await peerConnection.setRemoteDescription(ans.payload)
        }
        console.log(peerConnection);
    }

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
    // const joinRoom = async () => {
    //     document.querySelector('.remoteVideo-div').style.display = 'block';

    //     try {
    //         // if there is an offer
    //         if (ws.roomOffer.offer !== null) {
    //             peerConnection = new RTCPeerConnection(configuration);

    //             localStream.getTracks().forEach(track => {
    //                 peerConnection.addTrack(track, localStream);
    //             });
    
    //         // ************* Code for creating SDP answer below *************
    //             const {offer} = ws.roomOffer; // extracting the offer from the caller 
    //             await createAnswer(offer);
    //         }
    //         console.log('Line 247 peerConnection', peerConnection)

    //         registerPeerConnectionListeners();

    //     } catch (error) {
    //         // alert('Create a room first');
    //         console.error('Error in joinRoom function in App.jsx', error);
    //     }
    // }

    const handleCreateRoomClick = async () => {
        try {
            // await createRoom();
            
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }
      
    return(
        // <VideoComponent
        //     handleCreateRoomClick={handleCreateRoomClick}
        //     createRoom={createRoom}
        //     openUserMedia={openUserMedia}
        //     hasJoined={hasJoined}
        //     joinRoom={joinRoom}
        // />
        !username ? 
            <div className="login-box" style={{display: 'flex',position: 'absolute', top: '20%', left: '28%', margin: '0 auto', height: '500px', width: '800px', border: '2px green', borderStyle: 'solid', justifyContent: 'center', alignItems: 'center', margin: '0 auto'}}>
                <Container>
                    <Input  type='text' placeholder='username' id="username-field"></Input>
                    <Button variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} onClick={() => handleUsername()}>Submit Username</Button>
                </Container>
                
            </div>

        :


            <div>
                <VideoComponent
                    handleCreateRoomClick={handleCreateRoomClick}
                    createRoom={createRoom}
                    openUserMedia={openUserMedia}
                    hasJoined={hasJoined}
                    // handleJoinRoomClick={handleJoinRoomClick}
                    // joinRoom={joinRoom}
                    handleOffer={handleOffer}
                    autoplay
                />
                {users}
            </div>
            //text messages
            //             {/* <input
            //     name='newMessage'
            //     type='text'
            //     value={message}
            //     onChange={handleInputChange}
            // > */}
            // {/* </input>
            // <button type='submit' onClick={() => handleSubmit()}>Send Message</button>
            // <ChatMessage
            //     messageChat={backMessage}
            // /> */}
    
    )
}

export default App;



