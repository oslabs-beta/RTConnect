import React, { useState } from 'react';

const VideoComponent = ({ video }) => {

  return (
    <>
      <video autoPlay playsInline controls={true} ref={video} style={{ width: "500px", height: '500px' }}/>
    </>
    )
  }

export default VideoComponent;
