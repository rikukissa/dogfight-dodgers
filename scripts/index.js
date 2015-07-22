import Bacon from 'baconjs';
import {render, renderFuture} from './render';
import {playSounds} from './sounds';
import {toObject} from './utils';
import identity from 'lodash.identity';

import 'bacon.animationframe';
import './bufferUntilValue';

import * as player from './player';
import * as bullets from './bullets';
import * as world from './world';
import * as explosions from './explosions';

import {record, isRunning$, selectedState$, futureInput$} from './recorder';

import {
  FRAME_RATE,
  WORLD_SPEED,
  SPACE_KEY,
  UP_KEY,
  DOWN_KEY,
  LEFT_KEY,
  RIGHT_KEY
} from 'constants';

// User events
const keyDown$ = Bacon.fromEvent(window, 'keydown').map('.keyCode');
const keyUp$ = Bacon.fromEvent(window, 'keyup').map('.keyCode');

const is = val => val2 => val === val2;

const tick$ = Bacon
  .scheduleAnimationFrame()
  .bufferWithTime(FRAME_RATE);

const delta$ = tick$.scan({
  time: null,
  delta: 1
}, (memo) => {
  if(memo.time === null) {
    return {
      time: Date.now(),
      delta: 1
    };
  }
  const time = Date.now();

  return {
    time: time,
    delta: (time - memo.time) / WORLD_SPEED
  };
});

function toKeyStream(keyCode) {
  return keyDown$
    .filter(is(keyCode))
    .map(true)
    .merge(keyUp$.filter(is(keyCode)).map(false))
    .toProperty(false)
    .sampledBy(tick$);
}

const input$ = Bacon.zipWith(
  ({delta, time}, up, down, left, right, shoot) => // eslint-disable-line max-params
    ({delta, time, shoot, keys: {up, down, left, right}}),
  delta$,
  toKeyStream(UP_KEY),
  toKeyStream(DOWN_KEY),
  toKeyStream(LEFT_KEY),
  toKeyStream(RIGHT_KEY),
  keyDown$.filter(is(SPACE_KEY)).bufferUntilValue(tick$)
);

function createGameLoop(inputs$, initials) {
  const updatedPlayer$ = inputs$.scan(initials.player, player.update).skip(1);

  const updatedBullets$ = Bacon.zipAsArray(updatedPlayer$, inputs$)
  .scan(initials.bullets, bullets.update).skip(1);

  const updatedWorld$ = inputs$.scan(initials.world, world.update).skip(1);

  const updatedExplosions$ = Bacon.zipAsArray(
    updatedPlayer$,
    updatedBullets$,
    inputs$
  ).scan(initials.explosions, explosions.update).skip(1);

  const game$ = Bacon.zipWith(
    toObject('player', 'bullets', 'world', 'explosions', 'input'),
    updatedPlayer$,
    updatedBullets$,
    updatedWorld$,
    updatedExplosions$,
    inputs$);

  return game$;
}

const game$ = createGameLoop(input$.filter(isRunning$), {
  player: player.initial,
  bullets: bullets.initial,
  explosions: explosions.initial,
  world: world.initial
});

const futures$ = Bacon.zipWith((initialState, futureInput) => {
  return createGameLoop(Bacon.fromArray(futureInput), initialState);
}, selectedState$, futureInput$).flatMap(identity);

const gameState$ = game$.merge(selectedState$);

gameState$.onValue(render);
gameState$.onValue(playSounds);

Bacon
  .combineAsArray(futures$, selectedState$)
  .onValues(renderFuture);

Bacon.zipWith(toObject('state', 'input'), game$, input$).onValue(record);


