const input = (true 
  ? (await (await fetch('https://adventofcode.com/2023/day/10/input')).text())
  : `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`
  ).trim().split('\n');

const grid = input.map(r => r.split(''));
const w = grid[0].length;
const h = grid.length;
const start = grid.map((r,y) => ({x: r.findIndex(c => c == 'S'), y})).find(({x,y}) => x>-1);

const firstNeighbours = [
  {dir: {x:0,y:-1}, cons: '|7F'},
  {dir: {x:-1,y:0}, cons: '-FL'},
  {dir: {x:1,y:0}, cons: '-7J'},
  {dir: {x:0,y:1}, cons: '|JL'}
  ].filter(({dir}) => dir.x + start.x >= 0 && dir.x + start.x < w && dir.y + start.y >= 0 && dir.y + start.y < h)
  .filter(({dir, cons}) => cons.includes(grid[start.y + dir.y][start.x + dir.x]))
  .map(({dir}) => ({dir, x: start.x + dir.x, y: start.y + dir.y}));

const moves = {
  '|': [{x:0,y:-1},{x:0,y:1}],
  '-': [{x:-1,y:0},{x:1,y:0}],
  'L': [{x:0,y:-1},{x:1,y:0}],
  'J': [{x:0,y:-1},{x:-1,y:0}],
  '7': [{x:0,y:1},{x:-1,y:0}],
  'F': [{x:0,y:1},{x:1,y:0}]
};

const nextStep = (prevStep) => {
  const dir = moves[grid[prevStep.y][prevStep.x]].find(({x,y}) => x != -prevStep.dir.x || y != -prevStep.dir.y);
  return { dir, x: prevStep.x + dir.x, y: prevStep.y + dir.y};
};

const loopOnly = grid.map(r => r.map(c => '.'));
loopOnly[start.y][start.x] = 'S';
let step = firstNeighbours.map(({dir,x,y}) => ({dir, x, y}));
let solutionPart1 = 1;
while (step[0].x != step[1].x || step[0].y != step[1].y) {
  loopOnly[step[0].y][step[0].x] = grid[step[0].y][step[0].x];
  loopOnly[step[1].y][step[1].x] = grid[step[1].y][step[1].x];
  step = [nextStep(step[0]), nextStep(step[1])];
  solutionPart1++;
}

// Part 1 solved

const north = step => step.dir.y < 0;
const south = step => step.dir.y > 0;
const east = step => step.dir.x > 0;
const west = step => step.dir.x < 0;

step = firstNeighbours[0];
while (step.x != start.x || step.y != start.y) {
  const pX = step.x - step.dir.x;
  const pY = step.y - step.dir.y
  const prev = loopOnly[pY][pX];
  if (loopOnly[pY][pX-1] == '.')
    loopOnly[pY][pX-1] = ((east(step) && prev == 'F') || north(step)) ?'l':'r';
  if (loopOnly[pY][pX+1] == '.')
    loopOnly[pY][pX+1] = ((west(step) && prev == '7') || north(step)) ?'r':'l';
  if (loopOnly[pY-1] && loopOnly[pY-1][pX] == '.')
    loopOnly[pY-1][pX] = ((south(step) && prev == '7') || east(step)) ?'l':'r';
  if (loopOnly[pY+1] && loopOnly[pY+1][pX] == '.')
    loopOnly[pY+1][pX] = ((north(step) && prev == 'J') || east(step)) ?'r':'l';
  step = nextStep(step);
}

while (loopOnly.some(r=>r.includes('.'))) {
  anyChanged = false;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = loopOnly[y][x];
      if (c == 'l' || c == 'r') {
        if (y>0) {
          if (x>0 && loopOnly[y-1][x-1] == '.') loopOnly[y-1][x-1] = c;
          if (loopOnly[y-1][x] == '.') loopOnly[y-1][x] = c;
          if (x+1<w && loopOnly[y-1][x+1] == '.') loopOnly[y-1][x+1] = c;
        }
        if (x>0 && loopOnly[y][x-1] == '.') loopOnly[y][x-1] = c;
        if (x+1<w && loopOnly[y][x+1] == '.') loopOnly[y][x+1] = c;
        if (y+1<h) {
          if (x>0 && loopOnly[y+1][x-1] == '.') loopOnly[y+1][x-1] = c;
          if (loopOnly[y+1][x] == '.') loopOnly[y+1][x] = c;
          if (x+1<w && loopOnly[y+1][x+1] == '.') loopOnly[y+1][x+1] = c;
        }
      }
    }
}

const boundary = [...loopOnly[0], ...loopOnly[h-1], ...loopOnly.map(a=>a[0]), ...loopOnly.map(a=>a[w-1])] ;
const boundaryContainsR = boundary.includes('r');
const boundaryContainsL = boundary.includes('l');

if (boundaryContainsR == boundaryContainsL)
  throw "Cannot determine inner vs outer"
const inner = boundaryContainsR ? 'l' : 'r';
const solutionPart2 = loopOnly.map(r=>r.map(c=>c==inner?1:0).reduce((a,b)=>a+b)).reduce((a,b)=>a+b);
// supposedly not correct...
