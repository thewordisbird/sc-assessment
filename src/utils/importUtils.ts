import { IEmployee, ITreeNode } from '../types';

interface IAdj {
  info: IEmployee;
  descendants: IEmployee[];
}

/**
 * Normalizes the name to be not an email and have a capital first character
 *
 * @param employeeName
 * @returns the normalized employee name
 */
function normalizeName(employeeName: string): string {
  const stripEmail = employeeName.split('@')[0];
  const correctCase =
    stripEmail.charAt(0).toUpperCase() + stripEmail.slice(1).toLowerCase();
  return correctCase;
}

/**
 * Normalizes the employee object, by normalizing the name and
 * creating a new object with the normalized name and other employee data
 *
 * @param employee
 * @returns the normalized employee object
 */
export function normalizeEmployee(employee: IEmployee): IEmployee {
  const normalizedName = normalizeName(employee.name);
  return {
    ...employee,
    name: normalizedName,
  };
}

/**
 * Normalizes an array of employee objects
 *
 * @param employees
 * @returns an array of normalized employee objects
 */
export function normalizeEmployees(employees: IEmployee[]): IEmployee[] {
  console.log('Normalizing JSON file...');
  return employees.map((e) => normalizeEmployee(e));
}

/**
 * Normalizes the employee object, by normalizing the name and
 * creating a new object with the normalized name and other employee data
 *
 * @param employees normalized employees
 * @returns a representation of the company employee structure as an adjecency object
 */
export function generateAdj(employees: IEmployee[]): Record<string, IAdj> {
  const adj: Record<string, IAdj> = {};

  const addDescendant = (bossName: string, descendant: IEmployee): void => {
    if (bossName in adj) {
      adj[bossName].descendants.push({ ...descendant });
    } else {
      adj[bossName] = {
        info: {} as IEmployee,
        descendants: [],
      };
    }
  };

  employees.forEach((employee) => {
    if (!(employee.name in adj)) {
      adj[employee.name] = {
        info: employee,
        descendants: [],
      };
    }
    addDescendant(employee.boss, employee);
  });

  return adj;
}
