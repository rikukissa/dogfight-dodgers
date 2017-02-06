const tape = require('tape');
const json = require('tap-json');
const test = tape.createHarness();

import merge from 'lodash.merge';
import update, { initialState } from 'gameLoop';
import { PLAYER_JOINED } from 'network/actions';

function createFakeInput(overrides) {
  return merge({
    time: {
      delta: 1
    },
    bodies: {
      player: {
        angle: 0,
        position: [0, 0]
      }
    },
    input: {
      shoot: false,
      keys: {
        down: false
      }
    },
    lastDelta: 1
  }, overrides);
}

test('timing test', function (t) {
  t.plan(1);
  t.equal(typeof Date.now, 'function');
});


test('new bullet is spawned when user presses spacebar', function (t) {
  t.plan(1);

  const newState = update(initialState, createFakeInput({
    actions: [{
      type: 'KEYDOWN',
      payload: 'space'
    }]
  }));

  t.equal(newState.bullets.length, 1, 'Bullet was not created when user pressed spacebar');
});


test('new enemy is spawned when a PLAYER_JOINED action is received', function (t) {
  t.plan(1);

  const newState = update(initialState, createFakeInput({
    actions: [{
      type: PLAYER_JOINED,
      payload: {
        id: Date.now(),
        thrust: 1.557750728515433e-17,
        throttle: 0,
        healt: 1,
        bullets: 20,
        body: {
          angle: 0,
          position: [
            9,
            0.5
          ]
        }
      }
    }]
  }));

  t.equal(newState.enemies.length, 1, 'Enemy was not created on PLAYED_JOINED event');
});

/*
 * Pretty printer
 */

test.createStream().pipe(json()).on('data', ({stats, asserts}) => {
  if(stats.passes === stats.asserts) {
    console.log(`%c ✅ All asserts passing ${stats.passes}/${stats.asserts}`, 'color: green');
    return;
  }
  console.log(`%c❌ Some tests are failing. ${stats.passes}/${stats.asserts} passing`, 'color: red');

  asserts.filter(({ok}) => !ok).forEach((assertion) => {
    const extra = JSON.stringify(assertion.extra, null, 2).split('\n').map(row => `\t\t${row}`).join('\n');
    console.log(`%c\t ${assertion.comment}\n${extra}`, 'color: red');
  });


})