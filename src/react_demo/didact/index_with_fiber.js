const TEXT_ELEMENT = "TEXT ELEMENT";

let rootInstance = null;
function render(element, parentDom) {
  const prevInstance = rootInstance;
  rootInstance = reconcile(parentDom, prevInstance, element);
}

function reconcile(container, prevInstance, element) {
  // Append or replace dom
  if (prevInstance == null) {
    const newInstance = instantiate(element);
    container.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    container.removeChild(prevInstance.dom);
    return null;
  } else if (prevInstance.element.type === element.type) {
    if (typeof element.type === "string") {
      // html element: update prevInstance
      updateDomProperties(
        prevInstance.dom,
        prevInstance.element.props,
        element.props
      );

      prevInstance.childInstances = reconcileChildren(prevInstance, element);
      prevInstance.element = element;
      return prevInstance;
    } else {
      // Component(element.type==="function"): reconcile with newElement generated from render() function
      prevInstance.publicInstance.props = element.props;
      const newComponentElement = prevInstance.publicInstance.render();
      const newComponentInstance = reconcile(
        container,
        prevInstance.componentInstance,
        newComponentElement
      );
      // prevInstance.dom = newComponentInstance.dom;
      // prevInstance.componentInstance = newComponentInstance;
      // prevInstance.element = element;
      // return prevInstance;
      return {
        dom: newComponentInstance.dom,
        element,
        componentInstance: newComponentInstance,
        publicInstance: prevInstance.publicInstance,
      };
    }
  } else {
    const newInstance = instantiate(element);
    container.replaceChild(newInstance.dom, prevInstance.dom);
    return newInstance;
  }
}

function reconcileChildren(prevInstance, element) {
  const newChildrenElement = element.props.children || [];
  const prevChildrenInstance = prevInstance.childInstances || [];
  const count = Math.max(
    prevChildrenInstance.length,
    newChildrenElement.length
  );
  const newChildrenInstance = [];
  for (let i = 0; i < count; i++) {
    newChildrenInstance.push(
      reconcile(
        prevInstance.dom,
        prevChildrenInstance[i],
        newChildrenElement[i]
      )
    );
  }
  return newChildrenInstance.filter((instance) => instance !== null);
}

function instantiate(element) {
  const { type, props } = element;
  const isComponent = typeof type === "function";
  if (isComponent) {
    const instance = {};
    const publicInstance = createPublicInstance(element, instance);
    const componentElement = publicInstance.render();
    const componentInstance = instantiate(componentElement);
    Object.assign(instance, {
      dom: componentInstance.dom,
      element,
      componentInstance,
      publicInstance,
    });
    return instance;
  } else {
    // Create DOM element
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    updateDomProperties(dom, [], props);

    // Render children
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    childInstances.forEach((childInstance) => {
      dom.appendChild(childInstance.dom);
    });
    return { dom, element, childInstances };
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = (name) => name.startsWith("on");
  const isAttribute = (name) => !isEvent(name) && name != "children";

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // Update attributes
  const prevAttributes = Object.keys(prevProps).filter(isAttribute);
  const nextAttributes = Object.keys(nextProps).filter(isAttribute);
  const attributeCount = Math.max(prevAttributes.length, nextAttributes.length);
  for (let i = 0; i < attributeCount; i++) {
    if (
      prevAttributes[i] !== nextAttributes[i] ||
      prevProps[prevAttributes[i]] !== nextProps[nextAttributes[i]]
    ) {
      prevAttributes[i] !== undefined && (dom[prevAttributes[i]] = null);
      nextAttributes[i] !== undefined &&
        (dom[nextAttributes[i]] = nextProps[nextAttributes[i]]);
    }
  }
}

function createElement(type, config, ...rawChildren) {
  return {
    type,
    props: {
      ...config,
      children: [].concat(...rawChildren) //存在的[Array(n)]情况
        .filter((child) => child != null && child !== false)
        .map((child) =>
          child instanceof Object ? child : createTextElement(child)
        ),
    },
  };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this._internalInstance);
  }
}

function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  reconcile(parentDom, internalInstance, internalInstance.element);
}

function createPublicInstance(element, internalInstance) {
  const { type, props } = element;
  const publicInstance = new type(props);
  publicInstance._internalInstance = internalInstance;
  return publicInstance;
}

export default {
  render,
  createElement,
  Component,
};
