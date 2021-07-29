import { ITreeNode } from '../types';

/**
 * @callback isTarget
 * @param node the employee node to be evaluated as a target
 * @param target the string value being looked for
 * @returns if the node contains the target as defined by the function
 */

/**
 * Searches the tree for a target, that satisfies a matching function
 *
 * @param tree the root node of the tree
 * @param target the value to be found
 * @param isTarget
 * @returns the node that matches the target or null if no match exists
 */
export function searchTree(
  tree: ITreeNode,
  target: string,
  isTarget: (node: ITreeNode, target: string) => boolean
): ITreeNode | null {
  // Breadth first search tree for employee and return node if found
  const queue = [tree];
  const visited = new Set();

  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      if (isTarget(node, target)) {
        return node;
      }
      visited.add(node);
      for (const descendant of node.descendants) {
        queue.push(descendant);
      }
    }
  }

  return null;
}

export function printTree(tree: ITreeNode): void {
  const descendants = tree.descendants.map((v) => v.value.name);
  console.log(`Employee: ${tree.value.name}\nDescendants: ${descendants}\n`);
  tree.descendants.forEach((d) => printTree(d));
}
