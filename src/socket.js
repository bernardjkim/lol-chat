import io from "socket.io-client";

export default function() {
  const socket = io();

  // TODO: probably want to allow handlers to be registered for any message type we give it
  function registerHandler(
    onChatMessageReceived,
    onMembersReceived,
    onMessageReceived
  ) {
    socket.on("chat-message", onChatMessageReceived);
    socket.on("members", onMembersReceived);
    socket.on("message", onMessageReceived);
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
    socket.off("message");
  }

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
    unregisterHandler,
    message,
    setUsername,
    setLanguage,
    joinRoom,
    sendMessage
  };
}
