
/**
   * 
   * @type {object} A MediaStreamConstraints object is used when calling getUserMedia() to specify what kinds of tracks 
   * should be included in the returned MediaStream and to establish video and audio constraints for 
   * these tracks' settings. 
   * @type {boolean} The audio constraint indicates whether or not an audio track is requested. 
   * 
   * @type {object} The video constraint provides the constraints that must be met by the video track that is 
   * included in the returned MediaStream (essentially it gives constraints for the quality of the video
   * streams returned by the users's webcams). 
   */
const constraints: MediaStreamConstraints = {
  video: {
    width: { min:640, ideal:1920, max:1920 },
    height: { min:480, ideal:1080, max:1080 },
  },
  audio: true
};

export default constraints;