import {
  Observable
  // , Subject
} from 'rxjs';
// import extend from 'extend';
// import { toObject } from 'utils';

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
  [RIGHT_KEY]: 'right',
  [SPACE_KEY]: 'space',
};

// const initialState = {
//   keys: {
//     up: false,
//     down: false,
//     left: false,
//     right: false
//   },
//   shoot: false
// };

// const flush$ = new Subject();


// const keyUp$ = Observable.fromEvent(window, 'keyup')
//   .map(({ keyCode }) => keyCode).filter(c => keys.hasOwnProperty(c))
//   .map((keyCode) => ({[keys[keyCode]]: false}));

const keyDown$ = Observable.fromEvent(window, 'keydown')
  .map(({ keyCode }) => keyCode).filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({type: 'KEYDOWN', payload: keys[keyCode]}));

const keyUp$ = Observable.fromEvent(window, 'keyup')
  .map(({ keyCode }) => keyCode).filter(c => keys.hasOwnProperty(c))
  .map((keyCode) => ({type: 'KEYUP', payload: keys[keyCode]}));

export const keys$ = keyDown$.merge(keyUp$);

// export const space$ = Observable.fromEvent(window, 'keydown')
//   .map(({ keyCode }) => keyCode)
//   .filter((c) => c === SPACE_KEY)
//   .map((keyCode) => ({type: 'KEYDOWN', payload: keys[keyCode]}))

// const keys$ = keyUp$
//   .merge(keyDown$)
//   .scan(extend, initialState.keys).map(toObject('keys'));

// const shoot$ = space$.mapTo(true).merge(flush$.mapTo(false))
//   .map(toObject('shoot'));

// export default keys$.merge(shoot$)
//   .scan(extend, initialState)
//   .startWith(initialState);

// export function flush() {
//   flush$.next({});
// }