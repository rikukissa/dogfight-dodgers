require('babel-register');

const server = require('http').createServer();
const io = require('socket.io')(server);

const {
  BULLET_CREATED,
  PLAYER_UPDATE,
  PLAYER_JOINED,
  PLAYER_LEFT
} = require('./scripts/network/actions');

const rooms = {};

function createRoom() {
  return {
    planes: []
  };
}

io.on('connection', function(socket) {

  socket.on(PLAYER_UPDATE, function({room, player, currentTime}) {
    rooms[room].planes = rooms[room].planes.map((plane) => {
      if(plane.id === player.id) {
        return player;
      }
      return plane;
    });
    socket.broadcast.to(room).emit(PLAYER_UPDATE, {player, currentTime});
  });

  socket.on(PLAYER_JOINED, function({room, player}) {
    socket.playerId = player.id;

    socket.join(room);

    if(!rooms[room]) {
      rooms[room] = createRoom();
    }

    rooms[room].planes.forEach((plane) => {
      socket.emit(PLAYER_JOINED, plane);
    });

    rooms[room].planes.push(player);
    socket.broadcast.to(room).emit(PLAYER_JOINED, player);

  });

  socket.on(BULLET_CREATED, function({room, bullet, currentTime}) {
    socket.broadcast.to(room).emit(BULLET_CREATED, {bullet, currentTime});
  });

  socket.on('disconnect', () => {
    if(!socket.playerId) {
      return;
    }

    for(const room in socket.rooms) {
      rooms[room].planes = rooms[room].planes.filter((plane) => plane.id !== socket.playerId);
      socket.broadcast.to(room).emit(PLAYER_LEFT, {id: socket.playerId});
    }
  });
});
server.listen(3030);
