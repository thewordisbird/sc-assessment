import { searchTree } from './utils/treeUtils';
import { ITreeNode } from './types';

/**
 * Given an employee name, will find the node of the employee if it exists.
 *
 * @param tree root node of the tree
 * @param employeeName
 * @returns The node representing the employee or null if not found
 */
export function getEmployee(
  tree: ITreeNode,
  employeeName: string
): ITreeNode | null {
  return searchTree(
    tree,
    employeeName,
    (node: ITreeNode, employeeName: string) => node.value.name === employeeName
  );
}
/**
 * Given an employee, will find the node above (if any).
 *
 * @param tree the root node of the tree
 * @param employeeName
 * @returns The nod representing the boss of the employee or null if not found
 */
export function getBoss(
  tree: ITreeNode,
  employeeName: string,
  log = true
): ITreeNode | null {
  const bossNode = searchTree(
    tree,
    employeeName,
    (node, employeeName) =>
      node.descendants.filter((d) => d.value.name === employeeName).length > 0
  );

  if (log && bossNode) {
    console.log(`[getBoss]: ${employeeName}'s boss is ${bossNode.value.name}`);
  }

  if (log && !bossNode) {
    console.log(
      `[getBoss]: ${employeeName} does not have a boss. They are the BOSS!`
    );
  }

  return bossNode;
}

/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 *
 * @param tree root node of the tree
 * @param employeeName
 * @returns A list of the subordinates of an employee
 */
export function getSubordinates(
  tree: ITreeNode,
  employeeName: string
): ITreeNode[] {
  const employeeNode = getEmployee(tree, employeeName);
  const subordinates = employeeNode.descendants;

  // Logging
  console.log(
    `[getSubordinates] ${employeeName}'s subordinates are ${subordinates.reduce(
      (acc, cur, idx, arr) => {
        if (idx === arr.length - 1) {
          return acc + cur.value.name;
        }
        return acc + cur.value.name + ', ';
      },
      ''
    )} `
  );
  return subordinates;
}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 *
 * @param tree the root node of the tree
 * @returns a tuple with an array of the lowest ranking employees
 *  and the depth of the employee in the company (0 indexed from CEO)
 */
export function findLowestEmployee(tree: ITreeNode): [ITreeNode[], number] {
  const visited: Record<string, ITreeNode> = { [tree.value.name]: tree };
  const level: Record<string, number> = { [tree.value.name]: 0 };
  let lowest = 0;

  const dfs = (node: ITreeNode) => {
    for (const descendant of node.descendants) {
      if (!(descendant.value.name in visited)) {
        visited[descendant.value.name] = descendant;
        level[descendant.value.name] = level[node.value.name] + 1;
        lowest = Math.max(level[descendant.value.name], lowest);
        dfs(descendant);
      }
    }
  };

  // Traverse tree to find lowest employee
  dfs(tree);

  const lowestRanking = Object.keys(level)
    .filter((n) => level[n] === lowest)
    .map((cur) => visited[cur]);

  console.log(
    `The lowest employees is/are: ${lowestRanking.map(
      (e) => ' ' + e.value.name
    )} at level ${lowest}`
  );

  return [lowestRanking, lowest];
}
