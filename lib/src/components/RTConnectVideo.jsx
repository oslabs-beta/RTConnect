import React, { useState } from 'react';


const RTConnectVideo = ({ video }) => {

  return (
    <>
      <video className="rtconnect-video" autoPlay playsInline controls={true} ref={video} style={{ width: "500px", height: '500px' }}/>
    </>
    )
  }
export default RTConnectVideo;
