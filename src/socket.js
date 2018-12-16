import io from "socket.io-client";

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;

var pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

var localVideo = document.querySelector("#localVideo");
var remoteVideo = document.querySelector("#remoteVideo");

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived, onMembersReceived) {
    socket.on("chat-message", onMessageReceived);
    socket.on("members", onMembersReceived);
  }

  function setLanguage(language) {
    socket.emit("language", language);
  }

  function setUsername(username) {
    socket.emit("register", username);
  }

  function unregisterHandler() {
    socket.off("chat-message");
    socket.off("members");
  }

  function message(msg, chatroomName) {
    socket.emit("chat-message", { chatroomName, msg });
  }

  function joinRoom(chatroomName) {
    socket.emit("join", chatroomName);
    isChannelReady = true;
    isInitiator = true;
  }

  function sendMessage(message) {
    console.log("Client sending message: ", message);
    socket.emit("message", message);
  }

  // This client receives a message
  socket.on("message", function(message) {
    console.log("Client received message:", message);
    if (message === "got user media") {
      maybeStart();
    } else if (message.type === "offer") {
      if (!isInitiator && !isStarted) {
        maybeStart();
      }
      pc.setRemoteDescription(new RTCSessionDescription(message));
      doAnswer();
    } else if (message.type === "answer" && isStarted) {
      pc.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === "candidate" && isStarted) {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      });
      pc.addIceCandidate(candidate);
    } else if (message === "bye" && isStarted) {
      handleRemoteHangup();
    }
  });

  //////////////////////////////////////////////////////////////////////////////

  function gotStream(stream) {
    console.log("Adding local stream.");
    localStream = stream;
    localVideo.srcObject = stream;
    sendMessage("got user media");
  }

  function maybeStart() {
    console.log(
      ">>>>>>> maybeStart() ",
      isStarted,
      localStream,
      isChannelReady
    );
    if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
      console.log(">>>>>> creating peer connection");
      createPeerConnection();
      pc.addStream(localStream);
      isStarted = true;
      console.log("isInitiator", isInitiator);
      if (isInitiator) {
        doCall();
      }
    }
  }

  window.onbeforeunload = function() {
    sendMessage("bye");
  };

  function createPeerConnection() {
    try {
      pc = new RTCPeerConnection(null);
      pc.onicecandidate = handleIceCandidate;
      pc.onaddstream = handleRemoteStreamAdded;
      pc.onremovestream = handleRemoteStreamRemoved;
      console.log("Created RTCPeerConnnection");
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
      alert("Cannot create RTCPeerConnection object.");
      return;
    }
  }

  function handleIceCandidate(event) {
    console.log("icecandidate event: ", event);
    if (event.candidate) {
      sendMessage({
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log("End of candidates.");
    }
  }

  function handleCreateOfferError(event) {
    console.log("createOffer() error: ", event);
  }

  function doCall() {
    console.log("Sending offer to peer");
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
  }

  function doAnswer() {
    console.log("Sending answer to peer.");
    pc.createAnswer().then(
      setLocalAndSendMessage,
      onCreateSessionDescriptionError
    );
  }

  function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log("setLocalAndSendMessage sending message", sessionDescription);
    sendMessage(sessionDescription);
  }

  function onCreateSessionDescriptionError(error) {
    console.error(error);
    // trace("Failed to create session description: " + error.toString());
  }

  function requestTurn(turnURL) {
    var turnExists = false;
    for (var i in pcConfig.iceServers) {
      if (pcConfig.iceServers[i].urls.substr(0, 5) === "turn:") {
        turnExists = true;
        turnReady = true;
        break;
      }
    }
    if (!turnExists) {
      console.log("Getting TURN server from ", turnURL);
      // No TURN server. Get one from computeengineondemand.appspot.com:
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var turnServer = JSON.parse(xhr.responseText);
          console.log("Got TURN server: ", turnServer);
          pcConfig.iceServers.push({
            urls: "turn:" + turnServer.username + "@" + turnServer.turn,
            credential: turnServer.password
          });
          turnReady = true;
        }
      };
      xhr.open("GET", turnURL, true);
      xhr.send();
    }
  }

  function handleRemoteStreamAdded(event) {
    console.log("Remote stream added.");
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
  }

  function handleRemoteStreamRemoved(event) {
    console.log("Remote stream removed. Event: ", event);
  }

  function hangup() {
    console.log("Hanging up.");
    stop();
    sendMessage("bye");
  }

  function handleRemoteHangup() {
    console.log("Session terminated.");
    stop();
    isInitiator = false;
  }

  function stop() {
    isStarted = false;
    pc.close();
    pc = null;
  }

  return {
    registerHandler,
    unregisterHandler,
    message,
    setUsername,
    setLanguage,
    joinRoom,
    sendMessage
  };
}
