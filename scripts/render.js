import radians from 'degrees-radians';
import extend from 'extend';
import range from 'lodash.range';
import {canvas, ctx} from './canvas'
import {WORLD_WIDTH} from './constants';
import {clamp} from './utils';

require('./style.css');

function image(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const sprites = {
  plane: {
    image: image(require('url!../assets/plane.png')),
    w: 119, h: 74
  },
  bullet: {
    image: image(require('url!../assets/bullet.png')),
    w: 40, h: 16
  },
  background: {
    w: 3000,
    h: 171,
    layers: [
      image(require('url!../assets/layer0.png')),
      image(require('url!../assets/layer1.png')),
      image(require('url!../assets/layer2.png')),
      image(require('url!../assets/layer4.png')),
      image(require('url!../assets/layer5.png'))
    ]
  }
}

function drawSprite(context, sprite, x, y, w, h) {
  context.drawImage(sprite.image, 0, 0, sprite.w, sprite.h, x, y, w, h);
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

function renderBackground(translation) {
  const width = WORLD_WIDTH / SCALE;
  const {w, h} = sprites.background;
  const ratio = w / width;
  const height = h / ratio;

  sprites.background.layers.forEach((layer, i) => {
    ctx.drawImage(layer,
      (translation.x / 20 * i), 0,
      w, h,
      0, canvas.height - height,
      width, height
    );
  });
}

function cameraTranslation(player) {
  const playerOnCanvas = gameToCanvas(player.position);

  return {
    x: Math.max(-(WORLD_WIDTH / SCALE - canvas.width), Math.min(0, canvas.width / 2 - playerOnCanvas.x)),
    y: Math.max(0, canvas.height / 2 - playerOnCanvas.y)
  }
}

export function render({player, bullets}) {
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y)

  renderBackground(translation);
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
