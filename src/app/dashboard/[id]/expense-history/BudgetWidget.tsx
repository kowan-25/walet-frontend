'use client';

import React, { useEffect, useState } from 'react';
import { getProjectMemberDetails } from '@/lib/api/members';
import { ProjectMember } from '@/lib/api/types';

interface BudgetWidgetProps {
    projectId: string;
    userId: string;
    refreshTrigger: number;
}

const BudgetWidget = ({ projectId, userId, refreshTrigger }: BudgetWidgetProps) => {

    const [memberData, setMemberData] = useState<ProjectMember | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchMember = async () => {
        try {
          if (!userId || !projectId) return;
          const data = await getProjectMemberDetails(projectId, userId);
          setMemberData(data);
        } catch (error) {
          console.error('Failed to fetch project member data', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMember();
    }, [projectId, userId, refreshTrigger]);
  
    if (loading) return <div>Loading remaining budget...</div>;
  
    return (
      <div className="mt-4 p-4 rounded-xl bg-white shadow w-full max-w-sm">
        <p className="text-lg font-medium text-gray-800">Budget Anda:</p>
        <p className="text-2xl font-bold text-[#2A7D8C]">
          {memberData ? `Rp ${memberData.budget.toLocaleString('id-ID')}` : 'N/A'}
        </p>
      </div>
    );
  };
  
  export default BudgetWidget;