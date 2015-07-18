import Bacon from 'baconjs';
import {render, renderFuture} from './render';
import {toObject} from './utils';
import identity from 'lodash.identity';

import 'bacon.animationframe';
import './bufferUntilValue';

import * as player from './player';
import * as bullets from './bullets';

import {record, isRunning$, selectedState$, futureInput$} from './recorder';

import {
  FRAME_RATE,
  SPACE_KEY,
  UP_KEY,
  DOWN_KEY,
  LEFT_KEY,
  LEFT_ARROW_KEY,
  RIGHT_KEY,
  RIGHT_ARROW_KEY
} from './constants';

// User events
const keyDown$ = Bacon.fromEvent(window, 'keydown').map('.keyCode')
const keyUp$ = Bacon.fromEvent(window, 'keyup').map('.keyCode')
const mouseMove$ = Bacon.fromEvent(window, 'mousemove');

const is = val => val2 => val === val2;

const tick$ = Bacon
  .scheduleAnimationFrame()
  .bufferWithTime(FRAME_RATE);

function toKeyStream(keyCode) {
  return keyDown$
    .filter(is(keyCode))
    .map(true)
    .merge(keyUp$.filter(is(keyCode)).map(false))
    .toProperty(false)
    .sampledBy(tick$);
}

const input$ = Bacon.zipWith(
  (up, down, left, right, leftArrow, rightArrow, shoot) => ({shoot, keys: {up, down, left, right, leftArrow, rightArrow}}),
  toKeyStream(UP_KEY),
  toKeyStream(DOWN_KEY),
  toKeyStream(LEFT_KEY),
  toKeyStream(RIGHT_KEY),
  toKeyStream(LEFT_ARROW_KEY),
  toKeyStream(RIGHT_ARROW_KEY),
  keyDown$.filter(is(SPACE_KEY)).bufferUntilValue(tick$)
)

function createGameLoop(input$, initials) {
  const updatedPlayer$ = input$.scan(initials.player, player.update)

  const updatedBullets$ = Bacon.zipAsArray(updatedPlayer$, input$)
  .scan(initials.bullets, bullets.update);

  const game$ = Bacon.zipWith(
    toObject('player', 'bullets'),
    updatedPlayer$,
    updatedBullets$);

  return game$;
}

const game$ = createGameLoop(input$.filter(isRunning$), {
  player: player.initial,
  bullets: []
});

const futures$ = Bacon.zipWith((initialState, futureInput) => {
  return createGameLoop(Bacon.fromArray(futureInput), initialState);
}, selectedState$, futureInput$).flatMap(identity);


game$.merge(selectedState$).onValue(render);

Bacon
  .combineAsArray(futures$, selectedState$)
  .onValues(renderFuture)

Bacon.zipWith(toObject('state', 'input'), game$, input$).onValue(record);


