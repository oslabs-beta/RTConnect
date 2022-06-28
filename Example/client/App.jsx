import React from "react";
import { useState } from "react";


const App = () => {
    
    const [messageBoard, setMessageBoard] = useState([]);
    const [message, setMessage] = useState('');
        
    function handleInputChange(e) {
        setMessage(e.target.value);
        
    }
    console.log(`%c ${message}`, 'color: red')
    function handleSubmit(e){
        e.preventDefault()
        setMessageBoard([messageBoard, ...message]);
        console.log(`%c ${messageBoard}`, 'color: blue');
        setMessage('');
        
    }
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
        <textArea></textArea>
        </>
    )
}

export default App;



