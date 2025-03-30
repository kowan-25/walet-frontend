'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ExpenseList from '@/components/expense-history/ExpenseList';
import Button from "@/components/buttons/Button";
import { FaPlus } from "react-icons/fa";
import TransactionModal, { TransactionFormData } from '@/components/expense-history/TransactionModal';
import NotificationModal from '@/components/modals/NotificationModal';
import { useProjectRole } from '../layout';
import useUser from '@/hooks/useUser';
import { CreateTransactionPayload, Transaction } from '@/types/transaction';
import api from '@/lib/api';

const createTransaction = async (data: CreateTransactionPayload): Promise<Transaction> => {
    try {
      const response = await api.post('/api/funds/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

const ExpenseHistoryPage = () => {
  const { isManager, isLoading: isLoadingRole } = useProjectRole();
  const { userId } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState({
    isOpen: false,
    isSuccess: true,
    message: '',
  });
  const params = useParams();
  const projectId = params.id as string;

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      setIsLoading(true);

      const numericAmount = parseInt(data.amount.replace(/[^0-9]/g, ''));

      await createTransaction({
        project_id: projectId,
        amount: numericAmount,
        transaction_note: data.description,
        category_id: data.category
      });

      setRefreshTrigger(prev => prev + 1);

      setShowAddModal(false);
      setNotification({
        isOpen: true,
        isSuccess: true,
        message: 'Transaksi berhasil ditambahkan'
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: 'Gagal menambahkan transaksi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoadingRole) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div>
      <div className="w-full flex flex-col items-start gap-[18px] p-[40px_36px] rounded-[20px] bg-gradient-to-r from-[#166088] to-[#2A7D8C] shadow-[0px_4px_12px_0px_rgba(168,213,226,0.80)]">
        <h1 className="self-stretch text-white text-[48px] font-semibold leading-normal">
          Transaction History
        </h1>
        <p className="text-white text-[18px] font-normal leading-normal max-w-[875px]">
          Rekam setiap pengeluaran Anda dengan mudah dan akurat. Dokumentasikan transaksi Anda secara transparan untuk pelacakan keuangan yang lebih baik.
        </p>
      </div>

      <div className="mt-8">
        <ExpenseList
          projectId={projectId}
          isManager={isManager}
          userId={isManager ? null : userId}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {isManager === false && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowAddModal(true)}
            className="text-white"
            disabled={isLoading}
          >
            <FaPlus size={16} />
            Tambah
          </Button>
        </div>
      )}

      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTransaction}
        isEdit={false}
        isLoading={isLoading}
      />

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

export default ExpenseHistoryPage;
