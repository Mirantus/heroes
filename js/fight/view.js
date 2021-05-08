import { size, padding, heroStates } from './constants.js';

let canvas, ctx, state;
const width = size + padding;

const renderHero = (hero) => {
  if (hero.state === heroStates.dead) {
    return;
  }

  const top = 10;
  const textSize = 10;
  const textLeft = hero.x + size / 2;
  const textTop = top + 15;

  ctx.strokeStyle = "black";

  if (hero.state === heroStates.attack) {
    ctx.strokeStyle = "green";
  }
  if (hero.state === heroStates.hurt) {
    ctx.strokeStyle = "red";
  }

  ctx.strokeRect(hero.x, top, size, size);

  ctx.font = textSize + 'px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(hero.power, textLeft, textTop);
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.attacker.pack.forEach(renderHero);
  state.defender.pack.forEach(renderHero);

  requestAnimationFrame(render);
};

const init = (initState) => {
    state = initState;
    canvas = document.getElementById("arena");
    ctx = canvas.getContext("2d");
    
    const attackerPack = state.attacker.pack.map((hero, index) => ({ ...hero, x: (4 - index) * width }));

  const defenderPack = state.defender.pack.map((hero, index) => ({ ...hero, x: canvas.width - (5 - index) * width + padding }));

  state.setPack(state.attacker, attackerPack);
  state.setPack(state.defender, defenderPack);
};

const run = () => {
    requestAnimationFrame(render);
};

export default {
  init, run
};
