import React from "react";
import Modal from "react-modal";

import socket from "../socket";
import UsernameForm from "./UsernameForm";
import Dropdown from "./Dropdown";
import VideoStream from "./video";
import Variables from "./variable_utils";

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
      language: "en"
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages !== this.state.messages) {
      this.scrollToBottom();
    }
  }

  setLanguage = id => {
    this.setState({ language: id });
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
      // command to join a room
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
    client.chatMessageHandler(this.onMessageReceived);
    client.memberHandler(this.onMembersReceived);

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
      .getUserMedia(Variables.mediaStreamConstraints)
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

  render() {
    return (
      <div id="container-main">
        <VideoStream
          client={this.state.client}
          localStream={this.state.localStream}
        />
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
                title={this.state.language}
                setLanguage={this.setLanguage}
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
          style={Variables.modalStyle}
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
