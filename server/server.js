var http = require("http").Server();
var io = require("socket.io")(http);
var port = process.env.PORT || 3001;

io.on("connection", function(client) {
  console.log("client connected: ", client.id);

  // send a welcome message to the new client
  const welcome = "Welcome to lol-chat " + client.id;
  client.emit("message", welcome);

  // broadcast any messages back to all connected clients
  client.on("message", function(msg) {
    io.emit("message", msg);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
