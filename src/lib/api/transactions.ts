import api from "@/lib/api";
import { Transaction, CreateTransactionPayload, UpdateTransactionPayload } from './types';

export const getProjectTransactions = async (projectId: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/api/funds/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project transactions:', error);
    throw error;
  }
};

export const getMemberTransactions = async (projectId: string, userId: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/api/funds/${projectId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching member transactions:', error);
    throw error;
  }
};

export const getTransactionById = async (transactionId: string): Promise<Transaction> => {
  try {
    const response = await api.get(`/api/funds/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

export const createTransaction = async (data: CreateTransactionPayload): Promise<Transaction> => {
  try {
    const response = await api.post('/api/funds/create', data);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (
  transactionId: string, 
  data: UpdateTransactionPayload
): Promise<Transaction> => {
  try {
    const response = await api.put(`/api/funds/edit/${transactionId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  try {
    await api.delete(`/api/funds/delete/${transactionId}`);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};
