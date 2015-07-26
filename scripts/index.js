import {World} from 'p2';
import {render} from 'render';
import {contactMaterials} from 'materials';
import {playSounds} from 'sounds';
import gameLoop from 'gameLoop';

import {initial as initialWorld, update as updateWorld} from './world';
import {initial as initialPlayer, update as updatePlayer} from './plane';
import {initial as initialBullets, update as updateBullets} from './bullet';
import {initial as initialCrates, update as updateCrates} from './crate';
import {initial as initialExplosions, update as updateExplosions} from './explosion';

const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

let state = {
  world: initialWorld(engine),
  player: initialPlayer(engine),
  bullets: initialBullets(engine),
  crates: initialCrates(engine),
  explosions: initialExplosions(engine)
};

gameLoop(function (input) {

  const world = updateWorld(state.world, input);
  const player = updatePlayer(state.player, input);
  const bullets = updateBullets(state.bullets, input, world, player);
  const crates = updateCrates(state.crates, input);
  const explosions = updateExplosions(state.explosions, input, bullets);

  state = {
    world,
    player,
    bullets,
    crates,
    explosions
  };

  render(state);
  playSounds(state);

});

