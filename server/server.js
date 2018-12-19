const socketIO = require("socket.io");
// const os = require("os");

const makeHandlers = require("./handlers");
const ClientManager = require("./clientManager");
const ChatroomManager = require("./chatroomManager");

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

module.exports = function(server) {
  const io = socketIO.listen(server);

  io.on("connection", client => {
    const {
      handleRegister,
      handleJoin,
      handleLanguage,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleGetAvailableUsers,
      handleDisconnect
    } = makeHandlers(client, clientManager, chatroomManager);
    console.log("client connected: ", client.id);

    handleRegister("default");

    client.on("register", handleRegister);

    client.on("join", handleJoin);

    client.on("language", handleLanguage);

    client.on("leave", handleLeave);

    client.on("chat-message", handleMessage);

    client.on("chatrooms", handleGetChatrooms);

    client.on("availableUsers", handleGetAvailableUsers);

    // TODO: broadcast to room-only
    // for a real app, would be room-only (not broadcast)
    client.on("message", function(message) {
      message.clientId = client.id;
      console.log("Client: ", client.id, " said: ", message);
      client.broadcast.emit("message", message);
    });

    client.on("disconnect", function() {
      console.log("client disconnect...", client.id);
      handleDisconnect();
    });

    client.on("error", function(err) {
      console.log("received error from client:", client.id);
      console.log(err);
    });
  });
};
