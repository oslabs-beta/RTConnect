/** 
   * @type {RTCConfiguration} configuration - The RTCConfiguration object is used to provide configuration options for how an RTCPeerConnection should be created.
   * 
   * @property {array} iceServers - An array of RTCIceServer objects, each describing one server which
   * may be used by the ICE agent. These servers are typically STUN and/or TURN servers. If this
   * property isn't specified, the connection attempt will be made with no STUN or TURN server
   * available, which limits the connection to local peers. 
   * 
   * STUN servers are used to identify users so that peers can connect to each other directly without
   * the use of a middleman server (which would create latency).
   * 
   * Another RTCIceServer is 'stun:stun2.l.google.com:19302'.
   * 
   * @property {number} iceCandidatePoolSize - specifies the size of the prefetched ICE candidate 
   * pool. The default value is 0 (meaning no candidate prefetching will occur). 
   * 
   * In some cases, connections can be established more quickly by allowing the ICE agent to start
   * fetching ICE candidates before the connection is started, so that ICE candidates are already
   * available to be inspected by the time RTCPeerConnection.setLocalDescription() is called. 
   * 
   * Changing the size of the ICE candidate pool may trigger the beginning of ICE trickling.
   * 
  */
const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],
  iceCandidatePoolSize: 10,
};

export default configuration;