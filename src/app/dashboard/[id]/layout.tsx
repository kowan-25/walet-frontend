'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from "@/components/navigations/Sidebar";
import useUser from '@/hooks/useUser';

interface ProjectRoleContextType {
  isManager: boolean | null;
  isLoading: boolean;
}

export const ProjectRoleContext = createContext<ProjectRoleContextType>({
  isManager: null,
  isLoading: true
});

export const useProjectRole = () => useContext(ProjectRoleContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  const { userId } = useUser();
  
  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/project/${id}`);
        
        if (response.status === 200) {
          const data = response.data;
          setIsManager(data.manager === userId);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id && userId) {
      fetchProject();
    }
  }, [id, userId]);

  return (
    <ProjectRoleContext.Provider value={{ isManager, isLoading }}>
      <div className="flex min-h-screen bg-light">
        <Sidebar />
        <div className="flex-1 ml-80 pt-[128px] pr-8 pb-[18px]">
          <main className="bg-white rounded-[20px] min-h-[calc(100vh-146px)]">
            {children}
          </main>
        </div>
      </div>
    </ProjectRoleContext.Provider>
  );
}
