
require('tests');


import {Observable} from 'rxjs';
import {PLAYER_JOINED} from 'network/actions';

import {emitUpdates, actions$ as network$} from 'network';
import {render} from 'render';
import {playSounds} from 'sounds';
import update, { initialState } from 'gameLoop';
import tick$ from 'ticker';

import {keys$} from 'input';

import {update as updatePhysics, state$ as physicsState$} from 'physics';

/*
 * Game state & game loop
 */

const actions$ = keys$.merge(network$)
  .buffer(tick$)
  .startWith([]);

const allInputs$ =
  tick$.zip(physicsState$, (time, bodies) => ({time, bodies}))
  .withLatestFrom(actions$, (inputs, actions) => ({...inputs, actions}))

const state$ =
  allInputs$
  .scan(update, initialState)
  .share();

state$.subscribe(render);
state$.subscribe(playSounds);
state$.subscribe(updatePhysics);
state$.subscribe(emitUpdates);


