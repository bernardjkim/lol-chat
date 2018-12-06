const socketIO = require("socket.io");
// const serverManager = require("./serverManager");

module.exports = function(server) {
  const io = socketIO.listen(server);

  io.on("connection", client => {
    console.log("client connected: ", client.id);

    client.on("set-username", username => {
      client.nickname = username;
    });

    client.on("chat-message", msg => {
      io.emit("message", { username: client.username, msg: msg });
    });
  });
};
