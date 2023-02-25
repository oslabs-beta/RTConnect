"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * @param props {HTMLVideoElement} video is either the local or remote video streams and mediaOptions control the dimensions of the video player.
 * @returns a video component that displays either the local or remote video streams.
 * Controls can be set to true to be able to pause/play video and adjust volumes of the streams.
 */
const VideoComponent = ({ video, mediaOptions = { controls: true, style: { width: '640px', height: '360px' } } }) => {
    const { controls, style } = mediaOptions;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("video", { className: "videoPlayer", autoPlay: true, playsInline: true, controls: controls, ref: video, style: style })));
};
exports.default = VideoComponent;
