import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

export function test() {
  const socket = io("http://localhost:3001");

  function registerHandler(onMessageReceived) {
    socket.on("chat message", onMessageReceived);
  }

  function unregisterHandler() {
    socket.off("chat message");
  }

  function message(msg) {
    socket.emit("chat message", msg);
  }
  return {
    registerHandler,
    unregisterHandler,
    message
  };
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: test(),
      response: false,
      msg: false
    };
  }

  componentDidMount() {
    const socket = io("http://localhost:3001");
    socket.on("chat message", msg => this.setState({ response: msg }));
  }

  handleSubmit = e => {
    e.preventDefault();
    this.state.client.message(this.state.msg);
  };

  handleChange = e => {
    this.setState({ msg: e.target.value });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ul id="messages" />
          <p>{this.state.response ? this.state.response : "no msgs"}</p>

          <form action="" onSubmit={this.handleSubmit}>
            <input id="m" onChange={this.handleChange} />
            <button >Send</button>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
