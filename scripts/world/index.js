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
    world.impacts = narrowphase.contactEquations
      .filter(eq => eq.firstImpact);
  }

  return world;
}


