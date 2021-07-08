import { heroStates } from './constants.js';
import { isHeroAlive, isPackEmpty } from './utils.js';

const state = {
  attacker: null,
  defender: null,
  current: null,
  init(attacker, defender) {
    const initHero = hero => {
      this.setHeroState(hero, heroStates.idle);
      hero.ultimate = 0;
    }

    attacker.pack.forEach(initHero);
    defender.pack.forEach(initHero);

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
  setHeroState(hero, state) {
    hero.state = state;
    hero.frame = 0;
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
  getNextHero(gamer, hero) {
    if (isPackEmpty(gamer.pack)) return null;

    const heroIndex = gamer.pack.findIndex(packHero => packHero === hero);

    const nextIndex = heroIndex === gamer.pack.length ? 0 : heroIndex + 1;

    const nextHero = gamer.pack[nextIndex];

    if (isHeroAlive(nextHero)) {
      return nextHero;
    };

    return this.getNextHero(gamer, nextHero);
  },
  updateUltimate() {
    const updateHeroUltimate = hero => {
      const newUltimate = hero.ultimate + hero.ultimateSpeed;
      
      hero.ultimate = Math.min(newUltimate, 100);
    };
    
    this.attacker.pack.forEach(updateHeroUltimate);
    this.defender.pack.forEach(updateHeroUltimate);
  },
};

export default state;