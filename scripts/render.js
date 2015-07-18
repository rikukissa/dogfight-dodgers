import radians from 'degrees-radians';
import extend from 'extend';
import range from 'lodash.range';
import {canvas, ctx} from './canvas'

require('./style.css');

const sprites = {
  background: {x: 0, y: 0, w: 3000, h: 168},
  plane: {x: 0, y: 169, w: 119, h: 74},
  bullet: {x: 119, y: 169, w: 40, h: 16}
}

const atlas = new Image()
atlas.src = require('url!../assets/atlas.png');

function drawSprite(context, sprite, x, y, w, h) {
  context.drawImage(atlas, sprite.x, sprite.y, sprite.w, sprite.h, x, y, w, h);
}

/*
 * reverses y coordinate
 */

const SCALE = 1/35;

function gameToCanvas({x, y}) {
  return {
    x: x / SCALE,
    y: canvas.height - y / SCALE
  }
}

function renderObject(object, spriteName) {

  const width = object.dimensions.width / SCALE;
  const height = object.dimensions.height / SCALE;

  const canvasCoordinates = gameToCanvas(object.position);


  ctx.save();

  ctx.translate(canvasCoordinates.x, canvasCoordinates.y)
  ctx.rotate(radians(object.angle))
  ctx.translate(-width / 2, height / 2)

  drawSprite(ctx,
    sprites[spriteName],
    0,
    0,
    width,
    -height
  )
  ctx.restore()
}

function renderBullets(bullets) {
  bullets.forEach(bullet => renderObject(bullet, 'bullet'));
}

function renderPlayer(player) {
  renderObject(player, 'plane');
}

function renderBackground() {
  drawSprite(ctx,
    sprites.background,
    0,
    canvas.height - sprites.background.h,
    sprites.background.w,
    sprites.background.h);
}

function cameraTranslation(player) {
  const playerOnCanvas = gameToCanvas(player.position);
  return {
    x: Math.min(0, canvas.width / 2 - playerOnCanvas.x),
    y: Math.max(0, canvas.height / 2 - playerOnCanvas.y)
  }
}

export function render({player, bullets}) {
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y)

  renderBackground();
  renderPlayer(player);
  renderBullets(bullets);
  ctx.restore()
}

export function renderFuture(future, {player, bullets}) {
  ctx.save();
  ctx.globalAlpha = 0.3;

  const translation = cameraTranslation(player);

  ctx.translate(
    translation.x + future.player.position.x - player.position.x,
    translation.y)

  renderPlayer(future.player);
  renderBullets(future.bullets);
  ctx.restore();
}

require('./hotReplaceNotifier')();
