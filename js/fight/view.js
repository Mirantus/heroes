import {
  log,
  loadImages,
} from '../common.js';

import {
  heroStates,
  top,
  heroWidth,
  heroHeight,
  heroStatusTop,
  heroStatusWidth,
  heroStatusHeight,
  heroShadowWidth,
} from './constants.js';

import { heroes } from '../heroes.js';

import {
  countFrames,
  getPackResources,
  getHeroDirection,
  getHeroImages,
  sortPackForRender,
} from './utils.js';

let canvas, ctx, state;

const renderHeroImage = (hero) => {
  const image = new Image(heroWidth, heroHeight);

  const direction = getHeroDirection(hero);
  const heroImages = getHeroImages(hero);

  const imageName = heroImages[hero.state][hero.frame];

  image.src = `images/${direction}/${hero.id}/${hero.state}/${imageName}`;

  ctx.drawImage(image, hero.x, top, heroWidth, heroHeight);
}

const renderHeroStatus = (hero) => {
  ctx.fillStyle = "green";

  const heroStatusLeft = hero.flip ?
    hero.x + heroWidth / 1.6 :
    hero.x + heroWidth / 3.2;

  ctx.fillRect(heroStatusLeft, heroStatusTop, heroStatusWidth / 5 * hero.health, heroStatusHeight);
  ctx.strokeRect(heroStatusLeft, heroStatusTop, heroStatusWidth, heroStatusHeight);
}

const renderHero = (hero) => {
  if (hero.state === heroStates.dead) {
    return;
  }

  renderHeroImage(hero);
  renderHeroStatus(hero);
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sortPackForRender(state.attacker.pack).forEach(renderHero);
  sortPackForRender(state.defender.pack).forEach(renderHero);

  requestAnimationFrame(render);
};

const getHeroShift = (index, pack) => (pack.length - 1 - index) * heroShadowWidth;

const initAttacker = async () => {
  const attackerPack = state.attacker.pack.map((hero, index, pack) => ({
    ...hero,
    x: getHeroShift(index, pack)
  }));

  state.setPack(state.attacker, attackerPack);

  return loadImages(
    getPackResources(state.attacker.pack)
  );
};

const initDefender = async () => {
  const defenderPack = state.defender.pack.map((hero, index, pack) => ({
    ...hero,
    flip: true,
    x: canvas.width - heroWidth - getHeroShift(index, pack)
  }));

  state.setPack(state.defender, defenderPack);

  return loadImages(
    getPackResources(state.defender.pack)
  );
}

const init = async (initialState) => {
  state = initialState;
  canvas = document.getElementById("arena");
  ctx = canvas.getContext("2d");

  await initAttacker();
  await initDefender();
};

const run = () => {
  requestAnimationFrame(render);
};

const showHeroState = async (hero) => {
  hero.frame = 0;
  const framesCount = countFrames(hero);

  const promise = new Promise(resolve => {
    const timerId = setInterval(() => {
      if (hero.frame === framesCount - 1) {
        clearInterval(timerId);
      } else {
        hero.frame++;
      }

      if (hero.frame === framesCount - 2) {
        resolve();
      }
    }, 100);
  });

  return promise;
};

export default {
  init,
  run,
  showHeroState
};