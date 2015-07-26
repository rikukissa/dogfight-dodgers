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
      created: input.time.current
    }));

  return {
    explosions: explosions
      .filter((e) => input.time.current - e.created < ALIVE_TIME)
      .concat(newExplosions),
    sounds: {
      created: sounds.created.concat(bullets.explosions)
    }
  };
}
