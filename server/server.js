const socketIO = require("socket.io");

const makeHandlers = require("./handlers");
const ClientManager = require("./clientManager");
const ChatroomManager = require("./chatroomManager");

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

module.exports = function(server) {
  const io = socketIO.listen(server);

  io.on("connection", socket => {
    const {
      handleRegister,
      handleJoin,
      handleLanguage,
      handleLeave,
      handleMessage,
      handleDisconnect
    } = makeHandlers(socket, clientManager, chatroomManager);

    // init: register client with username 'default' and join chatroom 'default'
    console.log("socket connected: ", socket.id);
    handleRegister();
    handleJoin();

    socket.on("register", handleRegister);

    socket.on("join", handleJoin);

    socket.on("language", handleLanguage);

    socket.on("leave", handleLeave);

    socket.on("chat-message", message => {
      console.log("socket: ", socket.id, " said: ", message);
      handleMessage(message);
    });

    // TODO: broadcast to room-only
    // for a real app, would be room-only (not broadcast)
    socket.on("message", function(message) {
      message.socket = socket.id;
      console.log("socket: ", socket.id, " said: ", message);
      socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", function() {
      console.log("socket disconnect...", socket.id);
      handleDisconnect();
    });

    socket.on("error", function(err) {
      console.log("received error from socket:", socket.id);
      console.log(err);
    });
  });
};
