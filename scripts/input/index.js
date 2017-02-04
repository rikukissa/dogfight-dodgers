import {Observable} from 'rxjs';
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

const keyDown$ = Observable.fromEvent(window, 'keydown')
  .map(({ keyCode }) => keyCode).filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({[keys[keyCode]]: true}));

const keyUp$ = Observable.fromEvent(window, 'keyup')
  .map(({ keyCode }) => keyCode).filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({[keys[keyCode]]: false}));


const shoot$ = Observable.fromEvent(window, 'keydown')
  .map(({ keyCode }) => keyCode)
  .filter((c) => c === SPACE_KEY);

const keysDown$ = keyUp$.merge(keyDown$).scan(extend, inputState.keys);

keysDown$.subscribe(value => inputState.keys = value);
shoot$.subscribe(() => inputState.shoot.push(true));

export function getState() {
  return inputState;
}

export function flush() {
  inputState = {
    keys: inputState.keys,
    shoot: []
  }
}
