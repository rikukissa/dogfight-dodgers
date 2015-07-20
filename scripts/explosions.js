export const ALIVE_TIME = 1000;

export const initial = {
  explosions: [],
  sounds: {
    created: []
  }
};

export function update({explosions, sounds}, [player, {bullets}, input]) {

  return {
    explosions: explosions
      .filter((e) => input.time - e.created < ALIVE_TIME)
      .concat(bullets.filter(b => b.exploded)
        .map(({position}) => ({
          position,
          created: input.time
        }))),
    sounds: {
      created: sounds.created.concat(bullets.filter(b => b.exploded))
    }
  }
}
