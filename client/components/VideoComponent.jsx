import React from 'react'


const VideoComponent = ({handleCreateRoomClick}) => {
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
      <div>
        Video Component
      </div>
      
      <button onClick={handleCreateRoomClick}>Create Room</button>
      <input type='text'></input>

      {/* <button onClick={handleClick}>Join Room</button>
      <input type='text'></input> */}

      <video className="localVideo" autoPlay playsInline controls={false}/>

    </div>
  )
}

export default VideoComponent

