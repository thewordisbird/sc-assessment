export interface IEmployee {
  name: string;
  jobTitle?: string;
  boss: string | null;
  salary?: string;
}

export interface ITreeNode {
  value: IEmployee;
  descendants: ITreeNode[];
  updateValue: (data: Partial<IEmployee>) => void;
  addDescendant: (descendant: ITreeNode) => void;
  removeDescendant: (descendant: ITreeNode) => void;
  replaceDescendants: (newDescendants: ITreeNode[]) => void;
}
