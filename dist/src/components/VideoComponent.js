"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
//{controls: true, style: {width: '', height: ''}}
/**
 * @param {HTMLVideoElement} video
 * @returns a video component that is either the local or remote video stream
 * controls can be set to true to pause and adjust volumes of streams
 */
const VideoComponent = ({ video, mediaOptions = { controls: true, style: { width: '640px', height: '360px' } } }) => {
    const { controls, style } = mediaOptions;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("video", { className: "videoPlayer", autoPlay: true, playsInline: true, controls: controls, ref: video, style: style })));
};
exports.default = VideoComponent;
