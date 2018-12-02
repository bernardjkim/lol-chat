import io from "socket.io-client";

export default function() {
  const socket = io("http://localhost:3001");

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
