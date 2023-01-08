import { requestHostCallback } from "../scheduler";

// const requestCallback = requestHostCallback;
const requestCallback = requestIdleCallback;

const TEXT_ELEMENT = "TEXT ELEMENT";

/**
 * fiber's structure of an React element
 * {
 *   dom: the element's domNode,
 *   props: // the element's props
 *     {
 *       ...: the element's configs,
 *       children: [the element's children]
 *     }
 *   type: the element's type,
 *   child: the element's first child fiber,
 *   parent: the element's parent fiber,
 *   sibling: the element's sibling fiber,
 *   alternate: previous fiber at the element's same position,
 *   effectTag: mark the element's DOM change to be committed
 * }
 *
 * **/

function render(element, parentDom) {
  /**
   * rootFiber below is the parentDom's fiber,
   * since parentDom do not have an existed element or fiber,
   * so several properties are undefined.
   * **/
  rootFiber = {
    dom: parentDom, // rootFiber["dom"] is already existed
    props: {
      children: [element],
    },
    alternate: prevRootFiber,
  };
  nextWorkUnit = rootFiber;
}

let rootFiber = null; // work-in-progress root
let prevRootFiber = null;
let nextWorkUnit = null;
let deletions = new Set();
/**
 *  "deletions" stores fibers to be deleted when commit, use Set to replace Array because
 *  when debugging in a situation of render() being invoked continuously, "nextWorkUnit" is always not null
 *  and commitRootFiber() will not be invoked, "DELETE" condition in reconcile() may always be matched.
 **/
let updateFiber = null;
function workLoop(idleDeadlineObj) {
  let shouldYield = false;
  while (nextWorkUnit && !shouldYield) {
    nextWorkUnit = performWorkUnit(nextWorkUnit);
    const timeRemain = idleDeadlineObj.timeRemaining();
    shouldYield = timeRemain < 1;
  }
  if (!nextWorkUnit) {
    if (rootFiber) {
      commitRootFiber(); // commit rootFiber to the real DOM
    }

    if (updateFiber) {
      performCommit(updateFiber);
      updateFiber = null;
    }
  }

  requestCallback(workLoop);
}

function performWorkUnit(fiber) {
  const isComponent = typeof fiber.type === "function";
  if (isComponent) {
    if (!fiber.component) {
      fiber.component = createComponentInstance(fiber);
    }
    const elements = [fiber.component.render()];
    reconcile(fiber, elements);
  } else {
    // create current fiber dom
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }

    // reconcile this fiber's all children in the first depth
    const elements = fiber.props.children;
    reconcile(fiber, elements);
  }

  // return next work unit fiber
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
}

function commitRootFiber() {
  /**
   * delection fibers will not be included in new root fiber traverse
   * **/
  [...deletions].forEach((oneFiber) => {
    performCommit(oneFiber);
    oneFiber = null;
  });
  deletions.clear();

  performCommit(rootFiber.child);
  prevRootFiber = rootFiber;
  rootFiber = null;
}

/**
 * in the sequence of deep-first:
 * 1.child.child.child...
 * 2.sibling.sibling.sibling...
 * 3.parent.sibling.sibling.sibling...
 * **/
function performCommit(fiber) {
  if (!fiber) {
    return;
  }
  let parentForDom = fiber.parent;
  while (parentForDom && parentForDom.dom == null) {
    parentForDom = parentForDom.parent;
  }
  let parentDom = parentForDom.dom;
  if (fiber.effectTag === "ADD" && fiber.dom != null) {
    parentDom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETE") {
    parentDom.removeChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE") {
    updateDomProperties(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "REPLACE") {
    parentDom.replaceChild(fiber.dom, fiber.alternate.dom);
  }

  fiber.alternate = fiber;

  performCommit(fiber.child);
  performCommit(fiber.sibling);
}

/**
 * fiber is used to organize the units of work, each unit is
 * called a fiber and is relevant to a element node, and all
 * units of work form a fiber tree.
 *
 * For the convenience of getting the next unit of work, a
 * fiber stores its parent fiber, its first child fiber, and
 * its sibling fiber. Sequence of getting next unit is: first
 * child, sibling, child's parent sibling.
 * **/

requestCallback(workLoop);

function reconcile(parentFiber, elements) {
  /**
   * prevFiber is the child of the previous parentFiber,
   * and elements will produce the child of the current parentFiber.
   * **/
  let prevFiber = parentFiber.alternate && parentFiber.alternate.child;
  let fiberMark = null;
  for (let index = 0; index < elements.length || prevFiber != null; index++) {
    const element = elements[index];
    let oneFiber = null;

    if (prevFiber == null) {
      // add
      oneFiber = {
        dom: null,
        type: element.type,
        props: element.props,
        parent: parentFiber,
        alternate: null,
        effectTag: "ADD",
      };
    } else if (element == null) {
      // delete
      prevFiber.effectTag = "DELETE";
      deletions.add(prevFiber);
    } else if (prevFiber.type === element.type) {
      // update
      oneFiber = {
        dom: prevFiber.dom,
        type: prevFiber.type,
        props: element.props,
        parent: parentFiber,
        alternate: prevFiber,
        effectTag: "UPDATE",
      };
    } else {
      // replace
      oneFiber = {
        dom: null,
        type: element.type,
        props: element.props,
        parent: parentFiber,
        alternate: prevFiber,
        effectTag: "REPLACE",
      };
    }

    /**
     * traverse of the parentFiber.alternate: child...->sibling...,
     * the same order with fibers constructed from elements
     * **/
    if (prevFiber) {
      prevFiber = prevFiber.sibling;
    }

    if (index === 0) {
      parentFiber.child = oneFiber;
    } else {
      fiberMark.sibling = oneFiber;
    }
    fiberMark = oneFiber;
  }
}

function createDom(fiber) {
  const { type, props } = fiber;
  // Create DOM element
  const isTextElement = type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);

  updateDomProperties(dom, [], props);

  return dom;
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
      children: []
        .concat(...rawChildren) //存在的[Array(n)]情况
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
    nextWorkUnit = this._fiber;
    updateFiber = this._fiber;
  }
}

function createComponentInstance(fiber) {
  const { type, props } = fiber;
  const componentInstance = new type(props);
  componentInstance._fiber = fiber;
  return componentInstance;
}

export default {
  render,
  createElement,
  Component,
};
