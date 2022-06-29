import React from "react";
import { useState } from "react";
import chatMessage from "./chatMessage.jsx";
import { WebSocket } from "ws";



const App = () => {

    const ws = new WebSocket('ws://localhost:3001');

// whenever client connects to homepage,
    ws.onopen = () => {
    console.log('ws open');
    ws.send('open');
}

// // whenever client leaves the homepage
// ws.on('close', function close(){
//     ws.send('close')
// })
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
    console.log(`%c ${message}`, 'color: red')
    function handleSubmit(e){
        e.preventDefault()
        setMessageBoard([...messageBoard, message]);
        console.log(`%c ${messageBoard}`, 'color: blue');
        setMessage('');
        
    }

    const messageDisplay = messageBoard.map((el, i) => {
        <chatMessage message={el} key = {el}/>
    })
    return(
        <>
        <form>
            
            <input
            name='newMessage'
            type='text'
            value={message}
            onChange={handleInputChange}
            >
            </input>
            <button type="submit" onClick={() => handleSubmit}>Send Message</button>
        </form>
       <div>
        {messageDisplay}
       </div>
        </>
    )
}

export default App;



