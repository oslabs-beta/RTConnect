"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingChannel = exports.actions = exports.VideoComponent = exports.Socket = void 0;
const VideoCall_1 = __importDefault(require("./components/VideoCall"));
const Socket_1 = __importDefault(require("./components/Socket"));
exports.Socket = Socket_1.default;
const VideoComponent_1 = __importDefault(require("./components/VideoComponent"));
exports.VideoComponent = VideoComponent_1.default;
const actions_1 = __importDefault(require("./constants/actions"));
exports.actions = actions_1.default;
const server_1 = __importDefault(require("../server/server"));
exports.SignalingChannel = server_1.default;
exports.default = VideoCall_1.default;
