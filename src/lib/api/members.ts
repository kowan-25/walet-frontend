import api from "@/lib/api";
import { ProjectMember } from './types';

export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
    try {
      const response = await api.get(`/api/project/${projectId}/members/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project members:', error);
      throw error;
    }
  };

export const getProjectMemberDetails = async (projectId: string, memberId: string): Promise<ProjectMember> => {
  try {
    const response = await api.get(`/api/project/${projectId}/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }
};