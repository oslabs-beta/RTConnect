import React, { useState, useRef } from "react";
import VideoComponent from '../../lib/components/VideoComponent.tsx';
import Socket from '../../lib/components/Socket.tsx'
import { LOGIN, ICECANDIDATE, OFFER, ANSWER } from '../../lib/components/actions.js';
import { Button, Input, Container, Divider } from "@mantine/core";
// import logo from '../assets/logo.png';

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
      
    return(
        !username ? 
        <>
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