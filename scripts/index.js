import {World} from 'p2';
import {render} from 'render';
import {contactMaterials} from 'materials';
import {playSounds} from 'sounds';
import gameLoop from 'gameLoop';
import * as input from 'input';

import {initial as initialWorld, update as updateWorld} from './world';
import {initial as initialPlayer, update as updatePlayer} from './player';
import {initial as initialPlanes, update as updatePlanes} from './plane';
import {initial as initialBullets, update as updateBullets} from './bullet';
import {initial as initialCrates, update as updateCrates} from './crate';
import {initial as initialExplosions, update as updateExplosions} from './explosion';

/*
 * Physics world initialization
 */

const engine = new World({
  gravity: [0, -9.82]
});

contactMaterials.forEach(material => engine.addContactMaterial(material));

/*
 * Game state & game loop
 */

let state = {
  world: initialWorld(engine),
  player: initialPlayer(engine),
  bullets: initialBullets(engine),
  crates: initialCrates(engine),
  explosions: initialExplosions(engine),
  planes: initialPlanes(engine)
};

gameLoop(function(delta) {

  const inputState = input.getState();

  inputState.delta = delta.delta;
  input.flush();

  const world = updateWorld(state.world, inputState);
  const player = updatePlayer(state.player, inputState, world);
  const planes = updatePlanes(state.planes, inputState, world);
  const bullets = updateBullets(state.bullets, inputState, world, player);
  const crates = updateCrates(state.crates, inputState, world);
  const explosions = updateExplosions(state.explosions, inputState, bullets);

  state = {
    world,
    player,
    planes,
    bullets,
    crates,
    explosions
  };

  render(state);
  playSounds(state);

});

