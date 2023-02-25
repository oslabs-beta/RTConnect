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
 * @param props {HTMLVideoElement} video is either the local or remote video streams and mediaOptions control the dimensions of the video player.
 * @returns a video component that displays either the local or remote video streams.
 * Controls can be set to true to be able to pause/play video and adjust volumes of the streams.
 */
declare const VideoComponent: ({ video, mediaOptions }: videoComponent) => JSX.Element;
export default VideoComponent;
