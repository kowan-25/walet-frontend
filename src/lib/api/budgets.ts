import api from "@/lib/api";
import { ProjectBudget, CreateBudgetPayload, UpdateBudgetPayload } from './types';

export const getProjectBudgets = async (projectId: string): Promise<ProjectBudget[]> => {
    try {
        const response = await api.get(`/api/project/budget-records/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project budgets:', error);
        throw error;
    }
};

export const getProjectBudgetById = async (budgetId: string): Promise<ProjectBudget> => {
    try {
        const response = await api.get(`/api/project/budget-record/${budgetId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching budget record:', error);
        throw error;
    }
};

export const createProjectBudget = async (data: CreateBudgetPayload): Promise<ProjectBudget> => {
    try {
        const response = await api.post('/api/project/budget-record/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating budget record:', error);
        throw error;
    }
};

export const updateProjectBudget = async (
    budgetId: string,
    data: UpdateBudgetPayload
): Promise<any> => {
    try {
        const response = await api.put(`/api/project/budget-record/edit/${budgetId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating budget record:', error);
        throw error;
    }
};

export const deleteProjectBudget = async (budgetId: string): Promise<any> => {
    try {
        const response = await api.delete(`/api/project/budget-record/delete/${budgetId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting budget record:', error);
        throw error;
    }
};