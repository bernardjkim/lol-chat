const socketIO = require("socket.io");
// const serverManager = require("./serverManager");

module.exports = function(server) {
  const io = socketIO.listen(server);

  io.on("connection", client => {
    console.log("client connected: ", client.id);

    client.on("message", msg => {
      console.log("recieved msg: ", msg);
      io.emit("message", msg);
    });
  });
};
