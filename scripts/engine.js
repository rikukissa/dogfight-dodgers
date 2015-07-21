import {Engine, World, Bodies} from 'matter-js';

export const engine = Engine.create(document.body);
export function tick(delta) {
  Engine.update(engine, delta);
}
// // create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);
// var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// // add all of the bodies to the world
// World.add(engine.world, [boxA, boxB, ground]);
