import { log, wait } from '../common.js';
import { heroStates } from './constants.js';
import state from './state.js';
import { isPackEmpty, getHeroDirection } from './utils.js';
import view from './view.js';
import { heroes } from '../heroes.js';


const ultimate = async () => {
  const { heroForUltimate } = state;
  let attacker, defender;

  if (heroForUltimate) {
    if (getHeroDirection(heroForUltimate) === 'attacker') {
      attacker = state.attacker;
      defender = state.defender;
    } else {
      attacker = state.defender;
      defender = state.attacker;
    }

    if (heroForUltimate.id === 'knight') {
      await attack(heroForUltimate, defender.pack);
    }

    if (heroForUltimate.id === 'mage') {
      await freeze(heroForUltimate, defender.pack);
    }

    if (heroForUltimate.id === 'rogue') {
      await heal(heroForUltimate, attacker.pack);
    }

    heroForUltimate.ultimate = 0;
    state.heroForUltimate = null;
  } else {
    await wait(0.3);
  }
};

const attack = async (hero, defenderPack) => {
  if (state.heroForUltimate === hero) {
    state.setHeroState(hero, heroStates.ultimate);
  } else {
    state.setHeroState(hero, heroStates.attack);
  }

  await view.showHeroState(hero);

  const attackHero = async (heroForDefend) => {
    const power = state.heroForUltimate ?
      hero.power / 2 :
      hero.power;

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

  await Promise.all(defenderPack.map(attackHero));

  state.setHeroState(hero, heroStates.idle);
};

const freeze = async (hero, defenderPack) => {
  state.setHeroState(hero, heroStates.ultimate);

  await view.showHeroState(hero);

  const freezeHero = heroForFreeze => {
    heroForFreeze.freeze = true;

    setTimeout(() => heroForFreeze.freeze = false, 5000)
  };

  defenderPack.map(freezeHero);

  state.setHeroState(hero, heroStates.idle);
};

const heal = async (hero, pack) => {
  state.setHeroState(hero, heroStates.ultimate);

  await view.showHeroState(hero);

  const healHero = heroForHeal => {
    const maxHeroHealth = heroes[heroForHeal.id].params.health;

    heroForHeal.health = Math.min(heroForHeal.health + maxHeroHealth / 3, maxHeroHealth);
  };

  pack.map(healHero);

  state.setHeroState(hero, heroStates.idle);
};

const nextTurn = async () => {
  const attacker = state.getCurrentAttacker();
  const defender = state.getCurrentDefender();

  const heroForAttack = state.getHeroForAttack();
  const heroForDefend = state.getHeroForDefend();

  if (!heroForAttack.freeze) {
    await attack(heroForAttack, [heroForDefend]);

    await ultimate();
  }

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