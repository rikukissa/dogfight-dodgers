import Bacon from 'baconjs';
import extend from 'extend';

import {
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

function initialState() {
  return {
    keys: {
      up: false,
      down: false,
      left: false,
      right: false
    },
    shoot: []
  };
}

let inputState = initialState();

const keyDown$ = Bacon.fromEvent(window, 'keydown')
  .map('.keyCode').filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({[keys[keyCode]]: true}));

const keyUp$ = Bacon.fromEvent(window, 'keyup')
  .map('.keyCode').filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({[keys[keyCode]]: false}));

const keysDown$ = keyUp$.merge(keyDown$)
  .scan(inputState.keys, extend);

const shoot$ = Bacon.fromEvent(window, 'keydown')
  .map('.keyCode')
  .filter((c) => c === SPACE_KEY);

keysDown$.onValue(value => inputState.keys = value);
shoot$.onValue(() => inputState.shoot.push(true));

export function getState() {
  return inputState;
}

export function flush() {
  inputState = {
    keys: inputState.keys,
    shoot: []
  }
}
