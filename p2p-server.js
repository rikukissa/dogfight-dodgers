var server = require('http').createServer();
var io = require('socket.io')(server);
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);

io.on('connection', function(socket) {
  socket.on('update', function(data) {
    socket.broadcast.emit('update', data);
  });
});
server.listen(3030);
