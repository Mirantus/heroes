import {
  log,
  loadImage,
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
  getHeroDirection,
  getHeroImages,
  sortPackForRender,
} from './utils.js';

let canvas, ctx, state;

const fightImages = {
  attacker: {},
  defender: {},
};

const renderHeroImage = (hero) => {
  const direction = getHeroDirection(hero);
  
  const image = fightImages[direction][hero.id][hero.state][hero.frame];

  ctx.drawImage(image, hero.x, top, heroWidth, heroHeight);
}

const renderHeroStatus = (hero) => {
  if (!hero.health) return;

  ctx.fillStyle = "green";

  const heroStatusLeft = hero.flip ?
    hero.x + heroWidth / 1.6 :
    hero.x + heroWidth / 3.2;

  const healthPart = hero.health / heroes[hero.id].params.health;

  ctx.fillRect(heroStatusLeft, heroStatusTop, heroStatusWidth * healthPart, heroStatusHeight);

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

const loadPackImages = async (pack) => {
  const promises = [];

  pack.forEach(hero => {
    const direction = getHeroDirection(hero);
    const heroImages = getHeroImages(hero);

    if (fightImages[direction][hero.id]) {
      return;
    }
    
    fightImages[direction][hero.id] = {};

    Object.keys(heroImages).forEach(heroState => {
      fightImages[direction][hero.id][heroState] = fightImages[direction][hero.id][heroState] || [];

      heroImages[heroState].forEach((imageName, index) => {
        const src = `images/${direction}/${hero.id}/${heroState}/${imageName}`;

        const promise = loadImage(src).then(image => {
          fightImages[direction][hero.id][heroState][index] = image;
        });

        promises.push(promise);
      });
    });
  })

  return Promise.all(promises);
};

const initAttacker = async () => {
  const attackerPack = state.attacker.pack.map((hero, index, pack) => ({
    ...hero,
    x: getHeroShift(index, pack)
  }));

  state.setPack(state.attacker, attackerPack);

  return loadPackImages(attackerPack);
};

const initDefender = async () => {
  const defenderPack = state.defender.pack.map((hero, index, pack) => ({
    ...hero,
    flip: true,
    x: canvas.width - heroWidth - getHeroShift(index, pack)
  }));

  state.setPack(state.defender, defenderPack);

  return loadPackImages(defenderPack);
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
        resolve();
      } else {
        hero.frame++;
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