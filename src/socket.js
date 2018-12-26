import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(type, handler) {
    socket.on(type, handler);
  }

  function videoHandler(onMessageReceived) {
    socket.on("message", onMessageReceived);
  }

  function setLanguage(language) {
    socket.emit("language", language);
  }

  function setUsername(username) {
    socket.emit("register", username);
  }

  // NOTE: is it important to unregister the handlers?
  // function unregisterHandler() {
  //   socket.off("chat-message");
  //   socket.off("members");
  //   socket.off("message");
  // }

  function message(msg, chatroomName) {
    socket.emit("chat-message", { chatroomName, msg });
  }

  function joinRoom(chatroomName) {
    socket.emit("join", chatroomName);
  }

  function sendMessage(message) {
    console.log("Client sending message: ", message);
    socket.emit("message", message);
  }

  window.onbeforeunload = function() {
    sendMessage("bye");
  };

  return {
    registerHandler,
    videoHandler,
    // unregisterHandler,
    message,
    setUsername,
    setLanguage,
    joinRoom,
    sendMessage
  };
}
