const P2P = require('socket.io-p2p');
import throttle from 'lodash.throttle';
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3030');
import {createId} from 'utils';
const p2p = new P2P(socket, {});

const id = createId();

function getInitialState() {
  return {
    planes: {}
  };
}

let state = getInitialState();

p2p.on('update', (data) => {
  state.planes[data.id] = data;
});

export const update = throttle(function update(data) {
  data.id = id;
  p2p.emit('update', data);
}, 10);

export function getState() {
  return state;
}

export function flush() {
  state = getInitialState();
}
