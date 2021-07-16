import { log, wait } from '../common.js';
import { heroStates } from './constants.js';
import state from './state.js';
import { isPackEmpty, getHeroDirection } from './utils.js';
import view from './view.js';

const ultimate = async () => {
  const { heroForUltimate } = state;

  if (heroForUltimate) {
    const defender = getHeroDirection(heroForUltimate) === 'attacker' ? state.defender : state.attacker;

    await attack(heroForUltimate, defender.pack);

    heroForUltimate.ultimate = 0;
    state.heroForUltimate = null;
  } else {
    await wait(0.3);
  }
};

const attack = async (heroForAttack, heroesForDefend) => {

  if (state.heroForUltimate === heroForAttack) {
    state.setHeroState(heroForAttack, heroStates.ultimate);
  } else {
    state.setHeroState(heroForAttack, heroStates.attack);
  }

  await view.showHeroState(heroForAttack);

  const attackHero = async (heroForDefend) => {
    const power = state.heroForUltimate ?
      heroForAttack.power / 2 :
      heroForAttack.power;

    const diff = heroForDefend.health - power;

    if (diff > 0) {
      heroForDefend.health = diff;

      state.setHeroState(heroForDefend, heroStates.hurt);

      await view.showHeroState(heroForDefend, heroStates.hurt);

      state.setHeroState(heroForDefend, heroStates.idle);
    } else {
      heroForDefend.health = 0;
      heroForDefend.state = heroStates.death;

      await view.showHeroState(heroForDefend);

      state.setHeroState(heroForDefend, heroStates.dead);
    }
  };

  await Promise.all(heroesForDefend.map(attackHero));

  state.setHeroState(heroForAttack, heroStates.idle);
};

const nextTurn = async () => {
  const attacker = state.getCurrentAttacker();
  const defender = state.getCurrentDefender();

  const heroForAttack = state.getHeroForAttack();
  const heroForDefend = state.getHeroForDefend();

  await attack(heroForAttack, [heroForDefend]);

  await ultimate();

  // check winner
  if (isPackEmpty(defender.pack)) {
    return attacker;
  }

  state.changeCurrentHero(attacker);
  state.changeCurrentGamer();

  return nextTurn();
};

const fight = async (attacker, defender) => {
  state.init(attacker, defender);
  await view.init(state);
  view.run(state);

  setInterval(() => state.updateUltimate(), 1000);

  return nextTurn();
};

export default fight;