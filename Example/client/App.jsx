import React, { useState, useRef } from "react";
import VideoComponent from '/dist/src/components/VideoComponent';
import Socket from '../../dist/src/components/Socket'
// import { LOGIN, ICECANDIDATE, OFFER, ANSWER } from '../../dist/src/constants/actions.js';
import actions from "../../dist/src/constants/actions";
import { Button, Input, Container, Divider } from "@mantine/core";
import logo from '../assets/logo.png';

const { LOGIN, ICECANDIDATE, OFFER, ANSWER } = actions

const App = () => {
    
    const [ws, setWs] = useState(new WebSocket("ws://localhost:3001"));
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

    const localVideo = useRef();
    const remoteVideo = useRef();
    const peerRef = useRef(); 
    const otherUser = useRef();
    const localStream = useRef();
    const senders = useRef([]);


    //maybe try to use context/reference hooks here
    let userField = null;
    let receiver = null;

    // let peerConnection = null;
    // let localStream = null;
    // let remoteStream = null;
    // let roomId = null;
    
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

    // function handleInputChange(e) {
    //     setMessage(e.target.value);
    // }

    // function handleSubmit(){
    //     console.log(`%c line 50 - handleSubmit button clicked: App.jsx, handleSubmit(), message: ${message}`, 'color: green');
    //     ws.send(message)
    //     setMessage('');
    // }

    const handleUsername = () => {
        const loginPayload = {
            ACTION_TYPE: LOGIN, 
            payload: userField
        }

        ws.send(JSON.stringify(loginPayload))
        setUsername(userField);
    }

    const getUsers = (data) => {
        const userList = data.payload.map(name => (
            <div>{name}</div>
        ))
        setUsers(userList);
    }
    
    const handleOffer = () => {
        let inputField = document.querySelector('#receiverName');
        receiver = inputField.value;
        inputField.value = ''

        otherUser.current = receiver;
        callUser(receiver);
      }

    const openUserMedia = async () => {
        try {
            localStream.current = localVideo.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
        } catch (error) {
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
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const offerPayload = {
                ACTION_TYPE: OFFER,
                sender: username,
                receiver: userID,
                payload: peerRef.current.localDescription
            };
            ws.send(JSON.stringify(offerPayload));
        }).catch(e => console.log(e));
    }


    function handleReceiveCall(data) {
        otherUser.current = data.sender;
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(data.payload);
        peerRef.current.setRemoteDescription(desc).then(() => {
            localStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, localStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
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

    function handleNewIceCandidateMsg(data) {
        const candidate = new RTCIceCandidate(data.payload);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        remoteVideo.current.srcObject = e.streams[0];
    };

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

    // listens for changes/event listeners
    // const registerPeerConnectionListeners = async () => {
    //     console.log('registerPeerConnectionListners has activated');

    //     peerConnection.addEventListener('negotiationneeded', () => {
    //         console.log(
    //             `negotiationneeded event has fired`);
    //       });

    //     peerConnection.addEventListener('icegatheringstatechange', () => {
    //       console.log(
    //           `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    //     });
      
    //     peerConnection.addEventListener('connectionstatechange', () => {
    //       console.log(`Connection state change: ${peerConnection.connectionState}`);
    //     });
      
    //     peerConnection.addEventListener('signalingstatechange', () => {
    //       console.log(`Signaling state change: ${peerConnection.signalingState}`);
    //     });
      
    //     peerConnection.addEventListener('iceconnectionstatechange ', () => {
    //       console.log(
    //           `ICE connection state change: ${peerConnection.iceConnectionState}`);
    //     });
    // }

    // // gets local webcam permissions and starts local stream
    // const openUserMedia = async () => {
    //     try {
    //         let stream = await navigator.mediaDevices.getUserMedia(constraints); //let stream before
    //         document.querySelector('.localVideo').srcObject = stream;
    //         localStream = stream;
    //         console.log(localStream, stream);
    //         // await createPeerConnection(); // this fixes browser always starting up cam, have to click button if this is uncommented
    //     } catch (error) {
    //         console.log('Error in openUserMedia: ', error);
    //     }
    // }

    // // the functions that are in common for both createOffer and createAnswer
    // const createPeerConnection = async () => {
    //     try {
    //         peerConnection = new RTCPeerConnection(configuration);
    //         remoteStream = new MediaStream();
    //         document.querySelector('.remoteVideo').srcObject = remoteStream; 
    
    
    //         if (!localStream) {
    //             openUserMedia();
    //             console.dir(localStream)
    //         }
    //         // media tracks are then added to the RTCPeerConnection by passing them into addTrack(). 
    //         localStream.getTracks().forEach((track) => {
    //             console.log('Line 105 - localstream TRACK', track);
    //             peerConnection.addTrack(track, localStream);
    //         });
    
    //         // event listener for when our peer adds tracks 
    //         peerConnection.ontrack = (event) => {
    //             console.log('Got remote track:', event.streams[0]);
    //             event.streams[0].getTracks().forEach((track) => {
    //               remoteStream.addTrack(track);
    //             });
    //         };
    
    //         // event listener whenever we create an ICE candidate
    //             //potentially store this in an array, and send once is --> ICE gathering state changed: complete
    //         peerConnection.onicecandidate = async (event) => {
    //             if (event && event.candidate) { // whenever ice candidate is created
    //                 //console.log('Line 119 - New ICE candidate:', event.candidate);
    //                 console.log(peerConnection);
    
    //                 // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
    //                 //event.candidate contains ice candidate to be sent to remote peer (callee)
                    
    //                 const icePayload = {
    //                     ACTION_TYPE: ICECANDIDATE,
    //                     payload: event.candidate,
    //                     sender: username,
    //                     receiver: receiver
    //                 };
    //                 // ws.iceCandidate = icePayload;
    //                 ws.send(JSON.stringify(icePayload));
    //             }
    //         }
    //         registerPeerConnectionListeners();
            
    //     } catch (error) {
    //         console.log('Error in createPeerConnection: ', error);
    //     }
    // }

    // // peer 1: remoteDescription = offer and localDescription = offer

    // // creates offer, sets LocalDescription, and sends offer and roomId
    // const createOffer = async (receiver) => {
    //     try {
    //         await createPeerConnection();

    //         // create offer
    //         let offer = await peerConnection.createOffer();
    //         console.log(`%c MY OFFER ${ JSON.stringify(offer) }`, 'color: red')
    //         await peerConnection.setLocalDescription(offer);
    
    //         const offerPayload = {
    //             ACTION_TYPE: OFFER,
    //             payload: offer, // must be full SDP object with type or else causes error when setting remoteDescription on peerConnection obj
    //             sender: username,
    //             receiver: receiver
    //         };
    
    //         // each video chat session = a room. A user can create a new room by clicking Create Room button. This will generate an ID that the remote party can use to join the same room.
    //         // roomId = 'ROOMKEY';
    //         // ws.roomId = roomId;
    
    //         // ws.roomOffer = payload;
    //         ws.send(JSON.stringify(offerPayload));
    
    //         console.log("Line 161 - peerConnection: ", peerConnection);
    //     } catch (error) {
    //         console.log('Error in createOffer: ', error);
    //     }
    // }

    // // peer 2: remoteDescription = offer and localDescription = answer
    // // creates answer, sends it via ws
    // const createAnswer = async (offer) => {
    //     try {
    //         await createPeerConnection();
    //         console.log(offer, peerConnection);
    //         await peerConnection.setRemoteDescription(offer.payload);
    //         // create answer
    //         let answer = await peerConnection.createAnswer();
    //         await peerConnection.setLocalDescription(answer); // set answer as the local description,
    
    //         // after peer 2 creates answer, they have to send back their answer 
            
    //         registerPeerConnectionListeners();
    
    //         const answerPayload = {
    //             ACTION_TYPE: ANSWER,
    //             payload: answer,
    //             sender: offer.receiver,
    //             receiver: offer.sender
    //         };
    //         // ws.roomAnswer = answerPayload;
    //         ws.send(JSON.stringify(answerPayload));
    //     } catch (error) {
    //         console.log('Error in createAnswer: ', error);
    //     }
    // }

    // // Lets Peer 1 set their remote description after getting an answer back from peer 2
    // const addAnswer = async (ans) => {
    //     console.log(ans, 'looking for this answer in the caller (first tab) \n----------------------------');
    //     console.log(ans.payload, 'looking for this payload in the caller (first tab) \n----------------------------');
    //     try {
    //         if (!peerConnection.currentRemoteDescription) {
    //             await peerConnection.setRemoteDescription(ans.payload)
    //         }
    //     } catch (error) {
    //         console.log('addAnswer error:', error);
    //     }
    // }

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
        !username ? 
        <>
        <img src={logo} style={{width: 'auto', height: '13%'}}/>
        <Container>
            

            <div style={{display: 'flex', flexDirection:"column", top: '20%', left: '28%', margin: '0 auto', marginTop:'10%', height: '300px', width: '600px', border: '2px green', borderStyle: 'solid', borderRadius: '25px', justifyContent: 'center', alignItems: 'center'}}>  

                
                <br />
                   
                    <Input type='text' placeholder='username' id="username-field" onChange={(e) => userField = e.target.value } style={{paddingBottom:'70px', width:"200px"}}></Input>
                    <Button onClick={() => handleUsername()} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Submit Username</Button>
            </div>
        </Container>
        </>
        :

        <>
            <Socket ws={ws} getUsers={getUsers} handleReceiveCall={handleReceiveCall} handleAnswer={handleAnswer} handleNewIceCandidateMsg={handleNewIceCandidateMsg} />

                <img src={logo} style={{width: 'auto', height: '13%'}}/>
            <div style={{display: 'flex', justifyContent: 'space-around', border: '2px green', borderRadius: '8px', flexDirection:"column", padding:"10px", marginTop: "10%"} }>


                <div id="main-video-container" style= {{display: 'flex', flexDirection: 'row', gap: '100px', justifyContent:"center", alignItems:"center"}}>
                        <div>
                            Users connected:
                            {users}
                        </div>
                    <div id="local-video-container">
                        <VideoComponent
                            video={localVideo}
                        />
                    </div>
                <div id="remote-video-container">
                    <VideoComponent
                        video={remoteVideo}
                    />
                    </div>
                </div>

                <div id="button-container" style= {{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent:"center", marginTop:"10px"}}>
                <Button onClick={openUserMedia} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} style={{marginBottom:'25px', marginLeft:"200px", width: '200px'}}>Start Webcam</Button>
                <Divider size="xs" />
                <Button onClick={handleOffer} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} style={{marginBottom:'25px', marginLeft:"400px", width: '200px'}}>Call</Button>
                <Divider size="xs" />
                <Input type='text' id='receiverName'style={{marginBottom:'3px'}}></Input>
                <Divider size="md" />
                </div>
            </div>
        </>
    )
}

export default App;



