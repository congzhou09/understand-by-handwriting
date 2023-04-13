class Mediator {
  private colleagueA: ColleagueA;
  private colleagueB: ColleagueB;
  constructor(colleagueA: ColleagueA, colleagueB: ColleagueB) {
    this.colleagueA = colleagueA;
    this.colleagueB = colleagueB;

    this.colleagueA.setMediator(this);
    this.colleagueB.setMediator(this);
  }
  operateA() {
    this.colleagueA.operateA();
  }
  operateB() {
    this.colleagueB.operateB();
  }
}

abstract class Colleague {
  protected mediator: Mediator;
  setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }
}

class ColleagueA extends Colleague {
  operateA() {
    console.log(`do op A`);
  }
  private outerOpB() {
    this.mediator.operateB();
  }
  operate() {
    this.operateA();
    this.outerOpB();
  }
}

class ColleagueB extends Colleague {
  operateB() {
    console.log(`do op B`);
  }
}

const colleagueA = new ColleagueA();
const colleagueB = new ColleagueB();
const mediator = new Mediator(colleagueA, colleagueB);

colleagueA.operate();
