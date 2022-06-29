import React from "react";
import { useState } from "react";
import ChatMessage from "./ChatMessage.jsx";


const ws = new WebSocket('ws://localhost:3001');

// whenever client connects to homepage,
ws.addEventListener('open', () => {
    console.log('Websocket connection has opened.');
    ws.send('I connected! Is the back-end able to see this?');
})

// ws.onmessage = (message) => {
//     console.log('line 15: onmessage in front end')
//     console.log("messageFromBack:", message.data);
//     console.log(message);
// }

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
        
    function handleInputChange(e) {
        setMessage(e.target.value);
    }
    // console.log(`%c ${message}`, 'color: green')
    function handleSubmit(e){
        e.preventDefault()
        setMessageBoard([...messageBoard, message]);
        
        setMessage('');
    }
    
    // console.log(`%c Message Board: ${messageBoard}`, 'color: blue')
    const messageDisplay = []

    // messageBoard.map((el, i) => {
    //     messageDisplay.push(<ChatMessage message={el} key={i}/>)
    // })
    ws.onmessage = (messageBack) => {
        console.log('line 15: onmessage in front end')
        console.log("messageFromBack:", messageBackBack.data);
        console.log(messageBack);
        // setMessage(messageBack.data)
    }
    // console.log('message Display: ', messageDisplay)
    return(
        <>
            <input
                name='newMessage'
                type='text'
                value={message}
                onChange={handleInputChange}
            >
            </input>
            <button type="submit" onClick={handleSubmit}>Send Message</button>
            <ChatMessage
                message={message}
            />
       <div>
        {/* {messageDisplay} */}
        {/* <ChatMessage/> */}
       </div>
        </>
    )
}

export default App;



