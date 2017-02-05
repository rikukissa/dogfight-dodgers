import p2, {World} from 'p2';
import {ground} from 'materials';
import {Subject} from 'rxjs';
import {contactMaterials} from 'materials';
import {
  WORLD_SPEED,
  MAX_SUBSTEPS
} from 'constants';

import createPlaneBody, { update as updatePlaneBody } from 'plane/body';
import { update as updateBulletBodies } from 'bullets/body';

const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

/*
 * Ground
 */

const body = new p2.Body({mass: 0});
const shape = new p2.Plane();
shape.material = ground;
body.addShape(shape);
engine.addBody(body);

/*
 * Player
 */

const playerBody = createPlaneBody();
engine.addBody(playerBody);

const stateSubject$ = new Subject();

function updateWorld(prevState, state) {
  updatePlaneBody(playerBody, state);
  const bullets = updateBulletBodies(engine, prevState, state);

  engine.step(WORLD_SPEED, state.lastDelta * WORLD_SPEED, MAX_SUBSTEPS);

  return {
    bullets,
    player: {
      angle: playerBody.angle,
      position: [...playerBody.position]
    }
  };
}

const initialState = {
  bullets: [],
  player: {
    angle: playerBody.angle,
    position: [...playerBody.position]
  }
};

export function update(state) {
  stateSubject$.next(state);
}

export const state$ = stateSubject$.scan(updateWorld, initialState).startWith(initialState);
