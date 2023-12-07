const input = (await (await fetch('https://adventofcode.com/2023/day/7/input')).text()).trim().split('\n');
const cards = 'AKQJT98765432';
const cardsJ = 'AKQT98765432J';
const plays = input.map(l => {
  const [hand, bid] = l.split(' ').map((s,i) => i==0 ? s.split('') : parseInt(s));
  // Part 1
  const values = hand.map(c => cards.indexOf(c));
  const sets = hand.reduce((sets,card) => Object.assign(sets, {[card]: (sets[card]||0) + 1}), {});
  const counts = Object.values(sets);
  const type = 
    counts.length == 5 ? 1
    : counts.length == 4 ? 2
    : counts.length == 3 ? (Math.max(...counts) == 2 ? 3 : 4)
    : counts.length == 2 ? (Math.max(...counts) == 3 ? 5 : 6)
    : 7;

  // Part 2
  const valuesJ = hand.map(c => cardsJ.indexOf(c));
  const highestNonJ = Object.keys(sets).filter(c=>c!='J').sort((a,b) => sets[a]== sets[b] ? cardsJ.indexOf(b) - cardsJ.indexOf(a) : sets[b] - sets[a])[0];
  const setsJ = Object.assign(sets, {[highestNonJ] : sets[highestNonJ] + (sets.J || 0)});
  delete setsJ.J;
  const countsJ = Object.values(setsJ);
  const typeJ = 
    countsJ.length == 5 ? 1
    : countsJ.length == 4 ? 2
    : countsJ.length == 3 ? (Math.max(...countsJ) == 2 ? 3 : 4)
    : countsJ.length == 2 ? (Math.max(...countsJ) == 3 ? 5 : 6)
    : 7;
  
  return {hand, bid, sets, values, type, valuesJ, typeJ};
});

const solutionPart1 = plays
  .sort((a,b) => a.type != b.type ? a.type-b.type : a.values.reduce((res,av,i) => res != 0 ? res : b.values[i] - av, 0))
  .reduce((sum, play, rank) => sum + play.bid * (rank + 1),0);

const solutionPart2 = plays
  .sort((a,b) => a.typeJ != b.typeJ ? a.typeJ-b.typeJ : a.valuesJ.reduce((res,av,i) => res != 0 ? res : b.valuesJ[i] - av, 0))
  .reduce((sum, play, rank) => sum + play.bid * (rank + 1),0);
