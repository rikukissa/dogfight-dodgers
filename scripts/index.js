import {render} from 'render';
import {playSounds} from 'sounds';
import gameLoop$ from 'gameLoop';

import * as input from 'input';
import { update as updatePhysics, state$ as physicsState$ } from 'physics';
import {initial as initialWorld, update as updateWorld} from './world';
import {initial as initialPlayer, update as updatePlayer} from './player';

/*
 * Game state & game loop
 */

const initialState = {
  player: initialPlayer(),
  elapsedTime: 0
};

const state$ = gameLoop$
.zip(physicsState$, (time, phys) => ({time, physics: phys}))
.scan(function(state, { time: { delta }, physics}) {

  const inputState = input.getState();
  input.flush();

  const player = updatePlayer({...state.player, body: physics.player }, inputState, delta);

  return {
    player,
    lastDelta: delta,
    elapsedTime: state.elapsedTime + delta
  };

}, initialState).share();

state$.subscribe(render);
state$.subscribe(playSounds);
state$.subscribe(updatePhysics);

