import React from 'react';

type videoCall = {
  video: React.LegacyRef<HTMLVideoElement>
  mediaOptions: { controls: boolean, style: { width: string, height: string }}
}

//{controls: true, style: {width: '', height: ''}}

/**
 * @param {HTMLVideoElement} video 
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
const VideoCall = ({ video, mediaOptions = { controls: true, style: { width: '640px', height: '360px'}}}: videoCall) => {
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

export default VideoCall;
