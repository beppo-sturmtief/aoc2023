const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/12/input')).text())
  : `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`)
  .trim().split('\n');

const rows = input.map(r => r.split(' ')).map(([mask,broken]) => ({mask:'.'+mask+'.', broken: broken.split(',').map(i=>parseInt(i))}));

const options = rows
        .map(({mask, broken}) => broken
            .map(len => [...mask.matchAll('(?=[?.][?#]{'+len+'}[?.])')].map(match => ({len, idx: match.index})))
            .reduce((agg, cur, i) => i==0 
                ? cur.map(x=>[x]) // start with all options for the first broken-block
                : agg.flatMap(opt=> cur
                                .filter(c => c.idx > (opt[opt.length-1].idx + opt[opt.length-1].len))
                                .map(c=>[...opt, c]))
                     ,[])
        );
const solutionPart1 = options.reduce((sum,opts) => sum + opts.length, 0);
