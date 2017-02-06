import {Observable} from 'rxjs';
import throttle from 'lodash.throttle';
import io from 'socket.io-client';
import {BULLET_CREATED, PLAYER_UPDATE, PLAYER_JOINED} from 'network/actions';

const ROOM_ID = 'fooba';

const socket = io.connect('http://192.168.11.12:3030');

const emitPlayerPosition = throttle((state) => {
  socket.emit(PLAYER_UPDATE, {room: ROOM_ID, currentTime: state.currentTime, player: state.player});
}, 10);

function emitBulletCreation(state, bullet) {
  socket.emit(BULLET_CREATED, {room: ROOM_ID, currentTime: state.currentTime, bullet});
}

export function emitUpdates(state) {
  if(state.tick === 1) {
    socket.emit(PLAYER_JOINED, {room: ROOM_ID, player: state.player});
  }

  state.bullets
    .filter(({ticksLived}) => ticksLived === 0)
    .forEach((bullet) => emitBulletCreation(state, bullet));

  emitPlayerPosition(state);
};

const playerJoins$ = Observable.fromEvent(socket, PLAYER_JOINED)
  .map((payload) => ({type: PLAYER_JOINED, payload}));

const playerUpdate$ = Observable.fromEvent(socket, PLAYER_UPDATE)
  .map((payload) => ({type: PLAYER_UPDATE, payload}));

const bulletCreated$ = Observable.fromEvent(socket, BULLET_CREATED)
  .map((payload) => ({type: BULLET_CREATED, payload}));

export const actions$ = playerJoins$.merge(playerUpdate$).merge(bulletCreated$);
