import { log, wait } from '../common.js';
import { heroStates } from './constants.js';
import state from './state.js';
import view from './view.js';

const nextTurn = async () => {
  const attacker = state.getCurrentAttacker();
  const defender = state.getCurrentDefender();

  const heroForAttack = state.getHeroForAttack();
  const heroForDefend = state.getHeroForDefend();

  state.setHeroState(heroForAttack, heroStates.attack);
  await view.showHeroState(heroForAttack, heroStates.attack);
  
  state.setHeroState(heroForDefend, heroStates.hurt);
  await view.showHeroState(heroForDefend, heroStates.hurt);

  state.hit(heroForAttack, heroForDefend);

  // check winner
  if (state.isPackEmpty(defender.pack)) {
    return attacker;
  }

  state.setHeroState(heroForAttack, null);
  state.setHeroState(heroForDefend, null);

  await wait(1);

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