const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/16/input')).text())
  : `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`)
  .trim().split('\n');
const grid = input.map(r=>r.split('').map(type => ({type, lightFrom:{n:false,e:false,s:false,w:false}})));
const w = grid[0].length;
const h = grid.length;

const typeMap = {
    '.' : {n: ['s'], e:['w'], s:['n'], w:['e']},
    '/' : {n: ['w'], e:['s'], s:['e'], w:['n']},
    '\\' : {n: ['e'], e:['n'], s:['w'], w:['s']},
    '-' : {n: ['e','w'], e:['w'], s:['e','w'], w:['e']},
    '|' : {n: ['s'], e:['n','s'], s:['n'], w:['n','s']},
};
const isInside = ({x,y}) => x>=0 && y>=0 && x<w && y<h;
const xStep = {n:0, e:1, s:0, w:-1};
const yStep = {n:-1, e:0, s:1, w:0};
const outToIn = {n:'s', e:'w', s:'n', w:'e'};
const step = ({x,y,inFrom}, grid) => typeMap[grid[y][x].type][inFrom].map(outTo => ({x: x+xStep[outTo], y: y+yStep[outTo], inFrom: outToIn[outTo]})).filter(isInside).filter(({x,y,inFrom}) => !grid[y][x].lightFrom[inFrom]);

const energizedStartingFrom = (x, y, inFrom, _grid) => {
    const grid = _grid.map(r=>r.map(({type,lightFrom:{n,e,s,w}})=>({type, lightFrom: {n,e,s,w}})));
    const toTrace = [{x,y,inFrom}];    
    while (toTrace.length > 0) {
        let move = toTrace.shift();
        while (move) {
            grid[move.y][move.x].lightFrom[move.inFrom] = true;
            const next = step(move, grid);
            if (next.length>1) toTrace.push(...next.slice(1));
            move = next[0];
        }
    }
    return grid.map(row => row.reduce((sum,c)=>sum + ((c.lightFrom.n||c.lightFrom.e||c.lightFrom.s||c.lightFrom.w) ? 1 : 0), 0)).reduce((a,b)=>a+b, 0);
};
const toTrace = [{x:0,y:0,inFrom:'w'}];
const solutionPart1 = energizedStartingFrom(0, 0, 'w', grid);

const inFromN = grid[0].map((_,i) => energizedStartingFrom(i, 0, 'n', grid));
const inFromE = grid.map((_,i) => energizedStartingFrom(w-1, i, 'e', grid));
const inFromS = grid[0].map((_,i) => energizedStartingFrom(i, h-1, 's', grid));
const inFromW = grid.map((_,i) => energizedStartingFrom(0, i, 'w', grid));
const solutionPart2 = Math.max(inFromN.reduce((max,cur)=>cur>max?cur:max), inFromE.reduce((max,cur)=>cur>max?cur:max), inFromS.reduce((max,cur)=>cur>max?cur:max), inFromW.reduce((max,cur)=>cur>max?cur:max));
