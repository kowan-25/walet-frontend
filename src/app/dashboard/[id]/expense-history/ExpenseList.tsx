'use client';

import React, { useState, useEffect } from 'react';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import TransactionModal, { TransactionFormData } from './TransactionModal';
import TransactionDetailModal from './TransactionDetailModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import NotificationModal from '@/components/modals/NotificationModal';
import { getProjectTransactions, getMemberTransactions, deleteTransaction, updateTransaction } from '@/lib/api/transactions';
import { Transaction, TransactionDisplay, ProjectCategory } from '@/lib/api/types';
import { getProjectCategories } from '@/lib/api/categories';

interface ExpenseListProps {
  projectId: string;
  isManager: boolean | null;
  userId: string | null;
  refreshTrigger?: number;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ projectId, isManager, userId, refreshTrigger = 0 }) => {
  const [expenses, setExpenses] = useState<TransactionDisplay[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<TransactionDisplay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    isSuccess: true,
    message: '',
  });
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getProjectCategories(projectId);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [projectId]);
  

  useEffect(() => {
    fetchTransactions();
  }, [projectId, isManager, userId, refreshTrigger]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      let transactions: Transaction[] = [];

      if (isManager) {
        transactions = await getProjectTransactions(projectId);
      } else if (userId) {
        transactions = await getMemberTransactions(projectId, userId);
      }

      const formattedTransactions: TransactionDisplay[] = transactions.map(tx => ({
        id: tx.id,
        amount: formatCurrency(tx.amount),
        category: tx.transaction_category,
        description: tx.transaction_note || undefined,
        created_at: formatDate(tx.created_at)
      }));

      setExpenses(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: 'Gagal memuat data transaksi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleRowClick = (expense: TransactionDisplay) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (expense: TransactionDisplay) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = (expense: TransactionDisplay) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleEditFromTable = (e: React.MouseEvent, expense: TransactionDisplay) => {
    e.stopPropagation();
    handleEdit(expense);
  };

  const handleDeleteFromTable = (e: React.MouseEvent, expense: TransactionDisplay) => {
    e.stopPropagation();
    handleDelete(expense);
  };

  const confirmDelete = async () => {
    if (selectedExpense) {
      try {
        setIsLoading(true);
        await deleteTransaction(selectedExpense.id);

        setNotification({
          isOpen: true,
          isSuccess: true,
          message: 'Transaksi berhasil dihapus'
        });

        fetchTransactions();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        setNotification({
          isOpen: true,
          isSuccess: false,
          message: 'Gagal menghapus transaksi'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveTransaction = async (data: TransactionFormData) => {
    if (selectedExpense && isEditModalOpen) {
      try {
        setIsLoading(true);

        const numericAmount = parseInt(data.amount.replace(/[^0-9]/g, ''));

        await updateTransaction(selectedExpense.id, {
          amount: numericAmount,
          transaction_note: data.description,
          category_id: data.category
        });

        setNotification({
          isOpen: true,
          isSuccess: true,
          message: 'Transaksi berhasil diperbarui'
        });

        fetchTransactions(); 
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Error updating transaction:', error);
        setNotification({
          isOpen: true,
          isSuccess: false,
          message: 'Gagal memperbarui transaksi'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading && expenses.length === 0) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Belum ada transaksi untuk ditampilkan
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-200 text-primary-800">
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Jumlah Pengeluaran
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Tanggal Dibuat
              </th>
              {/* Tampilkan kolom Aksi hanya jika user adalah member (bukan manager) */}
              {isManager === false && (
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-secondary-200 transition-colors cursor-pointer"
                onClick={() => handleRowClick(expense)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {expense.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {getCategoryName(expense.category)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {expense.created_at}
                </td>
                {/* Tampilkan tombol aksi hanya jika user adalah member (bukan manager) */}
                {isManager === false && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => handleEditFromTable(e, expense)}
                        className="text-primary hover:text-primary-600 transition-colors"
                        aria-label="Edit"
                        disabled={isLoading}
                      >
                        <FaPencilAlt size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteFromTable(e, expense)}
                        className="text-alert hover:text-red-700 transition-colors"
                        aria-label="Delete"
                        disabled={isLoading}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail Modal */}
      {selectedExpense && (
        <TransactionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={() => handleEdit(selectedExpense)}
          onDelete={() => handleDelete(selectedExpense)}
          transaction={selectedExpense}
          showActions={isManager === false} 
        />
      )}

      {/* Edit Modal */}
      {selectedExpense && (
        <TransactionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={saveTransaction}
          initialData={{
            amount: selectedExpense.amount,
            category: selectedExpense.category,
            description: selectedExpense.description || '',
          }}
          isEdit={true}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Apakah Anda yakin ingin menghapus transaksi ini?"
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

export default ExpenseList;
