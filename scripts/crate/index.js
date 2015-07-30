import {Body, Box} from 'p2';
import {crate as material} from 'materials';
import range from 'lodash.range';
import plane from 'plane';

const TYPE = {};
export {TYPE as default};
export const CRATE_SIZE = 1;
export function initial(world) {

  function box(x, y) {

    const body = new Body({
      mass: 0.0001,
      position: [x, y]
    });

    body.TYPE = TYPE;

    const shape = new Box({
      width: CRATE_SIZE,
      height: CRATE_SIZE,
      material: material
    });

    body.addShape(shape);
    world.addBody(body);

    return body;
  }

  function create(x, y) {
    return {
      body: box(x, y),
      initialPosition: {x, y},
      lived: 0
    };
  }

  const crates = range(60).map((i) => {
    return create(20 + i % 12 * 2, CRATE_SIZE / 2 + 5 + Math.floor(i / 12) * 2)
  })

  return {
    crates,
    sounds: []
  };
}

function floatAround() {
  const movement = Math.sin(this.lived / 30 % (Math.PI * 2)) * 0.33;
  this.body.position[1] = this.initialPosition.y + movement;
  return this;
}

function getPlaneCollidingCrates(impacts) {
  return impacts.filter(({bodyA, bodyB}) => {
    return bodyA.TYPE === TYPE && bodyB.TYPE === plane ||
      bodyA.TYPE === plane && bodyB.TYPE === TYPE;
  }).map(({bodyA, bodyB}) => {
    return bodyA.TYPE === TYPE ? bodyA : bodyB;
  })
}

export function update(crates, input, world) {

  const cratesCollidingPlane = getPlaneCollidingCrates(world.impacts);

  cratesCollidingPlane.forEach(b => world.removeBody(b));

  return {
    crates: crates.crates.filter(crate => {
      return cratesCollidingPlane.indexOf(crate.body) === -1;
    }).map(crate => {
      crate.lived += input.delta;
      return crate::floatAround();
    }),
    sounds: cratesCollidingPlane.length === 0 ? [] : ['destroy']
  };
}
