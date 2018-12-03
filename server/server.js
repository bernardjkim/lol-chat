var app = require('http').createServer();
// Export Io 
var io = module.exports.io = require('socket.io')(app)
var port = process.env.PORT || 3001;

const serverManager = require('./serverManager')

io.on('connection', serverManager);

app.listen(port, function() {
  console.log("listening on *:" + port);
});


