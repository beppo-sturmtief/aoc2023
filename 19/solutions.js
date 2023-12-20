const input = (true ? (await (await fetch('https://adventofcode.com/2023/day/19/input')).text())
  : `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`)
  .trim().split('\n\n');

const workflows = input[0].split('\n').map(r => {
    const arr=r.split(/[{}]/);
    return {
        id: arr[0],
        process: eval('({x,m,a,s})=>' + arr[1].replaceAll(':','?"').replaceAll(',','":').replace(/:([a-zA-Z]+)$/,':"$1"')),
        conditions: arr[1].split(',').map(s=>{
            const colon = s.indexOf(':');
            if (colon == -1)
                return {key:'x',less:true,val:4000,next:s};
            else
                return {key: s.charAt(0), less: s.charAt(1)=='<', val:parseInt(s.substring(2,colon)), next: s.substr(colon+1)};
        })
    };
}).reduce((map,entry)=>Object.assign(map,{[entry.id]: entry}),{});
const parts = input[1].replaceAll(/([a-z]+)=/g,'"$1":').split('\n').map(s=>JSON.parse(s));

const processedParts = parts.map(p=> {let flow = 'in'; while (workflows[flow]) flow = workflows[flow].process(p); return {accepted: flow=='A', ...p};});
const solutionPart1 = processedParts.filter(p=>p.accepted).reduce((sum,p) => sum + p.x+p.m+p.a+p.s, 0);

const split = (range,cond) => ((cond.less&&range[cond.key][0]>=cond.val) || (!cond.less&&range[cond.key][1]<=cond.val))
                               ? {done:[],open:range}
                               : ((cond.less&&range[cond.key][1]<=cond.val) || (!cond.less&&range[cond.key][0]>=cond.val))
                                    ? {done:[{...range,next:cond.next}],open:false}
                                    : cond.less
                                        ? {done:[{...range,[cond.key]:[range[cond.key][0],cond.val-1],next:cond.next}], open:{...range,[cond.key]:[cond.val-1,range[cond.key][1]]}}
                                        : {done:[{...range,[cond.key]:[cond.val,range[cond.key][1]],next:cond.next}], open:{...range,[cond.key]:[range[cond.key][0],cond.val,cond.val]}};

let ranges = [{x:[0,4000],m:[0,4000],a:[0,4000],s:[0,4000],next:'in'}];
while (ranges.some(({next})=>next!='A'&&next!='R')) {
    ranges = ranges.flatMap(r =>
        workflows[r.next]
        ? (workflows[r.next].conditions.reduce(({open,done},c) => {
            if (!open) return {open, done};
            const step = split(open,c);
            return {open:step.open,done:[...done,...step.done]}
        } ,{open:r,done:[]}).done)
        : [r]
    );
}

const solutionPart2 = ranges.filter(r => r.next == 'A').map(r => (r.x[1]-r.x[0])*(r.m[1]-r.m[0])*(r.a[1]-r.a[0])*(r.s[1]-r.s[0])).reduce((a,b)=>a+b);
