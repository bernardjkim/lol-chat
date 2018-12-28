import React from "react";
import Modal from "react-modal";

import socket from "../socket";
import UsernameForm from "./UsernameForm";
import Dropdown from "./Dropdown";
import AudioStream from "./AudioStream";
import getMedia from "./Media";

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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages !== this.state.messages) {
      /**
       * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
       * scroll to this.messagesEnd element ref
       */
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    if (prevState.chatroom !== this.state.chatroom) {
      // send join room msg to server
      this.state.client.joinRoom(this.state.chatroom);
    }

    if (prevState.username !== this.state.username) {
      this.connectToServer();
    }

    if (prevState.localStream !== this.state.localStream) {
      this.state.client.sendMessage({ type: "joined" });
    }
  }

  // send smg to server
  handleSubmit = e => {
    e.preventDefault();

    // ignore if empty input
    if (this.state.msg === "") {
      return;
    }

    // handle join room
    if (this.state.msg.startsWith("/j")) {
      const chatroom = this.state.msg.split(" ")[1];
      this.setState({ chatroom });
    }

    // handle send message
    else {
      this.state.client.message(this.state.msg, this.state.chatroom);
    }

    // clear msg
    this.setState({ msg: "" });
  };

  registerHandlers = client => {
    client.registerHandler("chat-message", message => {
      const { username, msg } = message;
      this.setState({
        messages: [...this.state.messages, { username, msg }]
      });
    });

    client.registerHandler("members", members => {
      this.setState({ members });
    });
  };

  // try to connect to server
  connectToServer = () => {
    // connect socket
    var client = socket();
    this.registerHandlers(client);
    client.setUsername(this.state.username);

    this.setState({ client });

    // attempt to get media access
    getMedia(localStream => {
      this.setState({ localStream });
    });
  };

  render() {
    return (
      <div id="container-main">
        <AudioStream
          client={this.state.client}
          localStream={this.state.localStream}
        />
        <div id="container-left">
          <div id="room-name">
            <p>{this.state.chatroom}</p>
          </div>
          <div id="members-list">
            <ul>
              {this.state.members.map((member, key) => (
                <li key={key} className="member">
                  {member}
                </li>
              ))}
            </ul>
          </div>
          <div id="container-settings">
            <p>Settings</p>
          </div>
        </div>

        <div id="container-right">
          <div id="title">
            <p>LOL</p>
          </div>
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
            <div id="container-inner">
              <Dropdown
                id="language-selector"
                title={this.state.language}
                setLanguage={id => {
                  this.setState({ language: id });
                }}
              />
              <form id="form-message" onSubmit={this.handleSubmit}>
                <input
                  id="input-message"
                  onChange={evt => {
                    this.setState({ msg: evt.target.value });
                  }}
                  value={this.state.msg}
                  autoComplete="off"
                  autoFocus
                />
              </form>
            </div>
          </div>
        </div>
        {!this.state.username && (
          <Modal
            overlayClassName="modal-overlay"
            className="modal-username"
            isOpen={this.state.modalOpen}
            // style={Variables.modalStyle}
            contentLabel="Username Modal"
          >
            <UsernameForm
              closeModal={username => {
                this.setState({ username, modalOpen: false });
              }}
            />
          </Modal>
        )}
      </div>
    );
  }
}

Modal.setAppElement("body");

export default Chatroom;
