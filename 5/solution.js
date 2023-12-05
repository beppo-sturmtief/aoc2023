const input = (await (await fetch('https://adventofcode.com/2023/day/5/input')).text()).trim().split('\n\n');
const seeds = input[0].split(' ').slice(1).map(s=>parseInt(s));
const maps = input.slice(1).map(blk => {
    const lines = blk.split('\n');
    const [from, to] = lines[0].split(' ')[0].split('-to-');
    const ranges = lines.slice(1).map(l => {const [dst,src,len] = l.split(' ').map(i=>parseInt(i)); return {src, dst, len};}).sort((a,b)=>a.src-b.src);
    return {from, to, ranges};
});
const seedLocations = seeds.map(s => maps.reduce((i,map) => map.ranges.filter(r => i >= r.src && i < r.src + r.len).map(r => r.dst - r.src + i)[0] || i, s));
const solutionPart1 = Math.min(...seedLocations);
/* // explodes:
const seedsFromRanges = seeds.filter((s,i)=>i%2).map((len,i) => [seeds[2*i],len]).map(([s,len]) => Array(len).map((x,i)=>s+i));
const solutionPart2 = Math.min(...seedsFromRanges.map(seeds => Math.min(...seeds.map(s => maps.reduce((i,map) => map.ranges.filter(r => i >= r.src && i < r.src + r.len).map(r => r.dst - r.src + i)[0] || i, s)))));
*/
const seedRanges = seeds.filter((s,i)=>i%2).map((len,i) => ({start: seeds[2*i],len}));
let ranges = seedRanges;
for (let map of maps)
     ranges = ranges.flatMap(range => {
       const maped = [];
       let pos = range.start;
       let len = range.len;
       while (len > 0) {
         const hit = map.ranges.find(r => r.src + r.len > pos);
         if (!hit || hit.src >= pos+len) {
           maped.push({start:pos,len});
           pos += len; len = 0;
         } else if (hit.src > pos) {
           let step = hit.src-pos;
           maped.push({start:pos,len:step});
           pos += step; len -= step;
           step = Math.min(len, hit.len);
           maped.push({start:hit.dst,len: step});
           pos += step; len -= step;
         } else {
           const step = Math.min(len, hit.len - (pos - hit.src));
           maped.push({start:hit.dst + (pos - hit.src),len: step});
           pos += step; len -= step;
         }
       }
       return maped;
     });
const solutionPart2 = Math.min(...ranges.map(r => r.start));
