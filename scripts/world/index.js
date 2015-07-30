import p2 from 'p2';
import {WORLD_SPEED, MAX_SUBSTEPS} from 'constants';
import {ground} from 'materials';

export const WIDTH = 1000;
export const HEIGHT = 100;
export const GROUND_LEVEL = 0;

export function initial(world) {
  const body = new p2.Body({mass: 0});
  const shape = new p2.Plane();
  shape.material = ground;
  body.addShape(shape);
  world.addBody(body);

  return world;
}

export function update(world, input) {
  world.step(WORLD_SPEED, input.delta * WORLD_SPEED, MAX_SUBSTEPS);

  const {emitImpactEvent, narrowphase} = world;

  if(!emitImpactEvent) {
    world.impacts = [];
  } else {
    const firstImpacts = narrowphase.contactEquations
      .filter(({firstImpact, bodyA, bodyB}) => firstImpact && bodyA.world && bodyB.world);

    world.impacts = firstImpacts.filter(function uniquePair({bodyA, bodyB}, index) {
      for(let i = 0; i < index; i++) {
        if(firstImpacts[i].bodyA === bodyA && firstImpacts[i].bodyB === bodyB ||
          firstImpacts[i].bodyB === bodyA && firstImpacts[i].bodyA === bodyB) {
          return false;
        }
      }
      return true;
    });
  }

  return world;
}


