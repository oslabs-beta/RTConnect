// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject

/*
const openUserMedia = async (): Promise<void> => {
  try {
    if (localVideo.current){
      localStream.current = localVideo.current.srcObject = await navigator.mediaDevices.getUserMedia(constraints); 
    }
  } catch (error) {
    console.log('Error in openUserMedia: ', error);
  }
};


// In this example, a MediaStream from a camera is assigned to a newly-created <video> element.
const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
const video = document.createElement('video');
video.srcObject = mediaStream;


// In this example, a new MediaSource is assigned to a newly-created <video> element.
const mediaSource = new MediaSource();
const video = document.createElement('video');
video.srcObject = mediaSource;

// First, a MediaStream from a camera is assigned to a newly-created <video> element, with fallback for older browsers.
const mediaStream = await navigator.mediaDevices.getUserMedia({video: true});
const video = document.createElement('video');
if ('srcObject' in video) {
  video.srcObject = mediaStream;
} else {
  // Avoid using this in new browsers, as it is going away.
  video.src = URL.createObjectURL(mediaStream);
}
*/