import React from 'react'
import { useState } from 'react'


const VideoComponent = ({handleCreateRoomClick}) => {
  const [hasJoined, setHasJoined] = useState(true)
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

  return (!hasJoined ? 

    <div>
      <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
        <button onClick={handleCreateRoomClick}>Create Room</button>
        
        <button>Join Room</button>
        <p className='createRoomText'></p>
      </div>


    <div style={{display: 'flex', justifyContent: 'center'}}>
      <video className="localVideo" autoPlay playsInline controls={true}/>
      
    </div>


    </div>
    /********************TENERARY********************/ 
    :
    <div>
      <div style={{display: 'flex', justifyContent: 'space-around', border: '1px solid black'}}>
        <button onClick={handleCreateRoomClick}>Create Room</button>
        <p className='createRoomText'></p>
      </div>

      {/* <button onClick={handleClick}>Join Room</button>
      <input type='text'></input> */}
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <video className="localVideo" autoPlay playsInline controls={true}/>
      <video className="remoteVideo" autoPlay playsInline controls={true}/>
      
    </div>


    </div>

  )
  
}

export default VideoComponent

