import {render} from 'render';
import {playSounds} from 'sounds';
import update, { initialState } from 'gameLoop';
import tick$ from 'ticker';

import input$, { flush } from 'input';

import {update as updatePhysics, state$ as physicsState$} from 'physics';

/*
 * Game state & game loop
 */

const state$ = tick$
  .zip(physicsState$, (time, phys) => ({time, physics: phys}))
  .withLatestFrom(input$, (subscriptions, input) => ({...subscriptions, input}))
  .scan(update, initialState)
  .share();

state$.subscribe(render);
state$.subscribe(playSounds);
state$.subscribe(updatePhysics);
state$.subscribe(flush);

