"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const VideoComponent = ({ video }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("video", { className: "localVideo", autoPlay: true, playsInline: true, controls: true, ref: video, style: { width: '500px', height: '500px' } })));
};
exports.default = VideoComponent;
