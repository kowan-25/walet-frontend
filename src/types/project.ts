export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  status: string;
  manager: string;
  total_budget: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
}
