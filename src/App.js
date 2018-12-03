import React, { Component } from "react";
import "./stylesheet/App.css";
import './stylesheet/index.scss';

import Chatroom from "./Component/Chatroom.js";

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
