class Context {
  formula: string;
  valExp: ValExp;
  calcRet: number;
  constructor(formula: Context['formula'], valMap: object) {
    if (!/^[a-z]+[a-z+\-*/]+[a-z]+$/.exec(formula)) {
      throw new Error(`illegal formula`);
    }
    this.formula = formula;
    this.valExp = new ValExp(valMap);
    this.calc();
  }
  calc() {
    const valStack = [];
    let left: number;
    let right: number;
    let i = 0;
    while (i < this.formula.length) {
      let expChar = this.formula[i];
      let operatingChar = /[+\-*/]/.exec(expChar)?.[0];
      if (operatingChar) {
        // OperatingExp
        const subFormula = this.formula.substring(i + 1);
        const rightName = /[a-z]+/.exec(subFormula)?.[0];
        right = this.valExp.interpret(rightName);
        i += 1 + rightName.length;
        expChar = this.formula[i];
        const nextMultiOrDivid = /[*/]/.exec(expChar)?.[0];
        if (nextMultiOrDivid) {
          /*
           * if next operating expression is multiply or divide,
           * push current "operatingChar" and "right" into stack
           */
          valStack.push(operatingChar);
          valStack.push(right);
          continue;
        } else {
          left = valStack.pop();
          let tmpRet = new OperatingExp(left, right).interpret(operatingChar);
          while (valStack[valStack.length - 1]?.match(/[+\-*/]/)) {
            operatingChar = valStack.pop();
            left = valStack.pop();
            tmpRet = new OperatingExp(left, tmpRet).interpret(operatingChar);
          }
          valStack.push(tmpRet);
        }
      } else {
        // ValExp
        const subFormula = this.formula.substring(i);
        const leftName = /[a-z]+/.exec(subFormula)?.[0];
        i += leftName.length;
        valStack.push(this.valExp.interpret(leftName));
      }
    }
    this.calcRet = valStack[0];
  }
  getRet() {
    return this.calcRet;
  }
}

interface Expression {
  interpret(expElem: string): number;
}

class ValExp implements Expression {
  valMap: object;
  constructor(valMap: ValExp['valMap']) {
    this.valMap = valMap;
  }
  interpret(valKey: string): number {
    const theVal = this.valMap[valKey];
    if (theVal == undefined) {
      throw new Error(`illegal valKey: ${valKey}`);
    }
    return theVal;
  }
}

class OperatingExp implements Expression {
  left: number;
  right: number;
  constructor(left: OperatingExp['left'], right: OperatingExp['right']) {
    this.left = left;
    this.right = right;
  }
  interpret(operationalSym: string): number {
    switch (operationalSym) {
      case '+':
        return this.left + this.right;
      case '-':
        return this.left - this.right;
      case '*':
        return this.left * this.right;
      case '/':
        return this.left / this.right;
      default:
        throw new Error(`unknown operational symbol ${operationalSym}`);
    }
  }
}

const totalDistance = new Context('v*t+a*t*t', { v: 10, a: 5, t: 3 });
console.log(`calculation result is ${totalDistance.getRet()}`);

export {};
