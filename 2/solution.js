const parseGame = line => {
  const [head, tail] = line.split(': ');
  const id = parseInt(head.replace(/[^0-9]/g, ''));
  const reveals = tail.split('; ')
                    .map(rev => rev.split(', ')
                        .map(e => {
                          const [count, color] = e.split(' ');
                          return {[color]: count};
                        })
                    ).map(arr => Object.assign({}, ...arr));
  const maxRevealed = reveals.reduce((max, cur) => ({red: Math.max(max.red, cur.red||0), green: Math.max(max.green, cur.green||0), blue: Math.max(max.blue, cur.blue||0)}), {red:0, blue:0, green:0});
  return {id, reveals, maxRevealed};
};

const inTheBag = {red: 12, green: 13, blue: 14};

const input = (await (await fetch('https://adventofcode.com/2023/day/2/input')).text()).trim().split('\n');
const games = input.map(parseGame);

const solutionPart1 = games
  .filter(g => g.maxRevealed.red <= inTheBag.red && g.maxRevealed.green <= inTheBag.green && g.maxRevealed.blue <= inTheBag.blue)
  .map(g => g.id)
  .reduce((sum, id) => sum + id);

const solutionPart2 = games
  .map(g => g.maxRevealed.red*g.maxRevealed.green*g.maxRevealed.blue)
  .reduce((sum,one)=>sum+one);
