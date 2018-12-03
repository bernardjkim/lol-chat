var app = require('http').createServer();
// Export Io 
var io = module.exports.io = require('socket.io')(app)
var port = process.env.PORT || 3001;

const serverManager = require('./serverManager')

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

app.listen(port, function() {
  console.log("listening on *:" + port);
});


