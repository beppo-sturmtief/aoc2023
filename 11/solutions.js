const input = (true
  ? (await (await fetch('https://adventofcode.com/2023/day/11/input')).text())
  : `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`
  ).trim().split('\n');

const grid = input.map(r => r.split(''));
const w = grid[0].length;
const h = grid.length;

const gX = grid.flatMap(r=>r.flatMap((c,i)=>c=='#'?[i]:[]));
const gY = grid.flatMap((r,i)=>r.flatMap(c=>c=='#'?[i]:[]));

const emptyRows = grid.flatMap((r,i)=>r.includes('#')?[]:[i]);
const emptyCols = grid[0].map((_,i)=>i).filter(x=>!gX.includes(x));

const exX = gX.map(x=>x+emptyCols.filter(e=>e<x).length);
const exY = gY.map(y=>y+emptyRows.filter(e=>e<y).length);

let solutionPart1 = 0;
for (let g1 = 0; g1 < exX.length; g1++)
  for (let g2 = g1+1; g2 < exX.length; g2++)
    solutionPart1 += Math.abs(exX[g1]-exX[g2]) + Math.abs(exY[g1]-exY[g2]);


const uexX = gX.map(x=>x+999999*emptyCols.filter(e=>e<x).length);
const uexY = gY.map(y=>y+999999*emptyRows.filter(e=>e<y).length);

let solutionPart2 = 0;
for (let g1 = 0; g1 < uexX.length; g1++)
  for (let g2 = g1+1; g2 < uexX.length; g2++)
    solutionPart2 += Math.abs(uexX[g1]-uexX[g2]) + Math.abs(uexY[g1]-uexY[g2]);