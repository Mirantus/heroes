import { log, wait } from '../common.js';
import { heroStates } from './constants.js';
import state from './state.js';
import { isPackEmpty } from './utils.js';
import view from './view.js';

const nextTurn = async () => {
  const attacker = state.getCurrentAttacker();
  const defender = state.getCurrentDefender();

  const heroForAttack = state.getHeroForAttack();
  const heroForDefend = state.getHeroForDefend();

 //attack
  state.setHeroState(heroForAttack, heroStates.attack);
  await view.showHeroState(heroForAttack, heroStates.attack);

  const diff = heroForDefend.health - heroForAttack.power;
  
  if (diff > 0) {
    heroForDefend.health = diff;

    state.setHeroState(heroForDefend, heroStates.hurt);

    await view.showHeroState(heroForDefend, heroStates.hurt);

    state.setHeroState(heroForDefend, heroStates.idle);
  } else {
    heroForDefend.health = 0;
    heroForDefend.state = heroStates.death;

    await view.showHeroState(heroForDefend, heroStates.death);

    state.setHeroState(heroForDefend, heroStates.dead);
  }

  state.setHeroState(heroForAttack, heroStates.idle);

  // check winner
  if (isPackEmpty(defender.pack)) {
    return attacker;
  }

  await wait(0.3);

  state.changeCurrentHero(attacker);
  state.changeCurrentGamer();

  return nextTurn();
};

const fight = async (attacker, defender) => {
  state.init(attacker, defender);
  await view.init(state);
  view.run(state);

  return nextTurn();
};

export default fight;