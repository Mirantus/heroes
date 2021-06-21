import { log } from './common.js';
import fight from './fight/index.js';
import { heroes } from './heroes.js';

const { knight, mage } = heroes;

const gamers = [
  {
    pack: [
      { ...knight.params },
      { ...mage.params },
      { ...knight.params },
      { ...mage.params },
    ],
    user: "User 1"
  }, {
    pack: [
      { ...mage.params },
      { ...knight.params },
      { ...mage.params },
      { ...knight.params },

    ],
    user: "User 2"
  }
];

fight(gamers[0], gamers[1])
  .then(winner => log(winner.user + " win"));