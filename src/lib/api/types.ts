export interface Transaction {
  id: string;
  user: string;
  project: string;
  amount: number;
  transaction_note: string | null;
  transaction_category: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionDisplay {
  id: string;
  amount: string;
  category: string;
  categoryName: string;
  username?: string;
  description?: string;
  created_at: string;
}

export interface CreateTransactionPayload {
  project_id: string;
  amount: number;
  transaction_note?: string;
  category_id: string;
}

export interface UpdateTransactionPayload {
  amount?: number;
  transaction_note?: string;
  category_id?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

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

export interface ProjectMember {
  id: string;
  member: string;
  member_name: string; 
  budget: number;
  created_at: string;
  project: string;
}

export interface SendFundsPayload {
  member_id: string;
  funds: number;
  notes?: string;
}

export interface ProjectInvitation {
  id: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
  project: string;
  user: string;
  project_name: string;
  project_manager_username: string;
}