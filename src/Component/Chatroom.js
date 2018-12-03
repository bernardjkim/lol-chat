import React from "react";
import socket from "../socket";

class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: socket(),
      messages: [],
      msg: ""
    };
  }

  componentDidMount() {
    this.state.client.registerHandler(this.onMessageReceived);
  }

  // append msg to list our list of messages
  onMessageReceived = msg => {
    this.setState({ messages: [...this.state.messages, msg] });
  };

  // send smg to server
  handleSubmit = e => {
    e.preventDefault();

    // ignore if empty input
    if (this.state.msg === "") return;

    this.state.client.message(this.state.msg);
    this.setState({ msg: "" });
  };

  handleChange = e => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div id='chat-box'>
        <ul id="messages" >
        {this.state.messages.map((msg, key) => (
          <li key={key}>{msg}</li>
        ))}
        </ul>

        <form className='form-container' onSubmit={this.handleSubmit}>
          <input id="message-bar" onChange={this.handleChange} value={this.state.msg} />
          <button id='send-button'>Send</button>
        </form>
      </div>
    );
  }
}

export default Chatroom;
