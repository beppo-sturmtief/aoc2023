const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/20/input')).text())
  : false ?
`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a` :
`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`)
  .trim().split('\n');

const BC = 0;
const FF = 1;
const ccFF = '%'.charCodeAt(0);
const CJ = 2;

const moduleList = [...new Set(['button', ...input.flatMap(r=>r.replaceAll(/[%&]/g,'').split(/ -> |, /))])];

const moduleMap = input.reduce((_mods,line) => {
    if (line.indexOf('broadcaster')==0)
        return {..._mods, broadcaster: {id:'broadcaster', type: BC, ins: [moduleList.indexOf('button')], outs: line.split(/ -> |, /).slice(1).map(id=>moduleList.indexOf(id))}};
    const type = line.charCodeAt(0) == ccFF ? FF : CJ;
    const mods = structuredClone(_mods);
    const [id, ...outs] = line.substr(1).split(/ -> |, /);
    const idx = moduleList.indexOf(id);
    mods[id] = {id, type, ins: mods[id] ? mods[id].ins : [], outs: outs.map(o=>moduleList.indexOf(o))};
    outs.forEach(o=>mods[o] = {id: o, outs:[], ...mods[o], ins : mods[o] ? [...mods[o].ins, idx]: [idx]});
    return mods;
},{button:{id:'button', type: BC, ins:[], outs:[moduleList.indexOf('broadcaster')]}});

const fullModuleList = moduleList.map(m=>moduleMap[m]);

let lowCount = 0;
let hiCount = 0;
const state = moduleList.map(_=>false);

const toProcess = [{high:false, to: moduleList.indexOf('broadcaster')}];
lowCount++;
state[moduleList.indexOf('button')] = false;

let rounds = 1;

let solutionPart1 = false;
let solutionPart2 = false;

while (toProcess.length > 0) {
    const {high, to} = toProcess.shift();
    const mod = fullModuleList[to];
    if (mod.id=='rx' && !high) {
        solutionPart2 = rounds;
        if (solutionsPart1)
            break;
    }
    if (mod.type == BC) {
        if (high) hiCount += mod.outs.length;
        else lowCount += mod.outs.length;
        toProcess.push(...mod.outs.map(next=>({high, to:next})));
        state[to] = high;
    } else if (mod.type == FF && !high) {
        state[to] = !state[to];
        if (state[to]) hiCount += mod.outs.length;
        else lowCount += mod.outs.length;
        toProcess.push(...mod.outs.map(next=>({high:state[to], to:next})));
    } else if (mod.type == CJ) {
        state[to] = mod.ins.map(i=>state[i]).some(s=>!s);
        if (state[to]) hiCount += mod.outs.length;
        else lowCount += mod.outs.length;
        toProcess.push(...mod.outs.map(next=>({high:state[to], to:next})));
    }

    if (toProcess.length == 0) {
        if (rounds == 1000)
            solutionPart1 = hiCount * lowCount;
        toProcess.push({high:false, to: moduleList.indexOf('broadcaster')});
        lowCount++;
        rounds++;
    }
}
