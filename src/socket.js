import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived, onMembersReceived) {
    socket.on("chat-message", onMessageReceived);
    socket.on("members", onMembersReceived);
  }

  function setLanguage(language) {
    socket.emit("language", language);
  }

  function setUsername(username) {
    socket.emit("register", username);
  }

  function unregisterHandler() {
    socket.off("chat-message");
    socket.off("members");
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
    setLanguage,
    joinRoom
  };
}
