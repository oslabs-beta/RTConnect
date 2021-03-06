import React from 'react';
declare type videoComponent = {
    video: React.LegacyRef<HTMLVideoElement>;
    mediaOptions: {
        controls: boolean;
        style: {
            width: string;
            height: string;
        };
    };
};
/**
 * @param {HTMLVideoElement} video
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
declare const VideoComponent: ({ video, mediaOptions }: videoComponent) => JSX.Element;
export default VideoComponent;
