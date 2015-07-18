import radians from 'degrees-radians';
import extend from 'extend';
import range from 'lodash.range';
import {canvas, ctx} from './canvas'
import {WIDTH} from './world';
import {clamp, randomGenerator, image, memoizeArgs} from './utils';

const RANDOM_SEED = Math.ceil(Math.random() * 1000);

require('./style.css');

const sprites = {
  plane: {
    image: image(require('url!../assets/plane.png')),
    w: 119, h: 74
  },
  bullet: {
    image: image(require('url!../assets/bullet.png')),
    w: 40, h: 16
  }
}

function drawSprite(context, sprite, x, y, w, h) {
  context.drawImage(sprite.image, 0, 0, sprite.w, sprite.h, x, y, w, h);
}

/*
 * reverses y coordinate
 */

const SCALE = 1/35;

function scale(num) {
  return num / SCALE;
}

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

function renderBullets({bullets}) {
  bullets.forEach(bullet => renderObject(bullet, 'bullet'));
}

function renderPlayer(player) {
  renderObject(player, 'plane');
}

const toggleDangerZone = memoizeArgs(function(active) {
  document.body.classList.toggle('danger-zone', active);
});

function renderWorld(world) {
  toggleDangerZone(world.dangerZone);
}


function rectPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
 }

function renderBackgroundLayer(index, strokeStyle, fillStyle, maxHeight, minHeight, spaceBetween) {
  const groundLevel = scale(1.5);

  ctx.save()

  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = 2;
  ctx.beginPath()

  const random = randomGenerator(RANDOM_SEED + index * 1000);
  const startX = spaceBetween / 2 * random();
  const bounces = Math.floor(scale(WIDTH) / spaceBetween);

  const y = (y) => canvas.height - groundLevel - y;

  let startFrom = canvas.height - groundLevel;

  for(let i = 0; i < bounces; i++) {
    const endHeight = i === bounces - 1 ? y(0) : y(random() * maxHeight);

    ctx.bezierCurveTo(
      startX + i * spaceBetween,
      startFrom,
      i * spaceBetween + spaceBetween / 2,
      Math.min(Math.min(startFrom, endHeight) - (maxHeight * 0.1), y(random() * maxHeight)),
      (i + 1) * spaceBetween,
      endHeight
    );
    startFrom = endHeight;
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function renderBackground(translation) {
  const groundLevel = scale(1.5);

  renderBackgroundLayer(0, '#8edbe2', '#8edbe2', 220, 70, 500)
  renderBackgroundLayer(1, '#6cd0d9', '#6cd0d9', 100, 50, 300)
  renderBackgroundLayer(2, '#9e917b', '#b6a78e', 80, 30, 200)
  renderBackgroundLayer(3, '#91856e', '#9e917b', 50, 10, 200)

  ctx.save()
  ctx.strokeStyle = '#736c61';
  ctx.fillStyle = '#7f786f';
  ctx.lineWidth = 2;

  rectPath(0, canvas.height - groundLevel, scale(WIDTH), groundLevel)

  ctx.fill()
  ctx.stroke()
  ctx.restore()

}

function cameraTranslation(player) {
  const playerOnCanvas = gameToCanvas(player.position);

  return {
    x: Math.max(-(WIDTH / SCALE - canvas.width), Math.min(0, canvas.width / 2 - playerOnCanvas.x)),
    y: Math.max(0, canvas.height / 2 - playerOnCanvas.y)
  }
}

export function render({player, bullets, world}) {
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const translation = cameraTranslation(player);
  ctx.translate(translation.x, translation.y)

  renderBackground(translation);
  renderPlayer(player);
  renderBullets(bullets);
  renderWorld(world);
  ctx.restore()
}

export function renderFuture(future, {player, bullets, world}) {
  ctx.save();
  ctx.globalAlpha = 0.3;

  const translation = cameraTranslation(player);

  ctx.translate(
    translation.x + future.player.position.x - player.position.x,
    translation.y)

  renderPlayer(future.player);
  renderBullets(future.bullets);
  renderWorld(future.world);
  ctx.restore();
}

require('./hotReplaceNotifier')();
