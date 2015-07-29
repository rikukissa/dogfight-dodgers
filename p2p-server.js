const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('update', function(data) {
    socket.broadcast.emit('update', data);
  });

  socket.on('join', function(request) {
    socket.join(request.room);
    socket.broadcast.to(request.room).emit('join', request.id);
  });
});
server.listen(3030);
