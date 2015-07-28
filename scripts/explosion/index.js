import set from 'lodash.set';
import partialRight from 'lodash.partialright';

export const ALIVE_TIME = 1000;

export function initial() {
  return {
    explosions: [],
    sounds: {
      created: []
    }
  };
}

export function update({explosions, sounds}, input, bullets) {

  const newExplosions = bullets.explosions
    .map(({body: {position: [x, y]}}) => ({
      position: {x, y},
      aliveTime: 0
    }));

  return {
    explosions: explosions
      .filter((e) => e.aliveTime < ALIVE_TIME)
      .map((e) => {
        e.aliveTime += input.delta;
        return e;
      })
      .concat(newExplosions),
    sounds: {
      created: sounds.created.concat(bullets.explosions)
    }
  };
}
