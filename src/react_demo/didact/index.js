const TEXT_ELEMENT = "TEXT ELEMENT";

let rootInstance = null;
function render(element, parentDom) {
  const prevInstance = rootInstance;
  rootInstance = reconcile(parentDom, prevInstance, element);
}

function reconcile(container, prevInstance, element) {
  // Append or replace dom
  if (prevInstance === null) {
    const newInstance = instantiate(element);
    container.appendChild(newInstance.dom);
    return newInstance;
  } else {
    const newInstance = instantiate(element);
    container.replaceChild(newInstance.dom, prevInstance.dom);
    return newInstance;
  }
}

function instantiate(element) {
  const { type, props } = element;

  // Create DOM element
  const isTextElement = type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);

  // Add event listeners
  const isListener = (name) => name.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[name]);
    });

  // Set properties
  const isAttribute = (name) => !isListener(name) && name != "children";
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = props[name];
    });

  // Render children
  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  childInstances.forEach((childInstance) => {
    dom.appendChild(childInstance.dom);
  });

  return { dom, element, childInstances };
}

function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter((c) => c != null && c !== false)
    .map((c) => (c instanceof Object ? c : createTextElement(c)));
  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

export default {
  render,
  createElement,
};
