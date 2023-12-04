const sum = (a,b) => a+b;

const input = (await (await fetch('https://adventofcode.com/2023/day/4/input')).text()).trim().split('\n');

const details = input
  .map(l => l
    .split(': ')[1].trim()
    .split(' | ').map(s => s
      .trim().split(/\s+/)
      .map(int => parseInt(int)))) 
  .map(([win, have], idx) => {
    const won = win.filter(w => have.indexOf(w) >= 0);
    const bonus = won.map((x,i) => i + 1 + idx).filter(i => i<input.length);
    return {win, have, won, bonus};
  });

const solutionPart1 = details.map(d => d.won.length == 0 ? 0 : Math.pow(2, d.won.length-1)).reduce(sum,0);

for (let i = details.length-1; i >= 0; i--)
  details[i].cards = 1 + details[i].bonus.map(ii => details[ii].cards).reduce(sum,0);

const solutionPart2 = details.map(d=>d.cards).reduce(sum,0);
