import React from 'react';

type videoComponent = {
  video: React.LegacyRef<HTMLVideoElement>
}

/**
 * 
 * @param {} video 
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
const VideoComponent = ({ video }: videoComponent) => {
  return (
    <>
      <video 
        className="localVideo" 
        autoPlay
        playsInline
        controls={false}
        ref={video}
        style={{ width: '500px', height: '500px' }}
      />
    </>
  );
};

export default VideoComponent;
