/**
   *
   * @type {Object} A MediaStreamConstraints object is used when the openUserMedia function is invoked and it calls the WebRTC API method of getUserMedia() to specify what kinds of tracks
   * should be included in the returned MediaStream and to establish video and audio constraints for
   * these tracks' settings.
   * @property {object} video - The video constraint provides the constraints that must be met by the video track that is included in the returned MediaStream (essentially it gives constraints for the quality of the video streams returned by the users's webcams).
   * @property {object} video.width - video width constraint (min:640, ideal:1920, max:1920)
   * @property {object} video.height - video height constraint (min:480, ideal:1080, max:1080)
   * @property {boolean} audio - audio constraint that indicates whether or not an audio track is requested.
   *
   */
declare const constraints: MediaStreamConstraints;
export default constraints;
