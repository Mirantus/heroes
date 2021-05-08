import {log} from './common.js';
import fight from './fight/index.js';

const gamers = [
  {
    pack: [
      { power: 5 },
      { power: 4 },
      { power: 3 },
      { power: 2 },
      { power: 1 },
    ],
    user: "User 1"
  },
  {
    pack: [
      { power: 1 },
      { power: 2 },
      { power: 3 },
      { power: 4 },
      { power: 5 },
      ],
    user: "User 2"
  }
];

fight(gamers[0], gamers[1])
.then(winner => log(winner.user + " win"));
