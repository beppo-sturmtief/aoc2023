// pressing * (time - pressing) > distance
// round up p from t*p - p^2 = d
// => p^2 - t*p + d = 0
// p = t/2 +- sqrt(t^2 / 4 - d)

// t=7 d=9 => 3.5 +- sqrt(49/4 - 9) = 3.5 +- sqrt(13/4) = 3.5 +- sqrt(13)/2 = 3.5 +- 1.8 => 1.7 < p < 5.3



const input = (await (await fetch('https://adventofcode.com/2023/day/6/input')).text()).trim().split('\n');

const times = input[0].split(/\s+/).slice(1).map(s=>parseInt(s));
const distances = input[1].split(/\s+/).slice(1).map(s=>parseInt(s));

const solutions = distances.map((d,i) => {
  const t = times[i];
  const minP = Math.floor(1.0 + t/2.0 - Math.sqrt(t*t/4.0 - d));
  const maxP = Math.ceil(-1.0 + t/2.0 + Math.sqrt(t*t/4.0 - d));
  return {minP, maxP, numP: maxP-minP+1};
});

const solutionPart1 = solutions.map(s=>s.numP).reduce((a,b)=>a*b, 1);

const t = parseInt(input[0].split(/\s+/).slice(1).join(''));
const d = parseInt(input[1].split(/\s+/).slice(1).join(''));

const minP = Math.floor(1.0 + t/2.0 - Math.sqrt(t*t/4.0 - d));
const maxP = Math.ceil(-1.0 + t/2.0  +Math.sqrt(t*t/4.0 - d));

const solutionPart2 = maxP-minP+1;