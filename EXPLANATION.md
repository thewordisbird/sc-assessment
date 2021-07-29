# SC-Assessment Explanation

## Installation and Usage Instructions

- Fork or clone project repository
- From the project directory install all dependencies using:
  $ npm install
- Compile the typescript:
  $ npm run-script build
- Run the application:
  $ npm run-script run

The index.ts file contains the main function. You can make function calls from here to manipulate the employee structure

## Design Decisions

The first decision was the data structure to house the employee data. Using a standard tree makes sense as a model for the company, but I spent time evaluating the option of storing the employees in a binary search tree by employee name. This would allow search to be performed at O(ln(n)) but would require each node to hold more data and would require more searches. The binary search tree would also require balancing on hires and fires. Finally, it made finding the lowest employee far more complex. Considering the size of the data set, even if being used in a large corporation is on the order of 10's to 100's of thousands of employees, the difference in search speed would be insignificant and not worth the added implementation complexity. So, I decided to model the company employees as a standard tree.

To build the tree, I decided to first build an adjacency object. This allowed me to hold data for employees that were referenced as a boss before being processed themselves. Using an object with the names of the employees as keys made finding the unfinished employee to update an O(1) operation. This also allowed me to find the root employee (the CEO).

I decided to keep the boss information in the employees tree node value. Since I also choose to store the salary and jobTitle information in the employee node, it didn't add any complexity to updates on demotion or promotion. For the purpose of the assessment, any time I needed to find the boss I used the `findBoss` function passing in the employee's name.

Lastly I made a few assumption:

- The employee name was a unique identifier to the employee. If this was not the case, a unique ID would have to be generated for each employee and added to the value object of each employee node.
- There is only one root employee with no boss. If this were not the search algorithms would have to be ran through a loop starting at each top boss and searching that tree.

## Future Improvements

- Automated testing would help with future development and refactoring.
- Updating the JSON file with changes. In the apps current state, the data is not persistent beyond the execution of the program
- Add ability to choose replacement for all affected by a firing

## Time Complexity

Note: In all cases n represents the number of employees.

- `generateCompanyStructure`:
  - O(n) to create the adjacency object
  - O(n) to normalize the data
  - O(n) to build the tree
  - Total: O(n)
- `hireEmployee`:
  - O(1) to normalize employee
  - O(1) to create the tree node
  - O(n) to find the boss node
  - O(n) to add descendant (I updated the descendants by coping the descendants and adding the new descendant then setting the new array as the nodes descendants)
  - Total: O(n)
- `fireEmployee`:
  - O(n) to get the employee node
  - O(n) to demote the employee until they are at the bottom of the tree
  - O(1) to remove the last boss reference
  - Total: O(n)
- `promoteEmployee`:
  - O(n) to get the boss
  - O(n) to demote the boss and promote the employee
  - Total: O(n)
- `demoteEmployee`:
  - O(n) to get boss node
  - O(n) to get the employee node
  - O(n) to get the promoted employee node
  - O(n) for removing, adding and replacing descendants
  - O(1) to update the node value
  - Total: O(n)
- `getBoss`: O(n) for breadth first search of the tree
- `getSubordinates`: O(n) to find the employee node
- `findLowestEmployee`: O(n) to preform depth first search on the tree

## Function Combination

`demoteEmployee` and `promoteEmployee` do the same thing. I built out the `demoteEmployee` function, as I needed it to implement my `fireEmployee` function. To promote and employee I passed the promoted employee and demoted employee to the correct arguments of the `demoteEmployee` function. It would better to write a helper function `swapEmployees` that can be fed the arguments of the promoted and demoted employee from `promoteEmployee` and `demoteEmployee`.
