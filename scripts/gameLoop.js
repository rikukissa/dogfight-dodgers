import {update as updateWorld} from 'world';
import {
  update as updatePlayer,
  initial as initialPlayer
} from 'player';

import {
  update as updateBullets,
  initial as initialBullets
} from 'bullets';

import {
  update as updateEnemies,
} from 'enemies';

export const initialState = {
  player: initialPlayer(),
  enemies: [],
  bullets: [],
  collisions: [],
  elapsedTime: 0,
  tick: 0,
  currentTime: Date.now(),
  keys: {
    up: false,
    down: false
  },
  // debug stuff
  bodies: []
};

function hasActionOccured(actions, type) {
  return (payload) => {
    return actions.filter((action) =>
      action.type === type && action.payload === payload
    ).length > 0;
  }
}


/*
 * Up & down keys have to be toggled on / off instead of only reading them from actions
 *  - This is because holding one key (e.g. down) and pressing some other key (e.g. space) will
 *    release the previously pressed one
 */

function updateKeys(keys, actions) {

  const keyDown = hasActionOccured(actions, 'KEYDOWN');
  const keyUp = hasActionOccured(actions, 'KEYUP');

  const throttleOn = keyDown('down');
  const throttleOff = keyUp('down');

  const breaksOn = keyDown('up');
  const breaksOff = keyUp('up');

  let down = keys.down;

  if(throttleOn && !keys.down) {
    down = true;
  }

  if(keys.down && throttleOff) {
    down = false;
  }

  let up = keys.up;

  if(breaksOn && !keys.up) {
    up = true;
  }

  if(keys.up && breaksOff) {
    up = false;
  }

  return {
    up,
    down
  };
}

export default (state, { time: { delta, currentTime }, bodies, actions }) => {

  const player = updatePlayer({
    ...state,
    player: {...state.player, body: bodies.player }
  }, delta);

  const bullets = updateBullets(state, player, actions, delta);
  const enemies = updateEnemies(state, actions, delta);
  const keys = updateKeys(state.keys, actions);

  return {
    player,
    enemies,
    keys,
    bullets,
    tick: state.tick + 1,
    collisions: state.collisions,
    lastDelta: delta,
    elapsedTime: state.elapsedTime + delta,
    currentTime,
    // debug
    bodies
  };
}