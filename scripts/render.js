import radians from 'degrees-radians';
import extend from 'extend';
import range from 'lodash.range';
import {canvas, ctx} from './canvas'
import {WIDTH, HEIGHT} from './world';
import {
  clamp,
  randomGenerator,
  image,
  memoizeArgs,
  toRGB} from './utils';

const SKY_COLOR = [168, 227, 233];
const SPACE_COLOR = [17, 103, 125];

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

function renderBackgroundLayer(layer, translation) {
  const groundLevel = scale(1.5);

  const nextOffset = 1;

  const {
    strokeStyle,
    fillStyle,
    maxHeight,
    minHeight,
    spaceBetween,
    parallax
  } = layer;

  ctx.save()
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = 3;
  ctx.beginPath()

  const bounces = Math.floor(scale(WIDTH) / spaceBetween);

  const y = (y) => canvas.height - groundLevel - y;

  const translationOffset = -translation.x * parallax;
  const totalTranslation = translation.x + translationOffset;

  ctx.translate(translationOffset, 0)

  const startBounce = Math.floor(-totalTranslation / layer.spaceBetween);

  const endBounce = Math.min(
    bounces,
    startBounce + Math.floor(canvas.width / layer.spaceBetween) + 1 + nextOffset
  )

  let randomFn;
  let startFrom;

  if(startBounce > 0) {
    const seedOffset = startBounce * 2;
    randomFn = randomGenerator(layer.seed + seedOffset - 2);
    startFrom = y(minHeight / 2 * randomFn());
    randomFn = randomGenerator(layer.seed + seedOffset)
  } else {
    randomFn = randomGenerator(layer.seed);
    startFrom = canvas.height - groundLevel;
  }

  for(let i = startBounce; i < endBounce; i++) {
    const endHeight = i === bounces - 1 ? y(0) : y(minHeight / 2 * randomFn());

    ctx.bezierCurveTo(
      i * spaceBetween, startFrom,
      i * spaceBetween + spaceBetween / 2, y(Math.max(minHeight, randomFn() * maxHeight)),
      (i + 1) * spaceBetween, endHeight
    );

    startFrom = endHeight;
  }

  ctx.lineTo(-totalTranslation + canvas.width, canvas.height - groundLevel);

  ctx.lineTo(startBounce * spaceBetween, canvas.height - groundLevel);
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

const layers = [
  {
    strokeStyle: '#8edbe2',
    fillStyle: '#8edbe2',
    maxHeight: 250,
    minHeight: 200,
    spaceBetween: 500,
    parallax: 0.9
  },
  {
    strokeStyle: '#6cd0d9',
    fillStyle: '#6cd0d9',
    maxHeight: 200,
    minHeight: 100,
    spaceBetween: 300,
    parallax: 0.8
  },
  {
    strokeStyle: '#9e917b',
    fillStyle: '#b6a78e',
    maxHeight: 120,
    minHeight: 100,
    spaceBetween: 250,
    parallax: 0.4
  },
  {
    strokeStyle: '#91856e',
    fillStyle: '#9e917b',
    maxHeight: 100,
    minHeight: 80,
    spaceBetween: 200,
    parallax: 0.3
  }
].map((layer) => {
  layer.seed = Math.ceil(Math.random() * 100);
  return layer;
});

function renderBackground(translation) {
  const groundLevel = scale(1.5);

  layers.forEach((layer, i) => {
    renderBackgroundLayer(layer, translation);
  });

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

function hueForHeight(position) {
  const modifier = position / HEIGHT;

  return SKY_COLOR.map((num, i) => {
    return clamp(0, 255, Math.floor(num - (num - SPACE_COLOR[i]) * modifier));
  });
}

function createGradient(player) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  const canvasInGame = canvas.height * SCALE;

  gradient.addColorStop(0, toRGB(hueForHeight(player.position.y)));
  gradient.addColorStop(1, toRGB(hueForHeight(player.position.y - canvasInGame)));

  return gradient;
}

export function render({player, bullets, world}) {
  ctx.save()

  ctx.fillStyle = createGradient(player);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
