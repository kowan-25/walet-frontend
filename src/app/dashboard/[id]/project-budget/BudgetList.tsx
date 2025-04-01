'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BudgetDetailModal from './BudgetDetailModal';
import { getProjectBudgets, deleteProjectBudget } from '@/lib/api/budgets';
import NotificationModal from '@/components/modals/NotificationModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { getProjectMembers } from '@/lib/api/members';

interface BudgetDisplay {
  id: string;
  amount: number;
  description?: string;
  created_at: string;
  is_income: boolean;
  member_name?: string;
  is_editable: boolean;
}

interface BudgetListProps {
  onEdit?: (budget: BudgetDisplay) => void;
  refreshTrigger?: number;
}

const BudgetList: React.FC<BudgetListProps> = ({ onEdit, refreshTrigger }) => {
  const params = useParams();
  const projectId = params.id as string;

  const [budgets, setBudgets] = useState<BudgetDisplay[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetDisplay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    isSuccess: true,
    message: '',
  });

  useEffect(() => {
    fetchBudgets();
  }, [projectId, refreshTrigger]);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      
      const data = await getProjectBudgets(projectId);

      const membersData = await getProjectMembers(projectId);

      const memberMap: Record<string, string> = {};
      membersData.forEach(member => {
        memberMap[member.member] = member.member_name;
      });
      
      const formattedBudgets: BudgetDisplay[] = data.map(budget => ({
        id: budget.id,
        amount: budget.amount,
        description: budget.notes || undefined,
        created_at: budget.created_at,
        is_income: budget.is_income,
        member_name: budget.member ? memberMap[budget.member] || "Anggota Tidak Ditemukan" : undefined,
        is_editable: budget.is_editable
      }));
      
      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: 'Gagal memuat data budget'
      });
    } finally {
      setIsLoading(false);
    }
  };  

  const handleRowClick = (budget: BudgetDisplay) => {
    setSelectedBudget(budget);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, budget: BudgetDisplay) => {
    e.stopPropagation();
    if (onEdit && budget.is_editable) {
      setIsDetailModalOpen(false);
      onEdit(budget);
    } else if (!budget.is_editable) {
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: 'Budget ini tidak dapat diedit'
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, budget: BudgetDisplay) => {
    e.stopPropagation();
    if (budget.is_editable) {
      setSelectedBudget(budget);
      setIsDetailModalOpen(false);
      setIsDeleteModalOpen(true);
    } else {
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: 'Budget ini tidak dapat dihapus'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedBudget) {
      try {
        setIsLoading(true);
        await deleteProjectBudget(selectedBudget.id);

        setNotification({
          isOpen: true,
          isSuccess: true,
          message: 'Budget berhasil dihapus'
        });

        fetchBudgets();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting budget:', error);
        setNotification({
          isOpen: true,
          isSuccess: false,
          message: 'Gagal menghapus budget'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  // Menghitung total budget (pemasukan - pengeluaran)
  const totalIncome = budgets
    .filter(budget => budget.is_income)
    .reduce((sum, budget) => sum + budget.amount, 0);

  const totalExpense = budgets
    .filter(budget => !budget.is_income)
    .reduce((sum, budget) => sum + budget.amount, 0);

  const totalBudget = totalIncome - totalExpense;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading && budgets.length === 0) {
    return <div className="text-center py-8">Loading budgets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Total Pemasukan */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Total Pemasukan</h3>
          </div>
          <p className="text-3xl font-extrabold text-green-600">{formatCurrency(totalIncome)}</p>
          <span className="mt-1 text-xs text-gray-500">Akumulasi seluruh pemasukan proyek</span>
        </div>

        {/* Card: Total Pengeluaran */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start border-t-4 border-red-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Total Pengeluaran</h3>
          </div>
          <p className="text-3xl font-extrabold text-red-600">{formatCurrency(totalExpense)}</p>
          <span className="mt-1 text-xs text-gray-500">Akumulasi seluruh pengeluaran proyek</span>
        </div>

        {/* Card: Sisa Budget */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <h3 className="text-base font-semibold text-gray-900 tracking-wide">Sisa Budget</h3>
          </div>
          <p className={`text-3xl font-extrabold ${totalBudget >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(totalBudget)}
          </p>
          <span className="mt-1 text-xs text-gray-500">Budget proyek yang masih tersedia</span>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada data budget untuk ditampilkan
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-200 text-primary-800">
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                  Jenis
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                  Anggota
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {budgets.map((budget) => (
                <tr
                  key={budget.id}
                  className="hover:bg-secondary-200 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(budget)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${budget.is_income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {budget.is_income ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(budget.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(budget.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 truncate max-w-[200px]">
                    {budget.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {budget.member_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    <div className="flex justify-end space-x-2">
                      {budget.is_editable && (
                        <>
                          <button
                            onClick={(e) => handleEditClick(e, budget)}
                            className="text-primary hover:text-primary-600 transition-colors"
                            aria-label="Edit"
                            disabled={isLoading}
                          >
                            <FaPencilAlt size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(e, budget)}
                            className="text-alert hover:text-red-700 transition-colors"
                            aria-label="Delete"
                            disabled={isLoading}
                          >
                            <FaTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBudget && (
        <BudgetDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          budget={selectedBudget}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          onEdit={budget => handleEditClick({ stopPropagation: () => { } } as React.MouseEvent, budget)}
          onDelete={budget => handleDeleteClick({ stopPropagation: () => { } } as React.MouseEvent, budget)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Apakah Anda yakin ingin menghapus budget ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        isSuccess={notification.isSuccess}
        message={notification.message}
        buttonMessage="Tutup"
        onClose={closeNotification}
      />
    </div>
  );
};

export default BudgetList;
