import currying from '../tool/currying';

function add(left, right) {
  return left + right;
}

const curryAdd = currying(add);

console.log(add(1, 2));
console.log(curryAdd(1)(2));
console.log(curryAdd(1, 2));
console.log(currying(add, 1)(2));
console.log(currying(add)(1, 2));
console.log(currying(add)(1)(2));
