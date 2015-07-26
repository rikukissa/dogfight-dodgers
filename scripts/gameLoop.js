import Bacon from 'baconjs';
import extend from 'extend';
import AnimationFrame from 'animation-frame';

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
const keys = {
  [UP_KEY]: 'up',
  [DOWN_KEY]: 'down',
  [LEFT_KEY]: 'left',
  [RIGHT_KEY]: 'right'
};

const initial = {
  up: false,
  down: false,
  left: false,
  right: false
};

const keyDown$ = Bacon.fromEvent(window, 'keydown')
  .map('.keyCode').filter(c => keys.hasOwnProperty(c));


const keyUp$ = Bacon.fromEvent(window, 'keyup')
  .map('.keyCode').filter(c => keys.hasOwnProperty(c));

const keyPress$ = keyDown$.map((keyCode) => ({[keys[keyCode]]: true}));
const keyRelease$ = keyUp$.map((keyCode) => ({[keys[keyCode]]: false}));

const keysDown$ = keyRelease$.merge(keyPress$).scan(initial, extend);

Bacon.fromEvent(window, 'keydown')
  .map('.keyCode')
  .filter((c) => c === SPACE_KEY)
  .onValue(() => input.shoot.push(true));

const input = {
  keys: initial,
  shoot: []
};

keysDown$.onValue(value => input.keys = value);

const deltaTime = (() => {
  let lastTime;

  return function timeDelta(timestamp) {
    const current = timestamp / 1000;

    lastTime = lastTime || current;
    const difference = current - lastTime;

    lastTime = current;

    return {
      current,
      difference,
      delta: difference / WORLD_SPEED
    };
  };
})();

const animationFrame = new AnimationFrame(FRAME_RATE);

export default function gameLoop(fn) {

  function loop(timestamp) {
    animationFrame.request(loop);

    const delta = deltaTime(timestamp);
    const frameInput = extend({}, input, {time: delta});

    input.shoot = [];

    return fn(frameInput);
  }

  loop(0);
}

