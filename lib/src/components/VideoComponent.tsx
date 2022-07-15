import React from 'react';

type videoComponent = {
  video: React.MutableRefObject<null> | React.LegacyRef<HTMLVideoElement>

}

const VideoComponent = ({ video }: videoComponent) => {
  return (
    <>
      <video 
        className="localVideo" 
        autoPlay
        playsInline
        controls={true}
        ref={video}
        style={{ width: '500px', height: '500px' }}
      />
    </>
  );
};

export default VideoComponent;
