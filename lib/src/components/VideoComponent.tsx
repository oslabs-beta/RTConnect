import React from 'react';

type videoComponent = {
  video: React.LegacyRef<HTMLVideoElement>
  mediaOptions: { controls: boolean, style: { width: string, height: string }}
}

//{controls: true, style: {width: '', height: ''}}

/**
 * @param {HTMLVideoElement} video 
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
const VideoComponent = ({ video, mediaOptions }: videoComponent) => {
  const { controls, style } = mediaOptions;
  const defaultStyle = { width: '640px', height: '480px' };

  return (
    <>
      <video 
        className="videoPlayer" 
        autoPlay
        playsInline
        controls={(mediaOptions || controls) !== undefined ? controls : true}
        ref={video}
        style={(mediaOptions || style) !== undefined ? style : defaultStyle}
      />
    </>
  );
};

export default VideoComponent;
