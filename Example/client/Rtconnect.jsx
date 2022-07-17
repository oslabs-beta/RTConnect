import React, { useContext } from 'react';
import Socket from "../../lib/src/components/Socket.jsx";
import VideoComponent from "../../lib/src/components/VideoComponent.jsx";
import { SocketContextProvider, SocketContext } from "./SocketContext.jsx";

//<Rtconnect URL={"localhost:3001"} />
const Rtconnect = ({URL}) => {
    const ws = new WebSocket({URL});
    const { localVideo, remoteVideo, users, senders } = useContext(SocketContext)
    console.log('localVideo', localVideo)
    return (
        <>
        hi {users}
            <SocketContextProvider>
                <Socket ws={ws} />
                <VideoComponent />
                <VideoComponent />
            </SocketContextProvider>
        </>
    )
}

export default Rtconnect;