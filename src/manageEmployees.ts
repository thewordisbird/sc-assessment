import TreeNode from './treeNode';
import {
  generateAdj,
  normalizeEmployee,
  normalizeEmployees,
} from './utils/importUtils';
import { getBoss, getEmployee } from './getEmployees';
import { ITreeNode, IEmployee } from './types';

/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param employees array of employees
 * @returns the root node of the tree. The employee with no boss
 */
export function generateCompanyStructure(employees: IEmployee[]): ITreeNode {
  const normalizedEmployees = normalizeEmployees(employees);
  const adj = generateAdj(normalizedEmployees);

  // Assumption: Only one employee is the top boss
  const rootEmployeeName = Object.keys(adj).filter((e) => {
    const b = adj[e].info.boss;
    return b === null;
  });

  console.log('Generating employee tree...\n');
  const buildTree = (employee: IEmployee, descendants: IEmployee[]) => {
    const node = new TreeNode(employee);
    if (descendants.length >= 0) {
      for (const descendant of descendants) {
        const descendantNode = buildTree(
          descendant,
          adj[descendant.name].descendants
        );
        node.addDescendant(descendantNode);
      }
    }
    return node;
  };

  const rootEmployee = adj[rootEmployeeName[0]];

  return buildTree(rootEmployee.info, rootEmployee.descendants);
}

/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param tree root node of the tree
 * @param newEmployee the employee being hired
 */
export function hireEmployee(tree: ITreeNode, newEmployee: IEmployee): void {
  const normalizedEmployee = normalizeEmployee(newEmployee);
  const newEmployeeNode = new TreeNode(normalizedEmployee);
  // Find the boss node for the new hire
  const boss = getEmployee(tree, normalizedEmployee.boss);
  if (boss) {
    boss.addDescendant(newEmployeeNode);
  }

  console.log(
    `[hireEmployee]: Added new employee ${normalizedEmployee.name} with ${boss.value.name} as their boss`
  );
}

/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param tree root node of the tree
 * @param name employee's name
 */
export function fireEmployee(tree: ITreeNode, name: string): void {
  const employeeNode = getEmployee(tree, name);
  let replacementNode = employeeNode.descendants[0];

  console.log(
    `[fireEmployee]: Fired ${name} and replaced with ${
      replacementNode ? replacementNode.value.name : 'noone'
    }`
  );

  // Demote untill their are no more descendants
  while (replacementNode) {
    demoteEmployee(tree, name, replacementNode.value.name, false);
    replacementNode = employeeNode.descendants[0];
  }

  // Remove employee pointer for last boss
  const bossNode = getBoss(tree, name, false);
  bossNode.removeDescendant(employeeNode);
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param tree root node of the tree
 * @param employeeName name of the employee
 */
export function promoteEmployee(tree: ITreeNode, employeeName: string): void {
  const bossNode = getBoss(tree, employeeName, false);
  const bossName = bossNode.value.name;

  demoteEmployee(tree, bossName, employeeName);

  console.log(
    `[promoteEmployee]: Promoted ${employeeName} and made ${bossName} his subordinate `
  );
}

/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinat and swaps places in the hierarchy.
 *
 * @param tree root node of the tree
 * @param employeeName the employee getting demoted
 * @param subordinateName the new boss
 */
export function demoteEmployee(
  tree: ITreeNode,
  employeeName: string,
  subordinateName: string,
  log: boolean = true
): void {
  // Get nodes to modify
  const bossNode = getBoss(tree, employeeName, false);
  const demoteeNode = getEmployee(tree, employeeName);
  const promoteeNode = getEmployee(tree, subordinateName);

  // Modify boss descendants
  bossNode.addDescendant(promoteeNode);
  bossNode.removeDescendant(demoteeNode);

  // Store demotee descendants and value in temp variables and update demotee
  const demoteeDescendants: ITreeNode[] = [...demoteeNode.descendants];
  const demoteeValue = { ...demoteeNode.value };
  demoteeNode.replaceDescendants(promoteeNode.descendants);
  demoteeNode.updateValue({
    boss: promoteeNode.value.boss,
    salary: promoteeNode.value.salary,
    jobTitle: promoteeNode.value.jobTitle,
  });

  // Update promotee
  promoteeNode.replaceDescendants(
    demoteeDescendants.filter((d) => d.value.name !== promoteeNode.value.name)
  );

  promoteeNode.addDescendant(demoteeNode);
  promoteeNode.updateValue({
    boss: demoteeValue.boss,
    salary: demoteeValue.salary,
    jobTitle: demoteeValue.jobTitle,
  });

  // Update promotee descendants boss.
  promoteeNode.descendants.forEach((d) =>
    d.updateValue({ boss: promoteeNode.value.name })
  );

  log &&
    console.log(
      `[demoteEmployee]: Demoted employee (demoted ${employeeName} and replaced with ${subordinateName})`
    );
}
