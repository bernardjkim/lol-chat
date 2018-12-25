const mediaStreamConstraints = {
  audio: true,
  video: true
};

// attemp to get media devices, if successful pass local stream to cb function
export default function(cb) {
  navigator.mediaDevices
    .getUserMedia(mediaStreamConstraints)
    .then(cb)
    .catch(function(e) {
      alert("getUserMedia() error: " + e);
    });
}
