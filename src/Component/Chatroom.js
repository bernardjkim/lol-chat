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

      // TOOD: move to separate file?
      //https://cloud.google.com/translate/docs/languages
      language: [
        {
          id: 0,
          title: "en",
          selected: true
        },
        {
          id: 1,
          title: "ko",
          selected: false
        },
        {
          id: 2,
          title: "ja",
          selected: false
        },
        {
          id: 3,
          title: "zu",
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
    client.registerHandler(this.onMessageReceived, this.onMembersReceived);

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

  getMedia() {
    // var localStream;
    // var localVideo = document.querySelector("video");
    // var remoteVideo = document.querySelector("#remoteVideo");

    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(this.gotStream)
      .catch(function(e) {
        alert("getUserMedia() error: " + e);
      });
  }

  gotStream = stream => {
    console.log("Adding local stream.");
    this.setState({ localStream: stream });
    // this.video.srcObject = stream;
    // localVideo.srcObject = stream;
    // sendMessage("got user media");
  };

  render() {
    return (
      <div id="container-main">
        <div id="videos">
          {this.state.localStream && (
            <video
              autoPlay
              playsInline
              ref={video => {
                video.srcObject = this.state.localStream;
              }}
            />
          )}
          {/* <video id="localVideo" autoPlay muted playsInline />
          <video id="remoteVideo" autoPlay playsInline /> */}
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
                title="en"
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
