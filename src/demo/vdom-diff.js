const EFFECT_TYPE = {
  delete: "delete",
  add: "add",
  update: "update",
  moveAndUpdate: "modeAndUpdate",
};

const oldNodes = [{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }];

const newNodes = [
  { key: "D" },
  { key: "A" },
  { key: "F" },
  { key: "G" },
  { key: "B" },
];

function diffReact(oldNodes = [], newNodes = []) {
  const oldNodeMap = oldNodes.reduce((theMap, value, index) => {
    theMap[value.key] = index;
    return theMap;
  }, {});

  const updateArr = [];

  newNodes.forEach((newNode, index) => {
    const curKey = newNode.key;
    const oldIndex = oldNodeMap[curKey];
    if (oldIndex != void 0) {
      if (index === oldIndex) {
        updateArr.push({ key: curKey, effect: EFFECT_TYPE.update });
      } else {
        updateArr.push({
          key: curKey,
          effect: EFFECT_TYPE.moveAndUpdate,
          newIndex: index,
        });
      }
      delete oldNodeMap[curKey];
    } else {
      updateArr.push({
        key: curKey,
        effect: EFFECT_TYPE.add,
        newIndex: index,
      });
    }
  });

  // oldMap中仍然存在的key是下一次渲染中要删除的节点
  for (key in oldNodeMap) {
    updateArr.push({
      key,
      effect: EFFECT_TYPE.delete,
    });
  }

  return updateArr;
}

function diffVue(oldNodes = [], newNodes = []) {
  const oldNodeMap = oldNodes.reduce((theMap, value, index) => {
    theMap[value.key] = index;
    return theMap;
  }, {});

  let oldStartIndex = 0;
  let oldEndIndex = oldNodes.length - 1;
  let newStartIndex = 0;
  let newEndIndex = newNodes.length - 1;

  let oldStartNode = oldNodes[oldStartIndex];
  let oldEndNode = oldNodes[oldEndIndex];
  let newStartNode = newNodes[newStartIndex];
  let newEndNode = newNodes[newEndIndex];

  const updateArr = [];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode == null) {
      oldStartNode = oldNodes[++oldStartIndex];
    } else if (oldEndNode == null) {
      oldEndNode = oldNodes[--oldEndIndex];
    } else if (oldStartNode.key === newStartNode.key) {
      updateArr.push({ key: oldStartNode.key, effect: EFFECT_TYPE.update });
      oldStartNode = oldNodes[++oldStartIndex];
      newStartNode = newNodes[++newStartIndex];
    } else if (oldEndNode.key === newEndNode.key) {
      updateArr.push({ key: oldStartNode.key, effect: EFFECT_TYPE.update });
      oldEndNode = oldNodes[--oldEndIndex];
      newEndNode = newNodes[--newEndIndex];
    } else if (oldStartNode.key === newEndNode.key) {
      updateArr.push({
        key: oldStartNode.key,
        effect: EFFECT_TYPE.moveAndUpdate,
        newIndex: newEndIndex,
      });
      oldStartNode = oldNodes[++oldStartIndex];
      newEndNode = newNodes[--newEndIndex];
    } else if (oldEndNode.key === newStartNode.key) {
      updateArr.push({
        key: oldEndNode.key,
        effect: EFFECT_TYPE.moveAndUpdate,
        newIndex: newStartIndex,
      });
      oldEndNode = oldNodes[--oldEndIndex];
      newStartNode = newNodes[++newStartIndex];
    } else {
      const newInOldNodeIndex = oldNodeMap[newStartNode.key];
      if (newInOldNodeIndex) {
        updateArr.push({
          key: newStartNode.key,
          effect: EFFECT_TYPE.moveAndUpdate,
          newIndex: newStartIndex,
        });
        oldNodes[newInOldNodeIndex] = null;
      } else {
        updateArr.push({
          key: newStartNode.key,
          effect: EFFECT_TYPE.add,
          newIndex: newStartIndex,
        });
      }
      newStartNode = newNodes[++newStartIndex];
    }
  }

  while (oldStartIndex <= oldEndIndex) {
    if (oldStartNode != null) {
      updateArr.push({
        key: oldStartNode.key,
        effect: EFFECT_TYPE.delete,
        newIndex: oldStartIndex,
      });
    }
    oldStartNode = oldNodes[++oldStartIndex];
  }

  while (newStartIndex <= newEndIndex) {
    updateArr.push({
      key: newStartNode.key,
      effect: EFFECT_TYPE.add,
      newIndex: oldStartIndex,
    });
    newStartNode = newNodes[++newStartIndex];
  }

  return updateArr;
}

function printUpdateInfo(updateArr) {
  updateArr.forEach((one) => {
    switch (one.effect) {
      case EFFECT_TYPE.moveAndUpdate:
      case EFFECT_TYPE.add: {
        console.log(`${one.key} ${one.effect} to ${one.newIndex}`);
        break;
      }
      default: {
        console.log(`${one.key} ${one.effect}`);
        break;
      }
    }
  });
}

console.log("ReactDiff:");
printUpdateInfo(diffReact(oldNodes, newNodes));

console.log("VueDiff:");
printUpdateInfo(diffVue(oldNodes, newNodes));
