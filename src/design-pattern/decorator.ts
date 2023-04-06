interface Component {
  operation: () => string;
}

class ComponentA implements Component {
  operation() {
    return `ComponentA operates`;
  }
}

class Decorator implements Component {
  private component;
  constructor(component: Component) {
    this.component = component;
  }
  operation() {
    return this.decoratedOperation(this.component.operation());
  }
  private decoratedOperation(origInfo) {
    return `"${origInfo}" PLUS decorated info`;
  }
}

const componentA = new ComponentA();
const oneDecorator = new Decorator(componentA);
console.log(oneDecorator.operation());
