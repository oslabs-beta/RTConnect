import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import VideoComponent from '../../client/components/VideoComponent.jsx';

const ws = new WebSocket('ws://localhost:3001');

// whenever client connects to homepage,
ws.addEventListener('open', () => {
    console.log('Websocket connection has opened.');
    ws.send('I connected! Is the back-end able to see this?');
})

ws.onmessage = (message) => {
    console.log("line 15: message.data, ws.onmessage, App.jsx ", message.data);
}

// ws.addEventListener('message', (message) => {
//     console.log("message.data:", message.data)
// })


const App = () => {

//     const ws = new WebSocket('ws://localhost:3001');

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

    const [messageBoard, setMessageBoard] = useState([]);
    const [message, setMessage] = useState('');
    const [backMessage, setBackMessage] = useState('');

    function handleInputChange(e) {
        setMessage(e.target.value);
    }
    // console.log(`%c ${message}`, 'color: green')
    function handleSubmit(){
        console.log('button clicked');
        
        // setMessageBoard([...messageBoard, message]);
        // console.log('message', message)
        ws.send(message)
        setMessage('');
    }
    
    // console.log(`%c Message Board: ${messageBoard}`, 'color: blue')
    const messageDisplay = []

    // messageBoard.map((el, i) => {
    //     messageDisplay.push(<ChatMessage message={el} key={i}/>)
    // })
    ws.onmessage = (messageBack) => { 
        // console.log('line 15: onmessage in front end')
        console.log("messageFromBack:", messageBack.data);
        // console.log(messageBack);
        setBackMessage(JSON.parse(messageBack.data));
    }

    // useEffect(() => {
    //     console.log('Effect used')
    // }, [backMessage])   

    // console.log('message Display: ', messageDisplay)
    // console.log('backMessage: ', backMessage);

    const handleCreateRoomClick = async () => {
        try {
          // get local webcam permissions
          const myWebcam = await navigator.mediaDevices.getUserMedia({'video': true, 'audio': true});
          console.log('Got MediaStream:', myWebcam);

          myWebcam.getTracks().forEach((track) => console.log(track))
    
          // set video source to the local stream (myWebCam)
          const videoElement = document.querySelector('.localVideo');
          videoElement.srcObject = myWebcam;
    
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
                />
            </div>
        </>
    )
}

export default App;



