// Generator

function* consume() {
  console.log('consume start');
  while (true) {
    var product = yield;

    // 结束标识
    if (typeof product == 'symbol' && Symbol.keyFor(product) === 'END') {
      break;
    }
    console.log(`consume ${product}`);
  }
  console.log('consume exit');
}

const consumeIterator = consume();

function produce() {
  consumeIterator.next(); // 启动消费者，进入其while循环
  let count = 1;
  while (count <= 5) {
    console.log(`produce ${count}`);
    consumeIterator.next(count);
    count++;
  }
  consumeIterator.next(Symbol.for('END'));
}
produce();

// async/await

async function consume2() {
  
}
