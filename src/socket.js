import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived) {
    socket.on("chat-message", onMessageReceived);
  }

  function setUsername(username) {
    socket.emit("set-username", username);
  }

  function unregisterHandler() {
    socket.off("chat-message");
  }

  function message(msg) {
    socket.emit("chat-message", { chatroomName: "default", msg });
  }
  return {
    registerHandler,
    unregisterHandler,
    message,
    setUsername
  };
}
