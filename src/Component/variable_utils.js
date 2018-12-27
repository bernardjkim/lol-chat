module.exports = {
  pcConfig: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      },
      {
        urls: [
          "turn:webrtcweb.com:7788", // coTURN 7788+8877
          "turn:webrtcweb.com:4455?transport=udp", // restund udp

          "turn:webrtcweb.com:8877?transport=udp", // coTURN udp
          "turn:webrtcweb.com:8877?transport=tcp" // coTURN tcp
        ],
        username: "muazkh",
        credential: "muazkh"
      }
    ]
  },
  // Set up audio and video regardless of what devices are present.
  sdpConstraints: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  }
};
