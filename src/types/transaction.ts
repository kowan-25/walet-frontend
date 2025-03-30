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