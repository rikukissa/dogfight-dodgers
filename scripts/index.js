import {World} from 'p2';
import Bacon from 'baconjs';
import {render} from 'render';
import {contactMaterials} from 'materials';
import {playSounds, muted$} from 'sounds';
import {toObject} from 'utils';

import 'bacon.animationframe';
import './bufferUntilValue';

import * as player from './plane';
import * as bullets from './bullet';
import * as crates from './crate';
import * as world from './world';
import * as explosions from './explosion';

import {isRunning$} from './recorder';

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
  .bufferWithTime(FRAME_RATE * 1000);

const delta$ = tick$.scan({
  time: null,
  delta: 1
}, (memo, stamps) => {
  const current = stamps[stamps.length - 1] / 1000;
  memo.current = memo.current || current;
  const difference = current - memo.current;

  return {
    current,
    difference,
    delta: difference / WORLD_SPEED
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
  (time, up, down, left, right, shoot) => // eslint-disable-line max-params
    ({time, shoot, keys: {up, down, left, right}}),
  delta$,
  toKeyStream(UP_KEY),
  toKeyStream(DOWN_KEY),
  toKeyStream(LEFT_KEY),
  toKeyStream(RIGHT_KEY),
  keyDown$.filter(is(SPACE_KEY)).bufferUntilValue(tick$)
);

function createGameLoop(inputs$, engine, initials) {

  const updatedWorld$ = Bacon.zipAsArray(
    inputs$,
    inputs$.map(engine)
  ).map(world.update);

  const updatedPlayer$ = Bacon.zipAsArray(input$, updatedWorld$)
    .scan(initials.player, player.update).skip(1);

  const updatedBullets$ = Bacon.zipAsArray(inputs$, updatedWorld$, updatedPlayer$)
    .scan(initials.bullets, bullets.update).skip(1);

  const updatedCrates$ = Bacon.zipAsArray(inputs$, updatedWorld$)
    .scan(initials.crates, crates.update).skip(1);

  const updatedExplosions$ = Bacon.zipAsArray(
    updatedPlayer$,
    updatedBullets$,
    inputs$
  ).scan(initials.explosions, explosions.update).skip(1);

  const game$ = Bacon.zipWith(
    toObject('player', 'bullets', 'world', 'explosions', 'crates', 'input'),
    updatedPlayer$,
    updatedBullets$,
    updatedWorld$,
    updatedExplosions$,
    updatedCrates$,
    inputs$);

  return game$;
}

const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

const gameState$ = createGameLoop(input$.filter(isRunning$), engine, {
  player: player.initial(engine),
  bullets: bullets.initial(engine),
  explosions: explosions.initial(engine),
  world: world.initial(engine),
  crates: crates.initial(engine)
});

gameState$.onValue(render);
gameState$.filter(muted$.not()).onValue(playSounds);

