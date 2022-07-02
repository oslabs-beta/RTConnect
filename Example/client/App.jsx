import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import VideoComponent from '../../client/components/VideoComponent.jsx';

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

// ws.addEventListener('message', (message) => {
//     console.log("message.data:", message.data)
// })

// // whenever client connects to homepage,
//     ws.addEventListener('open', () => {
//     console.log('Websocket connection has opened.');
//     // ws.send('open');
// })

// // whenever client leaves the homepage
// ws.on('close', function close(){
//     ws.send('close')
// }) ws.onopen
// ws.on('message', function message(data){
//     ws.send('recieved ', data)
// })
// ws.on('error', function error(){
//     ws.send('error')
// })

const App = () => {

    const [messageBoard, setMessageBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [backMessage, setBackMessage] = useState('');

    function handleInputChange(e) {
        setMessage(e.target.value);
    }

    // console.log(`%c ${message}`, 'color: green')
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

    const handleCreateRoomClick = async () => {
        try {
            // used this: https://www.youtube.com/watch?v=woXCVJyi_IY&list=PL34gl7XmgyxT4p6-nMgddxdl18S1Xpczr&index=19
            // 3:00
            // After creating room button is clicked, create RTCPeerConnection object
            const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

            const peerConnection = new RTCPeerConnection(configuration); //config -- ice: stun server

            // generate a room key and render on frontend
            document.querySelector('.createRoomText').innerHTML = 'hashed room key';

            // get local webcam permissions
            const myWebcam = await navigator.mediaDevices.getUserMedia({'video': true, 'audio': true});

            const videoElement = document.querySelector('.localVideo'); // grab video player
            
            // set video source to the local stream (myWebCam)
            videoElement.srcObject = myWebcam;

            // Set up SDP Answer

            // User will create RTC Data channel for data transfer
            // User will create WebRTC Offer
            // User will create WebRTC Answer
            // Each user has to send ICE candidate
            // All offer, answer and ICE sent through server (server maintains user session)

            // only triggered if answer is sent back
            ws.addEventListener('message', async message => {

                switch(message.action_type){
                    case "ANSWER":
                        const answerDesc = new RTCSessionDescription(message.answer);
                        await peerConnection.setRemoteDescription(answerDesc);

                    case "OFFER":
                        const offerDesc = new RTCSessionDescription(message.offer);
                        peerConnection.setRemoteDescription(offerDesc)
                        const answer = await peerConnection.createAnswer()
                        await peerConnection.setLocalDescription(answer)
                        ws.send({'answer': answer})
                }
            });

            // call createOffer() to create a RTCSessionDescription object
            const RTCSessionDescriptionOffer = await peerConnection.createOffer();
            // This session description is set as the local description using setLocalDescription()
            await peerConnection.setLocalDescription(RTCSessionDescriptionOffer);
            console.log('RTCSessionDescriptionOffer:', RTCSessionDescriptionOffer);

            // sending this offer via websocket to the backend. 
            const payload = {
                action_type: 'OFFER',
                offer: RTCSessionDescriptionOffer, // RTCSessionDescriptionOffer[sdp]
            }

            // This session description is then sent over our signaling channel to the receiving side
            // send offer
            ws.send(JSON.stringify(payload)); // payload
            // ws.send(payload);

            // ws.send({'offer': RTCSessionDescriptionOffer});
    
        
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

                <VideoComponent
                    handleCreateRoomClick={handleCreateRoomClick}
                    autoplay
                />
            </div>
        </>
    )
}

export default App;



