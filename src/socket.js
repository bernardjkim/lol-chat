import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(type, handler) {
    socket.on(type, handler);
  }

  function videoHandler(onMessageReceived) {
    socket.on("message", onMessageReceived);
  }

  // NOTE: is it important to unregister the handlers?
  // function unregisterHandler() {
  //   socket.off("chat-message");
  //   socket.off("members");
  //   socket.off("message");
  // }

  function setLanguage(language) {
    socket.emit("language", language);
  }

  function setUsername(username) {
    socket.emit("register", username);
  }

  function message(msg, chatroomName) {
    socket.emit("chat-message", { chatroomName, msg });
  }

  function joinRoom(chatroomName) {
    socket.emit("join", chatroomName);
  }

  function sendMessage(message) {
    socket.emit("message", message);
  }

  function sendPrivate(dest, message) {
    socket.emit("private", dest, message);
  }

  window.onbeforeunload = function() {
    sendMessage({ type: "bye" });
  };

  return {
    registerHandler,
    videoHandler,
    // unregisterHandler,
    message,
    setUsername,
    setLanguage,
    joinRoom,
    sendMessage,
    sendPrivate
  };
}
