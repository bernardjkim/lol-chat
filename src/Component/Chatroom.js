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

  componentDidMount() {}

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
  }

  handleChange = e => {
    this.setState({ msg: e.target.value });
  };

  render() {
    console.log(this.state);
    return (
      <div id="chat-box">
        <p>{this.state.chatroom}</p>

        <Dropdown
          title="Select Language"
          list={this.state.language}
          resetThenSet={this.resetThenSet}
        />

        <ul>
          {this.state.members.map((m, key) => (
            <li key={key}>{m}</li>
          ))}
        </ul>
        <div id="messages">
          {this.state.messages.map((msg, key) => {
            const username = msg.username;
            const message = msg.msg;
            const yourUsername =
              this.state.username === username
                ? "your-username"
                : "other-username";

            return (
              <div key={key} className="message-container">
                <div className={yourUsername}>{username}</div>
                <div className="message">{message}</div>
              </div>
            );
          })}
        </div>

        <form className="form-container" onSubmit={this.handleSubmit}>
          <input
            id="message-bar"
            onChange={this.handleChange}
            value={this.state.msg}
          />
          <button id="send-button">Send</button>
        </form>
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
