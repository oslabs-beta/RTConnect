import React, { LegacyRef } from 'react';
declare type videoComponentType = {
    video: React.MutableRefObject<null> | LegacyRef<HTMLVideoElement>;
};
declare const VideoComponent: ({ video }: videoComponentType) => JSX.Element;
export default VideoComponent;
