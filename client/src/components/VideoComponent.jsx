import React from 'react'
import { useState } from 'react'


const VideoComponent = ({ handleCreateRoomClick, hasJoined, handleJoinRoomClick, joinRoom }) => {
  // const [hasJoined, setHasJoined] = useState(true)
  // const handleClick = async () => {
  //   try {
  //     // get local webcam permissions
  //     const myWebCam = await navigator.mediaDevices.getUserMedia({'video': true, 'audio': true});
  //     console.log('Got MediaStream:', myWebcam);
  //     myWebcam.getTracks().forEach((track) => console.log(track))

  //     // set video source to the local stream (myWebCam)
  //     const videoElement = document.querySelector('.localVideo');
  //     videoElement.srcObject = myWebCam;

  //   } catch (error) {
  //     console.error('Error accessing media devices.', error);
  //   }
  // }

return (
  <div>
    <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
      <button onClick={handleCreateRoomClick}>Create Room</button>
      <p className='createRoomText'></p>
      <button onClick={joinRoom}>Join Room</button>
      <input type='text'></input>
    </div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <video className="localVideo" autoPlay playsInline controls={true}/>
      <video className="remoteVideo" autoPlay playsInline controls={true}/>
    </div>
  </div>
)
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
  
}

export default VideoComponent

