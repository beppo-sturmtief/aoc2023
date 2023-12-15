const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/13/input')).text())
  : `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`)
  .trim().split('\n\n');

const patterns = input.map(p => p.split('\n'));

const mirrored = patterns.map(p => ({
    horizontal: p.map((_,i)=>i)
        .slice(0,-1)
        .filter(i => p[i]==p[i+1])
        .map(i=> ({pos:i, width: Math.min(i+1,p.length-i-1)}))
        .filter(({pos,width}) => [...Array(width).keys()].every(off=>p[pos-off]==p[pos+off+1])),
    vertical: p.map(r => [...Array(r.length-1).keys()].filter(pos => r.charCodeAt(pos)==r.charCodeAt(pos+1)))
        .reduce((isec,cur)=>isec.filter(i=>cur.includes(i)))
        .map(i=> ({pos:i, width: Math.min(i+1,p[0].length-i-1)}))
        .filter(({pos,width})=>p.every(r=>[...Array(width).keys()].every(off=>r.charCodeAt(pos-off)==r.charCodeAt(pos+off+1))))
}));
const solutionPart1 = mirrored.reduce((sum,mir)=>sum + (mir.vertical.length==0?0:(mir.vertical[0].pos+1)) + 100 * (mir.horizontal.length==0?0:(mir.horizontal[0].pos+1)),0);
