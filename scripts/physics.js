import p2, {World} from 'p2';
import {ground} from 'materials';
import {Subject} from 'rxjs';
import {contactMaterials} from 'materials';
import {
  WORLD_SPEED,
  MAX_SUBSTEPS
} from 'constants';

import createPlaneBody, { update as updatePlaneBody, updateEnemyBodies } from 'plane/body';
import { update as updateBulletBodies } from 'bullets/body';

export const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

function getCollisions() {
  const { emitImpactEvent, narrowphase } = engine;

  if(!emitImpactEvent) {
    return [];
  }

  const firstImpacts = narrowphase.contactEquations
    .filter(({firstImpact, bodyA, bodyB}) => firstImpact && bodyA.world && bodyB.world);

  return firstImpacts.filter(function uniquePair({bodyA, bodyB}, index) {
    for(let i = 0; i < index; i++) {
      if(firstImpacts[i].bodyA === bodyA && firstImpacts[i].bodyB === bodyB ||
        firstImpacts[i].bodyB === bodyA && firstImpacts[i].bodyA === bodyB) {
        return false;
      }
    }
    return true;
  });
}




/*
 * Ground
 */

const body = new p2.Body({mass: 0});
const shape = new p2.Plane();
shape.material = ground;
body.addShape(shape);
engine.addBody(body);

const stateSubject$ = new Subject();

let playerBody;

function updateWorld(prevState, state) {

  /*
  * Player
  */


  if(state.tick === 1) {
    playerBody = createPlaneBody();
    playerBody.id = state.player.id;
    engine.addBody(playerBody);
  }

  updatePlaneBody(playerBody, state.player, state.lastDelta);

  const bullets = updateBulletBodies(engine, prevState, state);
  const enemies = updateEnemyBodies(engine, prevState, state);

  engine.step(WORLD_SPEED, state.lastDelta * WORLD_SPEED, MAX_SUBSTEPS);

  return {
    bullets,
    enemies,
    player: {
      angle: playerBody.angle,
      velocity: playerBody.velocity,
      position: [...playerBody.position]
    },
    collisions: getCollisions()
  };
}

const initialState = {
  bullets: [],
  player: {
    angle: 0,
    position: [5, 30]
  },
  collisions: getCollisions()
};

export function update(state) {
  stateSubject$.next(state);
}

export const state$ = stateSubject$.scan(updateWorld, initialState).startWith(initialState);
