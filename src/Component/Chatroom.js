import React from "react";
import socket from "../socket";
import Modal from "react-modal";
import UsernameForm from "./UsernameForm";

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
      messages: [],
      username: "",
      msg: "",
      modalOpen: true
    };
  }

  componentDidMount() {
    console.log(this.state);
    if (!this.state.client) {
      this.connectSocket();
    }
  }

  connectSocket = () => {
    var client = socket();
    client.registerHandler(this.onMessageReceived);
    this.setState({ client: client });
  };

  // append msg to list our list of messages
  onMessageReceived = ({ msg, username }) => {
    this.setState({
      messages: [...this.state.messages, `${username}:  ${msg}`]
    });
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

    this.state.client.message(this.state.msg);
    this.setState({ msg: "" });
  };

  setUsername(username) {
    this.setState({ username });
  }

  handleChange = e => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div id="chat-box">
        <div id="messages">
          {this.state.messages.map((msg, key) => {
            const index = msg.indexOf(":");
            const username = msg.slice(0, index);
            const message = msg.slice(index + 1);
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
            socket={this.state.client}
          />
        </Modal>
      </div>
    );
  }
}

Modal.setAppElement("body");

export default Chatroom;
