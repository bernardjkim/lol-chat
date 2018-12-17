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

    client.on("message", function(message) {
      console.log("Client said: ", message);
      // for a real app, would be room-only (not broadcast)
      message.clientId = client.id;
      client.broadcast.emit("message", message);
    });

    // NOTE: not sure what this is used for ???
    // client.on("ipaddr", function() {
    //   console.log("ipaddr");
    //   var ifaces = os.networkInterfaces();
    //   for (var dev in ifaces) {
    //     ifaces[dev].forEach(function(details) {
    //       if (details.family === "IPv4" && details.address !== "127.0.0.1") {
    //         socket.emit("ipaddr", details.address);
    //       }
    //     });
    //   }
    // });

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
