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

const stringDiffs = (a,b) => [...Array(a.length).keys()].filter(i=>a.charCodeAt(i)!=b.charCodeAt(i));

 // for each pair of consecutive lines in the pattern, find which positions would need to be fixed to make them the center of a mirrored range
const linesWithOneSmudgeFix = pattern => pattern
  .map((_,i)=>i) // one index per row in this pattern
  .slice(0,-1) // remove last line as it cannot be first in a pair of rows
  .map(i=> ({pos:i, width: Math.min(i+1,pattern.length-i-1)})) // for each row left: its row number and the size of a possible mirrored range centered between lines pos and pos+1
  .map(({pos,width})=>({
    pos,
    width,
    stringDiffs: [...Array(width).keys()]
      .map(i=>stringDiffs(pattern[pos-i],pattern[pos+1+i])) // for each pair of lines (original + mirrored), add the count positions needing fixing to make them mirrored
  })).filter(({stringDiffs})=>stringDiffs.reduce((count,diff)=>count + diff.length, 0)==1) // exclude all candidates which need other than exactly one smudge fixed to be mirrored;

const horizontalLinesWithOneSmudgeFix = patterns
  .map(linesWithOneSmudgeFix)
  .filter(smudges=>smudges.length==1) // exclude all patterns that either cannot be made mirroring by fixing exactly one smudge or that have more than one possibility to do this
  .reduce((sum,smudge)=>sum + smudge[0].pos+1,0);

// create a copy of each pattern rotated by 90° (rows => columns)
const rotated = patterns.map(p => p.reduce((rotated, row) => rotated.map((rr,i) => rr+row.charAt(i)), p[0].split('').map(col=>'')));

const verticalLinesWithOneSmudgeFix = rotated // horizontal mirrored ranges on a rotated pattern accords to a vertical mirrored range in the original
  .map(linesWithOneSmudgeFix)
  .filter(smudges=>smudges.length==1) // exclude all patterns that either cannot be made mirroring by fixing exactly one smudge or that have more than one possibility to do this
  .reduce((sum,smudge)=>sum + smudge[0].pos+1,0);

const solutionsPart2 = 100 * horizontalLinesWithOneSmudgeFix + verticalLinesWithOneSmudgeFix;
