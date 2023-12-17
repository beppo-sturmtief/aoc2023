const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/14/input')).text())
  : `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`)
  .trim().split('\n');

const ccRound = 'O'.charCodeAt(0);
const ccCube = '#'.charCodeAt(0);
const grid = input.map(r=>r.split('').map(c=>c.charCodeAt()));
const height = grid.length;

const roundedAtNorth = grid
  .reduce(
    (rounded,row,iRow) => rounded
      .map(([{cube,rounds}, ...prev], i) => row[i]==ccRound
        ? [{cube, rounds:rounds+1}, ...prev] 
        : row[i]==ccCube
          ? [{cube: iRow, rounds: 0}, {cube,rounds}, ...prev] 
          : [{cube,rounds}, ...prev]
       ),
    grid[0].map(_=>([{cube:-1,rounds:0}])));
const solutionPart1 = roundedAtNorth.flatMap(a=>a)
  // each range of "rounds" round stones beginning above the cube at cube is worth the sum of all ints from 1 to height - cube + 1
  // minus the sum of all ints south of the block, meaning from 1 to height - cube + 1 - rounds
  // the sum of all ints from 1 to n is n(n+1)/2
  // this leads to the value of each block being (h-c+1)(h-c+1+1)/2 - (h-c+1-r)(h-c+1-r+1)/2 => r(2h-2c-r-1)/2
  .map(({cube,rounds}) => rounds * (2*height - 2*cube - rounds - 1) / 2)
  .reduce((a,b)=>a+b, 0);
