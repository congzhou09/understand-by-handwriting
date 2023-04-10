abstract class TreeNode {
  protected id: string;
  static index = 0;
  type: NODE_TYPE;
  constructor() {
    this.id = String(TreeNode.index++);
  }
  commonOperation() {
    console.log(`TreeNode(id:${this.id},type:${this.type}) op`);
  }
}

enum NODE_TYPE {
  NODE = 'node',
  LEAF = 'leaf',
}

class CompositeNode extends TreeNode {
  children: Array<TreeNode> = [];
  constructor() {
    super();
    this.type = NODE_TYPE.NODE;
  }
  add(oneNode: TreeNode) {
    this.children.push(oneNode);
  }
}

class LeafNode extends TreeNode {
  constructor() {
    super();
    this.type = NODE_TYPE.LEAF;
  }
}

const root = new CompositeNode();
const nodeOne = new CompositeNode();
const nodeTwo = new CompositeNode();
root.add(new LeafNode());
root.add(nodeOne);
root.add(nodeTwo);
nodeOne.add(new LeafNode());
nodeOne.add(new LeafNode());

/*
 *  0
 *  ├ 3
 *  ├ 1
 *  │ ├4
 *  │ └5
 *  └ 2
 */
function tranverseTree(treeNode) {
  treeNode.commonOperation();
  if (treeNode.type === NODE_TYPE.NODE) {
    treeNode.children?.forEach((child) => {
      tranverseTree(child);
    });
  }
}
tranverseTree(root);
