import throttle from 'lodash.throttle';
import io from 'socket.io-client';
import {getId} from 'utils';

const socket = io.connect('http://localhost:3030');

const id = getId();

const ROOM_ID = 'fooba';

function getInitialState() {
  return {
    planes: {},
    players: {}
  };
}

let state = getInitialState();

socket.emit('join', {room: ROOM_ID, id});

socket.on('join', (playerId) => {
  // Pelaajalistan synccaus
});


socket.on('update', (data) => {
  state.planes[data.id] = data;
});

export const update = throttle(function update(data) {
  data.id = id;
  socket.emit('update', data);
}, 10);

export function getState() {
  return state;
}
