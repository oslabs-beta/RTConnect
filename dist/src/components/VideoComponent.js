"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const VideoComponent = ({ video }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("video", { className: "localVideo", autoPlay: true, playsInline: true, controls: true, ref: video, style: { width: "500px", height: '500px' } })));
};
//   <div>
//     <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
//       <button onClick={openUserMedia}>Start Webcam</button>
//       {/* <button onClick={handleCreateRoomClick}>Create Room</button> */}
//       <button onClick={handleCreateRoomClick}>Create Room</button>
//       <p className='createRoomText'></p>
//       <button onClick={handleOffer}>Enter receiver name</button>
//       <input type='text' id='receiverName'></input>
//     </div>
//     <div style={{display: 'flex', justifyContent: 'center'}}>
//       <div className="localVideo-div">
//         <video className="localVideo" autoPlay playsInline controls={true} style={{ width: "400px", height: '300px' }}/>
//         <p className='peer-names peer-1'></p>
//       </div>
//       <div className="remoteVideo-div">
//         <video className="remoteVideo" autoPlay playsInline controls={true} style={{ width: "400px", height: '300px' }}/>
//         <p className='peer-names peer-2'></p>
//       </div>
//     </div>
//     <div style={{display: 'flex', justifyContent: 'center'}}>
//       <button style={{borderRadius:'100%', padding: '10px', justifyItems: 'center', backgroundColor: 'red'}}>End Call</button>
//     </div>
//   </div>
// )
//rooms
// return (
//   !hasJoined ? 
//   <div>
//     <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
//       <button onClick={handleCreateRoomClick}>Create Room</button>
//       <p className='createRoomText'></p>
//       <button onClick={() => {hasJoined = !hasJoined}}>Join Room</button>
//     </div>
//   <div style={{display: 'flex', justifyContent: 'center'}}>
//     <video className="localVideo" autoPlay playsInline controls={true} width='80%'/>
//   </div>
//   </div>
//   /********************TENERARY********************/ 
//   :
//   <div>
//     <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
//       <button onClick={handleCreateRoomClick}>Create Room</button>
//       <p className='createRoomText'></p>
//     </div>
//     <button onClick={handleClick}>Join Room</button>
//     <input type='text'></input>
//   <div style={{display: 'flex', justifyContent: 'center'}}>
//     <video className="localVideo" autoPlay playsInline controls={true}/>
//     <video className="remoteVideo" autoPlay playsInline controls={true}/>
//   </div>
//   </div>
// )
exports.default = VideoComponent;
