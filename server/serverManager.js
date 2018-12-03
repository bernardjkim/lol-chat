const io = require('./server.js').io


module.exports = function(socket) {
    
 // send a welcome message to the new client
    welcome(socket);

 // broadcast any messages back to all connected clients
    socket.on('message',sendMessage)
};

function welcome(socket) {
    console.log("client connected: ", socket.id);
    const welcome = "Welcome to lol-chat " + socket.id;
    socket.emit("message", welcome);
}

function sendMessage(msg) {
    io.emit('message', msg);
}