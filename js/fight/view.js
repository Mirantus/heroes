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
  heroUltimateTop
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

const renderStatus = (x, y, percent, color) => {
  ctx.fillStyle = "gray";

  ctx.fillRect(x, y, heroStatusWidth, heroStatusHeight);

  ctx.fillStyle = color;

  ctx.fillRect(x, y, heroStatusWidth * percent / 100, heroStatusHeight);

  ctx.strokeRect(x, y, heroStatusWidth, heroStatusHeight);
}

const renderHeroStatus = (hero) => {
  if (!hero.health) return;

  const percent = hero.health * 100 / heroes[hero.id].params.health;

  let color;

  if (percent > 66) {
    color = "green";
  } else if (percent > 33) {
    color = "yellow";
  } else {
    color = "red";
  }

  renderStatus(getStatusLeft(hero), heroStatusTop, percent, color);
}

const renderHeroUltimate = (hero) => {
  if (!hero.health) return;

  const color = hero.ultimate === 100 ? "orange" : "blue";

  renderStatus(getStatusLeft(hero), heroUltimateTop, hero.ultimate, color);
}

const renderHero = (hero) => {
  if (hero.state === heroStates.dead) {
    return;
  }

  renderHeroImage(hero);
  renderHeroUltimate(hero);
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

const getStatusLeft = hero => hero.flip ?
  hero.x + heroWidth / 1.6 :
  hero.x + heroWidth / 3.2;

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

  canvas.addEventListener('click', handleClick);
};

const run = () => {
  requestAnimationFrame(render);
};

const showHeroState = async (hero) => {
  hero.frame = 0;
  const framesCount = countFrames(hero);

  const promise = new Promise(resolve => {
    const timerId = setInterval(() => {
      const isLastFrame = hero.frame === framesCount - 1;

      const isStopped = state.heroForUltimate && state.heroForUltimate !== hero;

      if (isLastFrame || isStopped) {
        clearInterval(timerId);
        resolve();
      } else {
        hero.frame++;
      }
    }, 100);
  });

  return promise;
};

const getHeroByCoords = (x, y) => {
  const heroes = [...state.attacker.pack, ...state.defender.pack];

  return heroes.find(hero => {
    const left = getStatusLeft(hero);
    const right = left + heroStatusWidth;

    return x >= left && x <= right && !!hero.health
  });
};

const handleClick = (event) => {
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;

  const scale = canvas.offsetWidth / 300;
  
  const x = (event.clientX - canvasLeft) / scale;
  const y = (event.clientY - canvasTop) / scale;
  
  const hero = getHeroByCoords(x, y);
  if (hero && hero.ultimate === 100) {
    state.heroForUltimate = hero;
  }
};

export default {
  init,
  run,
  showHeroState,
};