import { log } from './common.js';
import fight from './fight/index.js';
import { heroes } from './heroes.js';

const { knight } = heroes;

const gamers = [
  {
    pack: [
      { ...knight.params, health: 2 },
      { ...knight.params },
      { ...knight.params,  health: 2 },
    ],
    user: "User 1"
  }, {
    pack: [
      { ...knight.params },
      { ...knight.params,  health: 2 },
      { ...knight.params },
      { ...knight.params,  health: 2 },

    ],
    user: "User 2"
  }
];

fight(gamers[0], gamers[1])
  .then(winner => log(winner.user + " win"));