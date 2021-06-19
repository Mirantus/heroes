import { heroStates } from './constants.js';
import { isHeroAlive, isPackEmpty } from './utils.js';

const state = {
  attacker: null,
  defender: null,
  current: null,
  init(attacker, defender) {
    const setStateIdle = hero => this.setHeroState(hero, heroStates.idle);
    
    attacker.pack.forEach(setStateIdle);
    defender.pack.forEach(setStateIdle);

    this.attacker = {
      ...attacker,
      currentHero: 0
    };
    
    this.defender = {
      ...defender,
      currentHero: 0
    };

    this.current = this.attacker;
  },
  getCurrentAttacker() {
    return this.current === this.attacker ? this.attacker : this.defender;
  },
  getCurrentDefender() {
    return this.current === this.attacker ? this.defender : this.attacker;
  },
  setPack(gamer, pack) {
    gamer.pack = pack;
  },
  getHeroForAttack() {
    const attacker = this.getCurrentAttacker();

    if (!isHeroAlive(attacker.currentHero)) {
      attacker.currentHero = this.getNextHero(attacker, attacker.currentHero);
    }

    return attacker.currentHero;
  },
  getHeroForDefend() {
    return this.getCurrentDefender().pack.find(isHeroAlive);
  },
  hit(hero, enemyHero) {
    const diff = enemyHero.health - hero.power;

    if (diff > 0) {
      enemyHero.health = diff;
    } else {
      enemyHero.health = 0;
      enemyHero.state = heroStates.dead;
    }
  },
  setHeroState(hero, state) {
    if (hero.state !== heroStates.dead) {
      hero.state = state;
      hero.frame = 0;
    }
  },
  setHeroPosition(hero, position) {
    hero.x = position;
  },
  changeCurrentHero(gamer) {
    gamer.currentHero = this.getNextHero(gamer, gamer.currentHero);
  },
  changeCurrentGamer() {
    this.current = this.current === this.attacker ? this.defender : this.attacker;

  },
  increaseIndex(index) { return index === 4 ? 0 : index + 1; },

  getNextHero(gamer, hero) {
    if (isPackEmpty(gamer.pack)) return null;

    const heroIndex = gamer.pack.findIndex(packHero => packHero === hero);

    const nextIndex = this.increaseIndex(heroIndex);

    const nextHero = gamer.pack[nextIndex];

    if (isHeroAlive(nextHero)) {
      return nextHero;
    };

    return this.getNextHero(gamer, nextHero);
  },
};

export default state;