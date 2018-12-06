const socketIO = require("socket.io");
const makeHandlers = require("./handlers");
const ClientManager = require("./clientManager");
const ChatroomManager = require("./chatroomManager");

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

module.exports = function(server) {
  const io = socketIO.listen(server);
  const date = new Date();

  io.on("connection", client => {
    const {
      handleRegister,
      handleJoin,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleGetAvailableUsers,
      handleDisconnect
    } = makeHandlers(client, clientManager, chatroomManager);

    console.log("client connected: ", client.id);
    clientManager.registerClient(client, "UnknownAnonymous");
    chatroomManager.getChatroomByName("default").addUser(client);

    client.on("register", handleRegister);

    client.on("join", handleJoin);

    client.on("leave", handleLeave);

    client.on("chat-message", handleMessage);

    client.on("chatrooms", handleGetChatrooms);

    client.on("availableUsers", handleGetAvailableUsers);

    // client.on("chat-message", msg => {
    //   io.emit("chat-message", {
    //     timestamp: new Date().getTime(),
    //     username: client.nickname,
    //     msg: msg
    //   });
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
