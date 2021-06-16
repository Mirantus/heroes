import { log, wait, getResources, loadImages } from '../common.js';

import { heroStates, top, heroWidth, heroHeight, heroStatusTop, heroStatusWidth, heroStatusHeight, heroShadowWidth, images } from './constants.js';

let canvas, ctx, state;

const heroName = 'knight';

const renderHeroImage = (hero) => {
  const image = new Image(heroWidth, heroHeight);

  const heroType = hero.flip ? 'defender' : 'attacker';

  if (hero.state) {
    const imageName = images[heroType][heroName][hero.state][hero.frame];
    
    image.src = `images/${heroType}/${heroName}/${hero.state}/${imageName}`;
  } else {
    const imageName = images[heroType][heroName].default;

    image.src = `images/${heroType}/${heroName}/default/${imageName}`;
  }

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

const getSortedPack = (pack) => {
  const sorted = [...pack].reverse();
  const currentHeroIndex = sorted.findIndex(hero => hero.state === heroStates.attack);

  if (currentHeroIndex > -1) {
    const [currentHero] = sorted.splice(currentHeroIndex, 1);
    sorted.push(currentHero);
  }

  return sorted;
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  getSortedPack(state.attacker.pack).forEach(renderHero);
  getSortedPack(state.defender.pack).forEach(renderHero);

  requestAnimationFrame(render);
};

const init = async (initialState) => {
  state = initialState;
  canvas = document.getElementById("arena");
  ctx = canvas.getContext("2d");

  const resources = getResources(images, 'images/');
  await loadImages(resources);

  const getHeroShift = (index, pack) => (pack.length - 1 - index) * heroShadowWidth;

  const attackerPack = state.attacker.pack.map((hero, index, pack) => ({
    ...hero,
    x: getHeroShift(index, pack)
  }));

  const defenderPack = state.defender.pack.map((hero, index, pack) => ({
    ...hero,
    flip: true,
    x: canvas.width - heroWidth - getHeroShift(index, pack)
  }));

  state.setPack(state.attacker, attackerPack);
  state.setPack(state.defender, defenderPack);
};

const run = () => {
  requestAnimationFrame(render);
};

const showHeroState = async (hero) => {
  hero.frame = 0;
  const framesCount = images.attacker[heroName][hero.state].length;

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