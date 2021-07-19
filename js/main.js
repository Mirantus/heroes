import { log } from './common.js';
import fight from './fight/index.js';
import { heroes } from './heroes.js';

const { knight, mage, rogue } = heroes;

const gamers = [
  {
    pack: [
      { ...knight.params },
      { ...mage.params },
      { ...mage.params },
      { ...rogue.params },
      { ...rogue.params },
    ],
    user: "User 1"
  }, {
    pack: [
      { ...knight.params },
      { ...mage.params },
      { ...mage.params },
      { ...rogue.params },
      { ...rogue.params },

    ],
    user: "User 2"
  }
];

fight(gamers[0], gamers[1])
  .then(winner => log(winner.user + " win"));