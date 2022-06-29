import React from "react";
import { useState } from "react";


function chatMessage(message) {
    console.log(`%c ${message}`, 'color: green')
    return (
        <>
        <p>{message}</p>
        </>
    )
}

export default chatMessage