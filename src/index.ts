import employeeData from './employees.json';
import { findLowestEmployee, getBoss, getSubordinates } from './getEmployees';
import {
  demoteEmployee,
  fireEmployee,
  generateCompanyStructure,
  hireEmployee,
  promoteEmployee,
} from './manageEmployees';
import { IEmployee } from './types';

// Main code goes here
function main() {
  const employees: IEmployee[] = employeeData.employees;
  const tree = generateCompanyStructure(employees);

  hireEmployee(tree, { name: 'Jeb', boss: 'Sarah' });
  fireEmployee(tree, 'Alicia');
  promoteEmployee(tree, 'Jared');
  demoteEmployee(tree, 'Xavier', 'Maria');

  console.log('\n');

  getBoss(tree, 'Bill');
  getSubordinates(tree, 'Maria');

  findLowestEmployee(tree);
}

main();
