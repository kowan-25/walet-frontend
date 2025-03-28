// components/navigations/Sidebar.tsx
'use client';

import React from 'react';
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { FaHome, FaProjectDiagram, FaChartBar, FaHistory, FaMoneyBillWave, FaWallet, FaUsers } from "react-icons/fa";
import { useProjectRole } from '@/app/dashboard/[id]/layout';

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const id = params.id as string;
  const { isManager } = useProjectRole();
  
  const allMenuItems = [
    { name: 'Home', path: '/home', icon: <FaHome size={18} />, showFor: 'all' },
    { name: 'Project Overview', path: `/dashboard/${id}/project-overview`, icon: <FaProjectDiagram size={18} />, showFor: 'all' },
    { name: 'Manage Members', path: `/dashboard/${id}/manage-members`, icon: <FaUsers size={18} />, showFor: 'manager' },
    { name: 'Financial Analysis', path: `/dashboard/${id}/financial-analysis`, icon: <FaChartBar size={18} />, showFor: 'manager' },
    { name: 'Expense History', path: `/dashboard/${id}/expense-history`, icon: <FaHistory size={18} />, showFor: 'all' },
    { name: 'Fund Requests', path: `/dashboard/${id}/fund-requests`, icon: <FaMoneyBillWave size={18} />, showFor: 'all' },
    { name: 'Project Budget', path: `/dashboard/${id}/project-budget`, icon: <FaWallet size={18} />, showFor: 'manager' }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.showFor === 'all') return true;
    if (item.showFor === 'manager' && isManager) return true;
    if (item.showFor === 'member' && isManager === false) return true; // ga ada sih
    return false;
  });

  return (
    <div className="fixed left-8 top-[128px] h-[calc(100vh-146px)] w-64 bg-accent-white-rock shadow-sm z-40 rounded-[20px] p-4 mb-8">
      <div className="flex flex-col h-full">
        <div className="py-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === item.path 
                      ? "bg-accent-dirty-blue text-white font-semibold" 
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
                {index === 0 && (
                  <div className="border-b-[3px] border-accent-dirty-blue my-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
