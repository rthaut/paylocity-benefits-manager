export type Relationship = "spouse" | "child";

export type Dependent = {
  id: string;
  name: string;
  relationship: Relationship;
};

export type Employee = {
  id: string;
  name: string;
  dependents: Dependent[];
};
