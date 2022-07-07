import React from 'react'
import { useState } from 'react'
import { Button, Input, Container, Grid, Center } from "@mantine/core";

const VideoComponent = ({ handleCreateRoomClick, hasJoined, openUserMedia, createRoom, handleOffer }) => {

  

  
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
  <div style={{display: 'flex' , flexDirection: 'column', gap: '100px'}}>
    <div style={{display: 'flex', justifyContent: 'center', border: '1px solid black', margin: '10px'}}>
      <Button onClick={openUserMedia} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Start Webcam</Button>

      {/* <button onClick={handleCreateRoomClick}>Create Room</button> */}
      <Button onClick={handleCreateRoomClick} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Create Room</Button>
      <p className='createRoomText'></p>
    </div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Input type='text' id='receiverName'></Input>
      <Button onClick={handleOffer}  variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Enter receiver name</Button>
    </div>

    <div>
    <div style={{display: 'flex', justifyContent: 'center', gap: '50px'}}>
      <div className="localVideo-div">
        <video className="localVideo" autoPlay playsInline controls={true} style={{ width: "400px", height: '300px' }}/>
        <p className='peer-names peer-1'></p>
      </div>

      <div className="remoteVideo-div">
        <video className="remoteVideo" autoPlay playsInline controls={true} style={{ width: "400px", height: '300px' }}/>
        <p className='peer-names peer-2'></p>
      </div>
    </div>
    </div>

    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Button style={{borderRadius:'100%', padding: '10px', justifyItems: 'center', backgroundColor: 'red'}}>End Call</Button>
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

