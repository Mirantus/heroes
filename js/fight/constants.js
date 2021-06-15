export const heroStates = {
  attack: 'attack',
  hurt: 'hurt',
  dead: 'dead'
};

export const top = 0;
export const heroWidth = 128;
export const heroHeight = 128;
export const heroStatusTop = top + heroHeight * 0.9;
export const heroStatusWidth = 10;
export const heroStatusHeight = 5;
export const heroShadowWidth = 20;

export const images = {
  attacker: {
    knight: {
      attack: [
        'attack0.png',
        'attack1.png',
        'attack2.png',
        'attack3.png',
        'attack4.png',
      ],
      hurt: [
        'hurt1.png',
        'hurt2.png',
        'hurt3.png',
        'hurt4.png',
      ],
      default: 'knight.png'
    }
  },
  defender: {
    knight: {
      attack: [
          'attack0.png',
          'attack1.png',
          'attack2.png',
          'attack3.png',
          'attack4.png',
        ],
      hurt: [
          'hurt1.png',
          'hurt2.png',
          'hurt3.png',
          'hurt4.png',
        ],
      default: 'knight.png'
    }
  }
};