import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived) {
    socket.on("chat-message", onMessageReceived);
  }

  function setUsername(username) {
    socket.emit("register", username);
  }

  function unregisterHandler() {
    socket.off("chat-message");
  }

  function message(msg, chatroomName) {
    socket.emit("chat-message", { chatroomName, msg });
  }

  function joinRoom(chatroomName) {
    socket.emit("join", chatroomName);
  }
  return {
    registerHandler,
    unregisterHandler,
    message,
    setUsername,
    joinRoom
  };
}
