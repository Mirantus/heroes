import { heroStates } from './constants.js';
import { heroes } from '../heroes.js';

export const countFrames = hero => getHeroImages(hero)[hero.state].length;

export const getHeroDirection = hero => hero.flip ? 'defender' : 'attacker';

export const getHeroImages = hero => heroes[hero.id].images;

export const isHeroAlive = hero => hero && hero.state !== heroStates.dead;

export const isPackEmpty = pack => !pack.some(isHeroAlive);

export const sortPackForRender = (pack) => {
  const sorted = [...pack].reverse();
  const currentHeroIndex = sorted.findIndex(hero => [heroStates.attack, heroStates.ultimate].includes(hero.state));

  if (currentHeroIndex > -1) {
    const [currentHero] = sorted.splice(currentHeroIndex, 1);
    sorted.push(currentHero);
  }

  return sorted;
}