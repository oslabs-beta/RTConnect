import React from 'react';

type videoComponent = {
  video: React.LegacyRef<HTMLVideoElement>
  mediaOptions: { controls: boolean, style: { width: string, height: string }}
}

/**
 * @param {HTMLVideoElement} video 
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
const VideoComponent = ({ video, mediaOptions = { controls: true, style: { width: '640px', height: '360px'}}}: videoComponent) => {
  const { controls, style } = mediaOptions;

  return (
    <>
      <video 
        className="videoPlayer" 
        autoPlay
        playsInline
        controls={controls}
        ref={video}
        style={style}
      />
    </>
  );
};

export default VideoComponent;
