const input = (await (await fetch('https://adventofcode.com/2023/day/1/input')).text()).trim().split('\n');

const solutionPart1 = input
                .map(l => l
                          .split('')
                          .reduce((s,i) => '0123456789'.indexOf(i) >= 0 ? [s[0]||i, i]: s, [null, null])
                ).map(pair=>parseInt(pair[0]!='0'?pair[0]+pair[1]:pair[1]))
                .reduce((a,b)=>a+b);
/* // does not work because spelled ought digits can overlap
const spelledOut = {'one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9'};
const solutionPart2 = input
                .map(l => l
                          .replaceAll(/(one|two|three|four|five|six|seven|eight|nine)/g, f => spelledOut[f])
                          .split('')
                          .reduce((s,i) => '0123456789'.indexOf(i) >= 0 ? [s[0]||i, i]: s, [null, null])
                ).map(pair=>parseInt(pair[0]!='0'?pair[0]+pair[1]:pair[1]))
                .reduce((a,b)=>a+b);
*/

const spelledOut = {'one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9'};
const solutionPart2 = input
                .map(l => Object.keys(spelledOut).reduce((line,digit) => line.replaceAll(digit, d => d+spelledOut[d]+d), l))
                .map(l => l
                          .split('')
                          .reduce((s,i) => '0123456789'.indexOf(i) >= 0 ? [s[0]||i, i]: s, [null, null])
                ).map(pair=>parseInt(pair[0]!='0'?pair[0]+pair[1]:pair[1]))
                .reduce((a,b)=>a+b);
