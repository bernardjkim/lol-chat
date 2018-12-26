import React from "react";
import Variables from "./variable_utils";

class AudioStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionList: {
        // [id]: {
        //    pc: PeerConnection,
        //    stream: remote stream
        // }
      },
      remoteStreams: {},
      videoRefs: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.client && prevProps.client !== this.props.client) {
      this.props.client.videoHandler(this.messageHandler);
    }
  }

  maybeStart = socketId => {
    console.log(">>>>>>> maybeStart() ", this.props.localStream);
    if (this.props.localStream && !this.state.connectionList[socketId]) {
      console.log(">>>>>> creating peer connection");
      this.createPeerConnection(socketId);
      this.state.connectionList[socketId].addStream(this.props.localStream);
    }
  };

  createPeerConnection = socketId => {
    try {
      var pc = new RTCPeerConnection(Variables.pcConfig);
      pc.onicecandidate = this.handleIceCandidate(socketId);
      pc.onaddstream = this.handleRemoteStreamAdded(socketId);
      pc.onremovestream = this.handleRemoteStreamRemoved(socketId);

      this.setState({
        connectionList: { ...this.state.connectionList, [socketId]: pc }
      });
      console.log("Created RTCPeerConnnection");
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
      alert("Cannot create RTCPeerConnection object.");
      return;
    }
  };

  handleIceCandidate = socketId => event => {
    console.log("icecandidate event: ", event);
    if (event.candidate) {
      this.props.client.sendPrivate(socketId, {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log("End of candidates.");
    }
  };

  handleRemoteStreamAdded = socketId => event => {
    console.log("Remote stream added.");
    this.setState({
      remoteStreams: { ...this.state.remoteStreams, [socketId]: event.stream }
    });
  };

  handleRemoteStreamRemoved = socketId => event => {
    console.log("Remote stream removed. Event: ", event);
    var remoteStreams = this.state.remoteStreams;
    delete remoteStreams[socketId];
    this.setState({
      remoteStreams
    });
  };

  handleCreateOfferError(event) {
    console.log("createOffer() error: ", event);
  }

  doCall = socketId => {
    console.log("Sending offer to peer");

    this.state.connectionList[socketId].createOffer(
      this.setLocalAndSendMessage(socketId),
      this.handleCreateOfferError
    );
  };

  setLocalAndSendMessage = socketId => sessionDescription => {
    console.log("set local description for: ", socketId);
    this.state.connectionList[socketId].setLocalDescription(sessionDescription);
    console.log("setLocalAndSendMessage sending message", sessionDescription);
    this.props.client.sendPrivate(socketId, sessionDescription);
  };

  onCreateSessionDescriptionError(error) {
    console.log("Failed to create session description: " + error.toString());
    // trace("Failed to create session description: " + error.toString());
  }

  doAnswer = socketId => {
    console.log("Sending answer to peer.");
    this.state.connectionList[socketId]
      .createAnswer()
      .then(
        this.setLocalAndSendMessage(socketId),
        this.onCreateSessionDescriptionError
      );
  };

  handleRemoteHangup = socketId => {
    console.log("Session terminated.");
    this.stop(socketId);
  };

  stop = socketId => {
    var pc = this.state.connectionList[socketId];
    if (pc) {
      pc.close();
      var connectionList = this.state.connectionList;
      delete connectionList[socketId];
      var remoteStreams = this.state.remoteStreams;
      delete remoteStreams[socketId];
      this.setState({
        connectionList,
        remoteStreams
      });
    }
  };

  // This client receives a message
  messageHandler = message => {
    console.log("Client received message:", message);
    if (message.type === "joined") {
      if (!this.state.connectionList[message.socketId]) {
        this.maybeStart(message.socketId);
        this.doCall(message.socketId);
      }
    } else if (message.type === "offer") {
      if (!this.state.connectionList[message.socketId]) {
        this.maybeStart(message.socketId);
        this.state.connectionList[message.socketId].setRemoteDescription(
          new RTCSessionDescription(message)
        );
        this.doAnswer(message.socketId);
      }
    } else if (message.type === "answer") {
      if (
        this.state.connectionList[message.socketId] &&
        !this.state.connectionList[message.socketId].remoteDescription
      ) {
        this.state.connectionList[message.socketId].setRemoteDescription(
          new RTCSessionDescription(message)
        );
      }
    } else if (message.type === "candidate") {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      });
      if (this.state.connectionList[message.socketId]) {
        this.state.connectionList[message.socketId].addIceCandidate(candidate);
      }
    } else if (message.type === "bye") {
      this.handleRemoteHangup(message.socketId);
    }
  };

  render() {
    return (
      <div id="audios">
        {Object.keys(this.state.remoteStreams).map(socketId => (
          <Audio key={socketId} stream={this.state.remoteStreams[socketId]} />
        ))}
      </div>
    );
  }
}

class Audio extends React.Component {
  componentDidMount() {
    this.audio.srcObject = this.props.stream;
  }
  render() {
    return (
      <audio
        id={this.props.stream.id}
        autoPlay
        ref={ref => {
          this.audio = ref;
        }}
      />
    );
  }
}

export default AudioStream;
