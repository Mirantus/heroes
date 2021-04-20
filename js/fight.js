import { log, wait } from './common.js';

//const ATTACKER = 'attacker';
//const DEFENDER = 'defender';

const state = {
  attacker: null,
  defender: null,
  current: null,
};

const isHeroAlive = hero => hero && !hero.dead;

const isPackEmpty = pack => !pack.some(isHeroAlive);

const increaseIndex = index => index === 4 ? 0 : index + 1;

const getNextHeroIndex = (pack, heroIndex) => {
  if (isPackEmpty(pack)) return null;

  let nextIndex = increaseIndex(heroIndex);

  if (isHeroAlive(pack[nextIndex])) {
    return nextIndex;
  };

  return getNextHeroIndex(pack, nextIndex);
};

const hit = (hero, enemyPack) => {
  const index = enemyPack.findIndex(isHeroAlive);
  enemyPack.defendHero = index;
  const enemyHero = enemyPack[index];

  showScene();

  const diff = enemyHero.power - hero.power;

  if (diff > 0) {
    enemyHero.power = diff;
  } else {
    enemyHero.power = 0;
    enemyHero.dead = true;
  }
};

const nextTurn = async () => {
  const attacker = state.current === state.attacker ? state.attacker : state.defender;
  const defender = state.current === state.attacker ? state.defender : state.attacker;

  await showScene();

  if (!isHeroAlive(attacker.pack[attacker.currentHero])) {
    attacker.currentHero = getNextHeroIndex(attacker.pack, attacker.currentHero);
  }

  hit(attacker.pack[attacker.currentHero], defender.pack);

  if (isPackEmpty(attacker.pack)) {
    return defender;
  }

  if (isPackEmpty(defender.pack)) {
    return attacker;
  }

  attacker.currentHero = getNextHeroIndex(attacker.pack, attacker.currentHero);

  state.current = state.current === attacker ? defender : attacker;

  return nextTurn();
};

const renderPack = (pack, currentHero) => {
  const renderHero = (hero, index) => {
    if (state.current.pack === pack && currentHero === index) {
      return '<big>' + hero.power + '</big>';
    }
    if (state.current.pack !== pack && currentHero === index) {
      return '<i>' + hero.power + '</i>';
    }
    return hero.power;
  };

  let heroes = pack.map(renderHero);

  if (state.attacker.pack === pack) {
    heroes = heroes.slice().reverse();
  }

  return heroes.join('');
};

const showScene = async () => {
  document.getElementById('attacker').innerHTML = renderPack(state.attacker.pack, state.attacker.currentHero, state.attacker.defendHero);

  document.getElementById('defender').innerHTML = renderPack(state.defender.pack, state.defender.currentHero, state.defender.defendHero);

  await wait(1);
};

const fight = async (attacker, defender) => {
  state.attacker = attacker;
  state.defender = defender;
  state.current = attacker;

  attacker.currentHero = defender.currentHero = 0;

  return nextTurn();
};

export default fight;