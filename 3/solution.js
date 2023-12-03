const input = (await (await fetch('https://adventofcode.com/2023/day/3/input')).text()).trim().split('\n');
const field = input.map(l=>l.split('').map(c=>c.charCodeAt(0)));
const charCode0 = '0'.charCodeAt(0);
const charCode9 = '9'.charCodeAt(0);
const charCodeDot = '.'.charCodeAt(0);
const charCodeStar = '*'.charCodeAt(0);
const isNumber = cc => cc >= charCode0 && cc <= charCode9;
const takeDigitAt = (arr, pos) => { const ret = arr[pos] - charCode0; arr[pos] = charCodeDot; return ret; }
const isSymbol = c => c != charCodeDot && !isNumber(c);
const width = input[0].length;
const height = input.length;
const numbers = [];
const extractNumber = (x,y) => {
    if (x<0 || x >= width || y < 0 || y >= width || !isNumber(field[y][x]))
        return;
    let number = takeDigitAt(field[y], x);
    let start = x;
    for (let p = x -1; p >= 0 && isNumber(field[y][p]); p--) {
        number += Math.pow(10, x-p) * takeDigitAt(field[y], p);
        start = p;
    }
    let end = x;
    for (let p = x + 1; p < width && isNumber(field[y][p]); p++) {
        number = 10 * number + takeDigitAt(field[y], p);
        end = p;
    }
    numbers.push({number, start, end, y});
};

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (isSymbol(field[y][x])) {
            extractNumber(x-1, y-1);
            extractNumber(x, y-1);
            extractNumber(x+1, y-1);
            extractNumber(x-1, y);
            extractNumber(x+1, y);
            extractNumber(x-1, y+1);
            extractNumber(x, y+1);
            extractNumber(x+1, y+1);
        }
    }
}
const solutionPart1 = numbers.map(n=>n.number).reduce((sum,a)=>sum+a);

const adjacentNumbers = (x,y) => numbers.filter(n => (Math.abs(n.y - y) < 2) && (n.start <= x+1) && (n.end >= x-1));

let solutionPart2 = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (field[y][x] == charCodeStar) {
            const adjacent = adjacentNumbers(x,y,);
            if (adjacent.length ==2) {
                solutionPart2 += adjacent[0].number * adjacent[1].number;
            }
        }
    }
}

