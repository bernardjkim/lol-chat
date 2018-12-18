import React from "react";
import Modal from "react-modal";

import socket from "../socket";
import UsernameForm from "./UsernameForm";
import Dropdown from "./Dropdown";

const modalStyle = {
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
};

const mediaStreamConstraints = {
  audio: true,
  video: true
};

var pcConfig = {
  iceServers: [
    {
<<<<<<< HEAD
      urls: "stun:stun.l.google.com:19302",

=======
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
>>>>>>> 4e89ad055881d19319f4e8d8a995378d4fd7da8a
    }
  ]
};

// var pcConfig = {
//   iceServers: [
//     {
//       urls: "stun:stun.l.google.com:19302"
//     }
//   ]
// };

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: false,
      chatroom: "default",
      members: [],
      messages: [],
      username: "",
      msg: "",
      modalOpen: true,
      localStream: false,
      isStarted: false,
      connectionList: {
        // [id]: {
        //    pc: PeerConnection,
        //    stream: remote stream
        // }
      },
      remoteStreams: {},
      videoRefs: {},

      // TOOD: move to separate file?
      //https://cloud.google.com/translate/docs/languages
      language: [
        {
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
      ]
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  toggleSelected = id => {
    let temp = JSON.parse(JSON.stringify(this.state.language));
    temp[id].selected = !temp[id].selected;
    this.setState({
      language: temp
    });
  };

  resetThenSet = id => {
    let temp = JSON.parse(JSON.stringify(this.state.language));
    temp.forEach(item => (item.selected = false));
    temp[id].selected = true;
    this.setState({
      language: temp
    });

    // send language pref to server
    this.state.client.setLanguage(temp[id].title);
  };

  // append msg to list our list of messages
  onMessageReceived = ({ msg, username }) => {
    this.setState({
      messages: [...this.state.messages, { username, msg }]
    });
  };

  onMembersReceived = members => {
    this.setState({ members });
  };

  // Close/ Open Modal for username
  closeUsernameModal() {
    this.setState({ modalOpen: false });
  }

  // send smg to server
  handleSubmit = e => {
    e.preventDefault();

    // ignore if empty input
    if (this.state.msg === "") return;

    if (this.state.msg.startsWith("/j")) {
      var name = this.state.msg.split(" ")[1];
      this.state.client.joinRoom(name);
      this.setState({ chatroom: name });
    } else {
      this.state.client.message(this.state.msg, this.state.chatroom);
    }
    this.setState({ msg: "" });
  };

  // join chatroom
  joinChatroom = chatroomName => {
    this.state.client.joinRoom(chatroomName);
  };

  // connect socket and set username
  setUsername(username) {
    // connect socket
    var client = socket();
    client.registerHandler(
      this.onMessageReceived,
      this.onMembersReceived,
      this.messageHandler
    );

    // set username
    client.setUsername(username);
    this.setState({ client, username, chatroom: "default" });

    // get media
    this.getMedia();
  }

  handleChange = e => {
    this.setState({ msg: e.target.value });
  };

  // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  getMedia = () => {
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(this.gotStream)
      .catch(function(e) {
        alert("getUserMedia() error: " + e);
      });
  };

  gotStream = stream => {
    console.log("Adding local stream.");
    this.setState({ localStream: stream });
    this.state.client.sendMessage({ type: "joined" });
  };

  maybeStart = clientId => {
    console.log(">>>>>>> maybeStart() ", this.state.localStream);
    if (this.state.localStream && !this.state.connectionList[clientId]) {
      console.log(">>>>>> creating peer connection");
      this.createPeerConnection(clientId);
      this.state.connectionList[clientId].addStream(this.state.localStream);
      //this.doCall(clientId);
    }
  };

  createPeerConnection = clientId => {
    let that = this;
    try {
      var pc = new RTCPeerConnection(null);
      pc.onicecandidate = this.handleIceCandidate;
      pc.onaddstream = this.handleRemoteStreamAdded(clientId, that);
      pc.onremovestream = this.handleRemoteStreamRemoved(clientId);

      this.setState({
        connectionList: { ...this.state.connectionList, [clientId]: pc }
      });
      console.log("Created RTCPeerConnnection");
    } catch (e) {

      console.log("Failed to create PeerConnection, exception: " + e.message);
      alert("Cannot create RTCPeerConnection object.");
      return;
    }
  };

  handleIceCandidate = event => {
    console.log("icecandidate event: ", event);
    if (event.candidate) {
      this.state.client.sendMessage({
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log("End of candidates.");
    }
  };

  handleRemoteStreamAdded = (clientId, scope) => event => {
    console.log("Remote stream added.");
    debugger
    scope.setState({
      remoteStreams: {
        ...scope.state.remoteStreams,
        [clientId]: event.stream
      }
    });
    debugger
    // this.video.srcObject = event.stream;
  };

  handleRemoteStreamRemoved = (clientId, scope) => event => {
    console.log("Remote stream removed. Event: ", event);
    var remoteStreams = this.state.remoteStreams;
    delete remoteStreams[clientId];
    this.setState({ remoteStreams });
  };

  handleCreateOfferError(event) {
    console.log("createOffer() error: ", event);
  }

  doCall = clientId => {
    console.log("Sending offer to peer");

    this.state.connectionList[clientId].createOffer(
      this.setLocalAndSendMessage(clientId),
      this.handleCreateOfferError
    );
  };

  setLocalAndSendMessage = clientId => sessionDescription => {
    console.log("set local description for: ", clientId);
    this.state.connectionList[clientId].setLocalDescription(sessionDescription);
    console.log("setLocalAndSendMessage sending message", sessionDescription);
    this.state.client.sendMessage(sessionDescription);
  };

  onCreateSessionDescriptionError(error) {
    console.log("Failed to create session description: " + error.toString());
    // trace("Failed to create session description: " + error.toString());
  }

  doAnswer = clientId => {
    console.log("Sending answer to peer.");
    this.state.connectionList[clientId]
      .createAnswer()
      .then(
        this.setLocalAndSendMessage(clientId),
        this.onCreateSessionDescriptionError
      );
  };

  handleRemoteHangup = clientId => {
    console.log("Session terminated.");
    this.stop(clientId);
  };

  stop = clientId => {
    var pc = this.state.connectionList[clientId];
    if (pc) {
      pc.close();
      var connectionList = this.state.connectionList;
      delete connectionList[clientId];
      this.setState({ connectionList });
    }
  };

  // This client receives a message
  messageHandler = message => {
    console.log("Client received message:", message);
    if (message.type === "joined") {
      // if (!this.state.connectionList[message.clientId]) {
      // }
      this.maybeStart(message.clientId);
      this.doCall(message.clientId);
    } else if (message.type === "offer") {
      // if (!this.state.connectionList[message.clientId]) {
        this.maybeStart(message.clientId);

        this.state.connectionList[message.clientId].setRemoteDescription(
          new RTCSessionDescription(message)
        );
        this.doAnswer(message.clientId);
      // }
    } else if (message.type === "answer") {
      if (
        this.state.connectionList[message.clientId] &&
        !this.state.connectionList[message.clientId].remoteDescription
      ) {
        this.state.connectionList[message.clientId].setRemoteDescription(
          new RTCSessionDescription(message)
        );
      }
    } else if (message.type === "candidate") {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      });
      if (this.state.connectionList[message.clientId]) {
        this.state.connectionList[message.clientId].addIceCandidate(candidate);
      }
    } else if (message === "bye") {
      this.handleRemoteHangup(message.clientId);
    }
  };

  render() {
    return (
      <div id="container-main">
        <div id="videos">
          {/* <video
            autoPlay
            playsInline
            ref={ref => {
              this.video = ref;
            }}
          /> */}
          {Object.keys(this.state.remoteStreams).map(clientId => (
            <video
              key={clientId}
              autoPlay
              playsInline
              ref={ref => {
                ref.srcObject = this.state.remoteStreams[clientId];
              }}
            />
          ))}
        </div>
        <div id="container-left">
          <h3 id="room-name">{this.state.chatroom}</h3>
          <ul id="members-list">
            {this.state.members.map((member, key) => (
              <li key={key} className="member">
                {member}
              </li>
            ))}
          </ul>
        </div>

        <div id="container-right">
          <div id="container-messages">
            <ul id="message-list">
              {/* {this.state.messages.map((msg, key) => {
                const yourUsername =
                  this.state.username === msg.username
                    ? "your-username"
                    : "other-username";

                return (
                  <div key={key} className="message-container">
                    <div className={yourUsername}>{msg.username}</div>
                    <div className="message">{msg.message}</div>
                  </div>
                );
              })} */}
              {this.state.messages.map((msg, key) => (
                <li key={key} className="message">
                  {msg.username}: {msg.msg}
                </li>
              ))}
            </ul>
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </div>
          <div id="container-input">
            <div id="language-selector">
              <Dropdown
                id="language-selector"
                title="EN"
                list={this.state.language}
                resetThenSet={this.resetThenSet}
              />
            </div>
            <form id="form-message" onSubmit={this.handleSubmit}>
              <input
                id="input-message"
                onChange={this.handleChange}
                value={this.state.msg}
              />
              <button id="submit-message">send</button>
            </form>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          contentLabel="Username Modal"
        >
          <UsernameForm
            setUsername={this.setUsername.bind(this)}
            closeModal={this.closeUsernameModal.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

Modal.setAppElement("body");

export default Chatroom;
