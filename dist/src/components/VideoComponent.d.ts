import React from 'react';
declare type videoComponent = {
    video: React.MutableRefObject<null> | React.LegacyRef<HTMLVideoElement>;
};
declare const VideoComponent: ({ video }: videoComponent) => JSX.Element;
export default VideoComponent;
