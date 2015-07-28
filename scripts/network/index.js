const P2P = require('socket.io-p2p');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3030');

const p2p = new P2P(socket, {});

export { p2p as default };
