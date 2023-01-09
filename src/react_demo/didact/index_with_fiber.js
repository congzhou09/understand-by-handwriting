import { requestHostCallback } from "../scheduler";

const requestCallback = requestHostCallback;
// const requestCallback = requestIdleCallback;

const TEXT_ELEMENT = "TEXT ELEMENT";

/**
 * fiber's structure of an React element
 * {
 *   stateNode: the element's domNode,
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
 *   effectTag: mark the element's DOM change to be committed, called "flag" since 16.14
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
    stateNode: parentDom, // rootFiber["stateNode"] is already existed
    props: {
      children: [element],
    },
    alternate: prevRootFiber,
  };
  nextWorkUnit = rootFiber;

  requestCallback(workLoop);
}

let rootFiber = null; // work-in-progress root
let prevRootFiber = null;
let nextWorkUnit = null;
let deletions = new Set();
/**
 *  "deletions" stores fibers to be deleted when commit, use Set to replace Array because
 *  when debugging in a situation of render() being invoked continuously, "nextWorkUnit" is always not null
 *  and commitRootFiber() will not be invoked, "DELETE" condition in reconcileChildren() may always be matched.
 **/
let updateFiber = null;
function workLoop(idleDeadlineObj) {
  let shouldYield = false;

  // render phase (includes: fiber creatation, diff)
  while (nextWorkUnit && !shouldYield) {
    nextWorkUnit = performWorkUnit(nextWorkUnit);
    if (idleDeadlineObj.didTimeout === true) {
      shouldYield = true;
    }
    if (typeof idleDeadlineObj.timeRemaining === "function") {
      const timeRemain = idleDeadlineObj.timeRemaining();
      shouldYield = timeRemain < 1;
    }
  }

  // commit phase
  if (!nextWorkUnit) {
    if (rootFiber) {
      commitRootFiber(); // commit rootFiber to the real DOM
    }

    if (updateFiber) {
      performCommit(updateFiber);
      updateFiber = null;
    }
  } else {
    // schedule remaining render phase
    requestCallback(workLoop);
  }
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
function performWorkUnit(workInProgress) {
  const isComponent = typeof workInProgress.type === "function";
  if (isComponent) {
    if (!workInProgress.component) {
      workInProgress.component = createComponentInstance(workInProgress);
    }
    const nextChildren = [workInProgress.component.render()];
    reconcileChildren(workInProgress, nextChildren);
  } else {
    // create current fiber dom
    if (!workInProgress.stateNode) {
      workInProgress.stateNode = createDom(workInProgress);
    }

    // reconcileChildren this fiber's all children in the first depth
    const nextChildren = workInProgress.props.children;
    reconcileChildren(workInProgress, nextChildren);
  }

  // child deep
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;

  while (nextFiber) {
    // sibling child deep
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    // parent
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
  while (parentForDom && parentForDom.stateNode == null) {
    parentForDom = parentForDom.parent;
  }
  let parentDom = parentForDom.stateNode;
  if (fiber.effectTag === "ADD" && fiber.stateNode != null) {
    parentDom.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === "DELETE") {
    parentDom.removeChild(fiber.stateNode);
  } else if (fiber.effectTag === "UPDATE") {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "REPLACE") {
    parentDom.replaceChild(fiber.stateNode, fiber.alternate.stateNode);
  }

  fiber.alternate = fiber;

  performCommit(fiber.child);
  performCommit(fiber.sibling);
}

function reconcileChildren(workInProgress, nextChildren) {
  /**
   * currentFirstChild is the child of the previous fiberNode,
   * and nextChildren will produce the children fiberNode of the workInProgress.
   * **/
  const currentFirstChild =
    workInProgress.alternate && workInProgress.alternate.child;

  let currentChildFiberNode = currentFirstChild;
  let fiberMark = null;

  for (
    let index = 0;
    index < nextChildren.length || currentChildFiberNode != null;
    index++
  ) {
    const element = nextChildren[index];
    let oneFiber = null;

    if (currentChildFiberNode == null) {
      // add
      oneFiber = {
        stateNode: null,
        type: element.type,
        props: element.props,
        parent: workInProgress,
        alternate: null,
        effectTag: "ADD",
      };
    } else if (element == null) {
      // delete
      currentChildFiberNode.effectTag = "DELETE";
      deletions.add(currentChildFiberNode);
    } else if (currentChildFiberNode.type === element.type) {
      // update
      oneFiber = {
        stateNode: currentChildFiberNode.stateNode,
        type: currentChildFiberNode.type,
        props: element.props,
        parent: workInProgress,
        alternate: currentChildFiberNode,
        effectTag: "UPDATE",
      };
    } else {
      // replace
      oneFiber = {
        stateNode: null,
        type: element.type,
        props: element.props,
        parent: workInProgress,
        alternate: currentChildFiberNode,
        effectTag: "REPLACE",
      };
    }

    /**
     * traverse of the current fiber tree layer: ...->sibling...,
     * the same order with fibers constructed from nextChildren
     * **/
    if (currentChildFiberNode) {
      currentChildFiberNode = currentChildFiberNode.sibling;
    }

    if (index === 0) {
      workInProgress.child = oneFiber;
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
