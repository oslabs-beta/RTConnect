import React, { useContext } from 'react';
import { SocketContextProvider, SocketContext } from "../../SocketContext.jsx";
import { LOGIN } from '../../lib/src/constants/actions.js';

const InputButtons = () => {
    const { openUserMedia, handleUsername, handleOffer, setUserField } = useContext(SocketContext)
    return (
        <>
        <input type='text' placeholder='Enter your username' id="username-field" onChange={(e) => setUserField(e.target.value) } style={{paddingBottom:'70px', width:"200px"}} />
        <button onClick={() => handleUsername()} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Submit Username</button>
        <button onClick={() => openUserMedia()} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} style={{marginBottom:'25px', marginLeft:"200px", width: '200px'}}>Start Webcam</button>
        <button onClick={() => handleOffer()} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} style={{marginBottom:'25px', marginLeft:"400px", width: '200px'}}>Enter receiver name</button>
        <input type='text' placeholder="Enter other person's username" id='receiverName'style={{marginBottom:'3px'}} />
        </>
    )
}

export default InputButtons;

