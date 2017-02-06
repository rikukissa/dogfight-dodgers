import p2 from 'p2';
import {GROUND_LEVEL} from 'world';
import {WIDTH, HEIGHT, TYPE, MAX_SPEED} from 'plane';
import {plane as material} from 'materials';
import {RADIAN} from 'constants';

export default function create(bodyOpts) {
  const body = new p2.Body({
    angle: 0,
    mass: 0.01,
    position: [9, GROUND_LEVEL + HEIGHT / 2],
    ...bodyOpts
  });

  body.TYPE = TYPE;

  body.addShape(new p2.Box({
    width: WIDTH,
    height: HEIGHT,
    material
  }));

  return body;
}

export function getHeadLift(speed, angle) {
  angle = angle - RADIAN * 0.10;
  const max = RADIAN * 0.25;
  const multiplier = speed / MAX_SPEED;
  return multiplier * (1 + (angle - max) / max);
}

export function update(body, plane, delta) {

  body.angle = plane.body.angle;

  const deltaAngle = Math.sin(body.angle - RADIAN / 2);
  const drag = 0.005 * deltaAngle * delta;

  // body.velocity[0] -= drag;

  const planeAngle = plane.body.angle + RADIAN * 1.25

  body.force[0] += ((plane.thrust / 10) * Math.sin(planeAngle) * delta);
  body.force[1] += ((plane.thrust / 10) *  Math.cos(planeAngle) * delta);

  if(body.position[1] < 1) {
    body.force[1] += getHeadLift(body.force[0], planeAngle) * 0.05;
  }



  body.velocity[0] = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, body.velocity[0]));
  body.velocity[1] = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, body.velocity[1]));

  return body;
}

export function updateEnemyBodies(engine, prevState, state) {

  const aliveBodies = engine.bodies.filter(body => body.TYPE === TYPE && body.id !== state.player.id);
  const aliveIds = aliveBodies.map(({id}) => id);
  const stateIds = state.enemies.map(({id}) => id);

  state.enemies.forEach((enemy) => {
    const index = aliveIds.indexOf(enemy.id);

    let body;

    if(index === -1) {
      body = create(enemy.body);
      body.id = enemy.id;
      engine.addBody(body);
    } else {
      body = aliveBodies[index];
    }

    update(body, enemy, state.lastDelta);
  });

  aliveBodies.forEach((body) => {
    if(stateIds.indexOf(body.id) === -1) {
      engine.removeBody(body);
    }
  });

  return state.enemies;
}