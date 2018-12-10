import io from "socket.io-client";

export default function() {
  const socket = io();

  function registerHandler(onMessageReceived) {
    socket.on("chat-message", onMessageReceived);
  }

  function setUsername(username) {
<<<<<<< HEAD
    socket.emit("register", username, function(){});
=======
    socket.emit("register", username);
>>>>>>> a8bd4ac0a7e4ce31b7c71bc193c348c93e03cfec
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
