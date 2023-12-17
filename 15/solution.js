const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/15/input')).text())
  : `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`)
  .trim();

const hash = s => s.split('').map(c=>c.charCodeAt(0)).reduce((hash,cc) => (17*(hash+cc)) % 256, 0);
const data = input.split(',');
const solutionPart1 = data.map(hash).reduce((a,b)=>a+b, 0);

const commands = data.map(cmd => cmd.match(/(.+)([=-])(.*)/)).map(([,label,op,len]) => ({label, op, len: parseInt(len||'0'), box: hash(label)}));
const boxes = [...Array(256).keys()].map(a=>[]);
commands.forEach(({label,op,len,box}) => {
    const pos = boxes[box].findIndex((box) => box.label == label);
    if (op == '=') {
        if (pos > -1) boxes[box][pos].len = len;
        else boxes[box].push({label,len});
    } else if (pos > -1) boxes[box].splice(pos,1);
});
const solutionPart2 = boxes.map((box,idx) => box.reduce((sum, {len}, i) => sum + (idx+1) * (i + 1) * len, 0)).reduce((a,b)=>a+b, 0);
