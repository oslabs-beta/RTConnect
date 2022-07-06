// If I uncomment ws.send on Line 135, an error occurs

import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import VideoComponent from '../../client/src/components/VideoComponent.jsx';
import Socket from '../../client/src/components/Socket.jsx'
import { LOGIN, ICECANDIDATE, OFFER, ANSWER } from '../../actions.js';


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

        switch (parsedData.ACTION_TYPE) {
            case LOGIN: 
                getUsers(parsedData);
            case OFFER:
                receiver = parsedData.sender  //swap receiver and sender
                createAnswer(parsedData);
                break;
            case ANSWER:
                addAnswer(parsedData);
                break;
            case ICECANDIDATE:
                if (peerConnection) {
                    await peerConnection.addIceCandidate(parsedData.payload)
                }
                break;
        }
    });

    const handleUsername = () => {
        const inputValue = document.querySelector('#username-field').value;

        const loginPayload = {
            ACTION_TYPE: LOGIN, 
            payload: inputValue
        }
        ws.send(JSON.stringify(loginPayload))
        setUsername(inputValue);
    }

    const getUsers = (data) => {
        setUsers(data.payload);
    }
    
    const handleOffer = () => {
        let inputField = document.querySelector('#receiverName');

        receiver = inputField.value;

        inputField.value = ''

        createOffer(receiver);
      }

    // listens for changes/event listeners
    const registerPeerConnectionListeners = async () => {
        console.log('registerPeerConnectionListners has activated');

        peerConnection.addEventListener('negotiationneeded', () => {
            console.log(
                `negotiationneeded event has fired`);
          });

        peerConnection.addEventListener('icegatheringstatechange', () => {
          console.log(
              `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
        });
      
        peerConnection.addEventListener('connectionstatechange', () => {
          console.log(`Connection state change: ${peerConnection.connectionState}`);
        });
      
        peerConnection.addEventListener('signalingstatechange', () => {
          console.log(`Signaling state change: ${peerConnection.signalingState}`);
        });
      
        peerConnection.addEventListener('iceconnectionstatechange ', () => {
          console.log(
              `ICE connection state change: ${peerConnection.iceConnectionState}`);
        });
    }

    // gets local webcam permissions and starts local stream
    const openUserMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            document.querySelector('.localVideo').srcObject = stream;
            localStream = stream;
            // await createPeerConnection(); // this fixes browser always starting up cam, have to click button if this is uncommented
        } catch (error) {
            console.log('Error in openUserMedia: ', error);
        }
    }

    // the functions that are in common for both createOffer and createAnswer
    const createPeerConnection = async () => {
        try {
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
                //potentially store this in an array, and send once is --> ICE gathering state changed: complete
            peerConnection.onicecandidate = async (event) => {
                if (event && event.candidate) { // whenever ice candidate is created
                    //console.log('Line 119 - New ICE candidate:', event.candidate);
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
            
        } catch (error) {
            console.log('Error in createPeerConnection: ', error);
        }
    }

    // peer 1: remoteDescription = offer and localDescription = offer

    // creates offer, sets LocalDescription, and sends offer and roomId
    const createOffer = async (receiver) => {
        try {
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
        } catch (error) {
            console.log('Error in createOffer: ', error);
        }
    }

    // peer 2: remoteDescription = offer and localDescription = answer
    // creates answer, sends it via ws
    const createAnswer = async (offer) => {
        try {
            await createPeerConnection();
            await peerConnection.setRemoteDescription(offer.payload);
            // create answer
            let answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer); // set answer as the local description,
    
            // after peer 2 creates answer, they have to send back their answer 
            
            registerPeerConnectionListeners();
    
            const answerPayload = {
                ACTION_TYPE: ANSWER,
                payload: answer,
                sender: offer.receiver,
                receiver: offer.sender
            };
            // ws.roomAnswer = answerPayload;
            ws.send(JSON.stringify(answerPayload));
        } catch (error) {
            console.log('Error in createAnswer: ', error);
        }
    }

    // Lets Peer 1 set their remote description after getting an answer back from peer 2
    const addAnswer = async (ans) => {
        console.log(ans, 'looking for this answer in the caller (first tab) \n----------------------------');
        console.log(ans.payload, 'looking for this payload in the caller (first tab) \n----------------------------');
        try {
            if (!peerConnection.currentRemoteDescription) {
                await peerConnection.setRemoteDescription(ans.payload)
            }
        } catch (error) {
            console.log('addAnswer error:', error);
        }
    }

    // const createRoom = async () => {
    //     // generate a room key and render on frontend
    //     document.querySelector('.createRoomText').innerHTML = 'ROOMKEY';
    //     console.log("Room Created")

    //     try {
    //         await openUserMedia(); // sets local video to local stream
    //     } catch (error) {
    //         console.log('usermedia not valid: ', error)
    //     }

    //     await createOffer();

    //     // handler for track events to handle inbound video and audio tracks that have been negotiated to be received by this peer connection
    //     peerConnection.ontrack = ({track, streams}) => {
    //         track.onunmute = () => {
    //           if (document.querySelector(".remoteVideo").srcObject) {
    //             console.log('working')
    //             return;
    //         }
    //           document.querySelector(".remoteVideo").srcObject = streams[0];
    //         };
    //     };

    //     registerPeerConnectionListeners();
    // }

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

    // const handleCreateRoomClick = async () => {
    //     try {
    //         // await createRoom();
            
    //     } catch (error) {
    //         console.error('Error accessing media devices.', error);
    //     }
    // }
      
    return(
        // <VideoComponent
        //     handleCreateRoomClick={handleCreateRoomClick}
        //     createRoom={createRoom}
        //     openUserMedia={openUserMedia}
        //     hasJoined={hasJoined}
        //     joinRoom={joinRoom}
        // />
        !username ? 
        <div>  
            <input type='text' placeholder='username' id="username-field"></input>
            <button onClick={() => handleUsername()}>Submit Username</button>
        </div>

        :


            <div>
                <VideoComponent
                    // handleCreateRoomClick={handleCreateRoomClick}
                    // createRoom={createRoom}
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



