const input = (await (await fetch('https://adventofcode.com/2023/day/9/input')).text()).trim().split('\n');
const rows = input.map(r => r.split(' ').map(n => parseInt(n)));
const diff = arr => arr.slice(0, arr.length -1).map((n,i) => arr[i+1] - n);

const extrapolated = rows.map(row => {
    let step = row;
    const lastElements = [];
    const firstElements = [];
    while (step.some(n=>n!=0)) {
        lastElements.push(step[step.length-1]);
        firstElements.push(step[0]);
        step = diff(step);
    }
    return {
      future: lastElements.toReversed().reduce((a,b)=>a+b),
      past: firstElements.toReversed().reduce((a,b)=>b-a)
    };
});

const solutionPart1 = extrapolated.map(e=>e.future).reduce((a,b)=>a+b);
const solutionPart2 = extrapolated.map(e=>e.past).reduce((a,b)=>a+b);
