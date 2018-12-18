module.exports = {
     modalStyle : {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "400px",
            overflow: "visible",
            border: "1px solid #e2dede"
        }
    },
     mediaStreamConstraints: {
        audio: true,
        video: true
    },

    pcConfig: {
        iceServers: [{
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
    language: [{
            id: 0,
            title: "EN",
            selected: true
        },
        {
            id: 1,
            title: "KO",
            selected: false
        },
        {
            id: 2,
            title: "JA",
            selected: false
        },
        {
            id: 3,
            title: "ZU",
            selected: false
        }
    ],
    // Set up audio and video regardless of what devices are present.
    sdpConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    }
}