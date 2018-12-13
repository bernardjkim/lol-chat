const socketIO = require("socket.io");
const makeHandlers = require("./handlers");
const ClientManager = require("./clientManager");
const ChatroomManager = require("./chatroomManager");

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

const names = [
  "Donald Trump",
  "Barack Obama",
  "George Bush",
  "Bill Clinton",
  "Richard Nixon",
  "Abraham Lincoln"
];

module.exports = function(server) {
  const io = socketIO.listen(server);

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

    var randomNum = Math.floor(Math.random() * 6);
    handleRegister(names[randomNum]);
    handleJoin("default");

    client.on("register", handleRegister);

    client.on("join", handleJoin);

    client.on("leave", handleLeave);

    client.on("chat-message", handleMessage);

    client.on("chatrooms", handleGetChatrooms);

    client.on("availableUsers", handleGetAvailableUsers);

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
