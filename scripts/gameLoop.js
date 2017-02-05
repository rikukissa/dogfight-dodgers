import {update as updateWorld} from 'world';
import {
  update as updatePlayer,
  initial as initialPlayer
} from 'player';

import {
  update as updateBullets,
  initial as initialBullets
} from 'bullets';

export const initialState = {
  player: initialPlayer(),
  bullets: [],
  collisions: [],
  elapsedTime: 0
};

export default (state, { time: { delta }, physics, input}) => {
  const player = updatePlayer({...state.player, body: physics.player }, input, delta);
  const bullets = updateBullets(state, player, input, delta);

  return {
    player,
    bullets,
    collisions: state.collisions,
    lastDelta: delta,
    elapsedTime: state.elapsedTime + delta
  };
}