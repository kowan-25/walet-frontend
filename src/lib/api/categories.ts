import api from "@/lib/api";
import { ProjectCategory } from './types';

export const getProjectCategories = async (projectId: string): Promise<ProjectCategory[]> => {
  try {
    const response = await api.get(`/api/project/categories/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project categories:', error);
    throw error;
  }
};

export const createProjectCategory = async (projectId: string, name: string): Promise<ProjectCategory> => {
  const response = await api.post(`/api/project/category/create`, { project_id: projectId, name });
  return response.data;
};

export const deleteProjectCategory = async (categoryId: string): Promise<void> => {
  await api.delete(`/api/project/category/delete/${categoryId}`);
};