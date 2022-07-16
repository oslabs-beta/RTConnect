import Socket from "../../lib/src/components/Socket.jsx";
import VideoComponent from "../../lib/src/components/VideoComponent.jsx";
import PeerLogic from "./PeerLogic.jsx";

const Rtconnect = (URL) => {
    const ws = new Websocket(`wss://${URL}`);
        return (
        <Socket ws={ws} getusers={getusers}/>
    )
}