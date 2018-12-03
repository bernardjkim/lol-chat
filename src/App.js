import React, { Component } from "react";
import "./App.css";

import Chatroom from "./Chatroom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Chatroom />
        </header>
      </div>
    );
  }
}

export default App;
