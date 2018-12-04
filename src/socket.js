import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived) {
    socket.on("message", onMessageReceived);
  }

  function unregisterHandler() {
    socket.off("message");
  }

  function message(msg) {
    socket.emit("message", msg);
  }
  return {
    registerHandler,
    unregisterHandler,
    message
  };
}
