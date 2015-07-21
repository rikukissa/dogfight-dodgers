import {scale, toRGB, rectPath, image} from 'render/utils';
import {randomGenerator, clamp} from 'utils';
import {SCALE} from 'render/constants';
import {GROUND_LEVEL} from 'constants';
import {WIDTH, HEIGHT} from 'world';
import {canvas, ctx} from 'render/canvas';

export const SKY_COLOR = [168, 227, 233];
export const SPACE_COLOR = [17, 103, 125];

const GROUND = image(require('url!ground.png'));

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

function hueForHeight(cameraPosition) {
  const modifier = -(cameraPosition * SCALE) / HEIGHT;
  return SKY_COLOR.map((num, i) => {
    return clamp(0, 255, Math.floor(num - (num - SPACE_COLOR[i]) * modifier));
  });
}

function createGradient(translation) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  const canvasInGame = canvas.height * SCALE;

  gradient.addColorStop(0, toRGB(hueForHeight(-translation.y)));
  gradient.addColorStop(1, toRGB(hueForHeight(-translation.y - canvasInGame)));

  return gradient;
}

function renderBackgroundLayer(layer, translation) {
  const groundLevel = scale(GROUND_LEVEL);

  const nextOffset = 1;

  const {
    strokeStyle,
    fillStyle,
    maxHeight,
    minHeight,
    spaceBetween,
    parallax
  } = layer;

  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = 3;
  ctx.beginPath();

  const bounces = Math.floor(scale(WIDTH) / spaceBetween);

  const y = (val) => canvas.height - groundLevel - val;

  const translationOffset = -translation.x * parallax;
  const totalTranslation = translation.x + translationOffset;

  ctx.translate(translationOffset, 0);

  const startBounce = Math.floor(-totalTranslation / layer.spaceBetween);

  const endBounce = Math.min(
    bounces,
    startBounce + Math.floor(canvas.width / layer.spaceBetween) + 1 + nextOffset
  );

  let randomFn;
  let startFrom;

  if(startBounce > 0) {
    const seedOffset = startBounce * 2;
    randomFn = randomGenerator(layer.seed + seedOffset - 2);
    startFrom = y(minHeight / 2 * randomFn());
    randomFn = randomGenerator(layer.seed + seedOffset);
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
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function renderGround(translation) {

  const width = GROUND.width / 2;
  const ratio = width / GROUND.width;
  const height = width * ratio;
  const pieces = Math.ceil(canvas.width / width) + 1;

  const y = canvas.height - scale(GROUND_LEVEL);
  ctx.save();

  ctx.strokeStyle = '#736c61';
  ctx.fillStyle = '#7f786f';
  ctx.lineWidth = 2;

  rectPath(0, y, scale(WIDTH), scale(GROUND_LEVEL));
  ctx.fill();
  ctx.stroke();

  ctx.translate(-translation.x, 0);

  for(let i = 0; i < pieces; i++) {
    const x = width * i + (translation.x % width);
    ctx.drawImage(GROUND, x, y, width, height);
  }

  ctx.restore();

}

export function render(translation) {
  ctx.fillStyle = createGradient(translation);
  ctx.fillRect(-translation.x, -translation.y, canvas.width, canvas.height);


  layers.forEach((layer) => {
    renderBackgroundLayer(layer, translation);
  });


  renderGround(translation);

}
