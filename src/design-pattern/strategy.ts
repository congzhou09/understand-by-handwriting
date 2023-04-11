interface Strategy {
  operate: () => void;
}

class StrategyA implements Strategy {
  operate() {
    console.log(`strategy A op`);
  }
}

class StrategyB implements Strategy {
  operate() {
    console.log(`strategy B op`);
  }
}

class Context {
  private strategy: Strategy;
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  operate() {
    this.strategy.operate();
  }
}

const strategyA = new StrategyA();
const strategyB = new StrategyB();
const context = new Context();
context.setStrategy(strategyA);
context.operate();
context.setStrategy(strategyB);
context.operate();

export {}; // If don't contain at least 1 import or export statement, the file is considered as global and may lead to name clashing
