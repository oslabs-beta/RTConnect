import React from "react";
import { useState } from "react";


function ChatMessage({ messageChat }) { //use destructuring
    // console.log('Message in ChatMessage ', message)
    return (
        <>
        <p>{`ID: ${messageChat.id} ${messageChat.message}`}</p>
        </>
    )
}

export default ChatMessage;