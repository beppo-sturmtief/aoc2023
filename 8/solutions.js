const input = (await (await fetch('https://adventofcode.com/2023/day/8/input')).text())
  /*`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`*/
  .trim().split('\n\n');
const instructions = input[0].split('').map(c => c=='L' ? 0 : 1);
const map = input[1].split('\n').map(l => l.split(/[^0-9A-Z]+/)).reduce((map,entry)=>Object.assign(map,{[entry[0]]: entry.slice(1,3)}), {});
let solutionPart1 = 0;
let current = 'AAA';
while (current != 'ZZZ') {
  current = map[current][instructions[solutionPart1 % instructions.length]];
  solutionPart1++;
}

let solutionPart2 = 0;
/* // simple approach takes to long
let currents = Object.keys(map).filter(k => k.charAt(2) == 'A');
while (currents.some(pos => pos.charAt(2) != 'Z') {
  currents = currents.map(current => map[current][instructions[solutionPart2 % instructions.length]]);
  solutionPart2++;
}*/

const positions = Object.keys(map); 
const mapArray = positions.map(p => [positions.indexOf(map[p][0]), positions.indexOf(map[p][1])]);
const isPotentialEnd = positions.map(p => p.charAt(2)=='Z');

let currents = positions.flatMap((k,i) => k.charAt(2) == 'A' ? [i] : []);
/* // its not just slow string handling but algorithmically to hard
while (currents.some(pos => !isPotentialEnd[pos])) {
  currents = currents.map(current => mapArray[current][instructions[solutionPart2 % instructions.length]]);
  solutionPart2++;
}*/
const stats = positions.map((pos, iPos) => instructions
  .reduce(({fullCycleMapsTo, potentialFinishAfter}, inst, i) => ({
                    fullCycleMapsTo: mapArray[fullCycleMapsTo][inst], 
                    potentialFinishAfter: isPotentialEnd[mapArray[fullCycleMapsTo][inst]] ? [...potentialFinishAfter, i+1] : potentialFinishAfter
                  }), {fullCycleMapsTo: iPos, potentialFinishAfter: []})
);
const hitOrFullCylce = start => start.reduce((hits, pos) => hits.filter(h => stats[pos].potentialFinishAfter.indexOf(h)>-1), stats[start[0]].potentialFinishAfter)[0] || false;

while (solutionPart2 % instructions.length == 0) {
  const wasHitAt = hitOrFullCylce(currents);
  if (wasHitAt === false) {
    solutionPart2 += instructions.length;
    currents = currents.map(c => stats[c].fullCycleMapsTo);
  } else {
    solutionPart2 += wasHitAt;
    break;
  }
}

// this solution actually works - result 24035773251517 - but took a very, very, very long time to compute
