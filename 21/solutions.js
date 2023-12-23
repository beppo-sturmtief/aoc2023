const input = (await (await fetch('https://adventofcode.com/2023/day/21/input')).text()).trim().split('\n');

const grid = input.map((r,y)=>r.split('').map((c,x)=>({x,y,noRock:c!='#',start:c=='S'})));
const nonRocks = grid.flatMap(r=>r.filter(c=>c.noRock));

const start = nonRocks.find(nr=>nr.start);

nonRocks.forEach(nr=>nr[1]=new Set([[0,-1],[1,0],[0,1],[-1,0]].map(([x,y])=>[x+nr.x,y+nr.y]).filter(([x,y])=>grid[y]&&grid[y][x]&&grid[y][x].noRock).map(([x,y])=>grid[y][x])));

const step = (nr,n)=> {
    nr[n] = new Set();
    nr[n>>1]
        .forEach(nnr=>nnr[n>>1]
             .forEach(
                 nnnr=>nr[n].add(nnnr)
             )
        );};
     

for (let n = 2; n <= 32; n <<= 1)
    nonRocks.forEach(nr=>step(nr,n));

step(start, 64);

const solutionPart1 = start[64].size();
console.log(solutionPart1);