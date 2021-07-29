import { ITreeNode, IEmployee } from './types';

class TreeNode implements ITreeNode {
  value: IEmployee | null;
  descendants: ITreeNode[];

  constructor(value: IEmployee = null) {
    this.value = value;
    this.descendants = [];
  }

  updateValue(data: Partial<IEmployee>): void {
    this.value = {
      ...this.value,
      ...data,
    };
  }

  addDescendant(descendant: ITreeNode): void {
    const updatedDescendants = [...this.descendants, descendant];
    this.descendants = updatedDescendants;
  }

  removeDescendant(descendant: ITreeNode): void {
    const updatedDescendants = this.descendants.filter((d: TreeNode) => {
      return d !== descendant;
    });
    this.descendants = updatedDescendants;
  }

  replaceDescendants(newDescendants: ITreeNode[]): void {
    this.descendants = [...newDescendants];
  }
}

export default TreeNode;
