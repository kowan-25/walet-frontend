
export interface ProjectBudget {
    id: string;
    project: string;
    member: string | null;
    amount: number;
    notes: string | null;
    created_at: string;
    is_income: boolean;
    is_editable: boolean;
  }
  
  export interface ProjectBudgetDisplay {
    id: string;
    amount: number;
    description?: string;
    created_at: string;
    is_income: boolean;
    member_name?: string;
  }
  
  export interface CreateBudgetPayload {
    project_id: string;
    amount: number;
    notes?: string;
    is_income: boolean;
    member_id?: string;
  }
  
  export interface UpdateBudgetPayload {
    amount?: number;
    notes?: string;
  }