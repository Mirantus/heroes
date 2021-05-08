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
  await wait(1);
  state.setHeroState(heroForDefend, heroStates.hurt);
  await wait(1);

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
  view.init(state);
  view.run(state);

  return nextTurn();
};

export default fight;