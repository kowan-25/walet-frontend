"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BudgetList from "@/components/project-budget/BudgetList";
import Button from "@/components/buttons/Button";
import { FaPlus } from "react-icons/fa";
import BudgetModal, { BudgetFormData } from "@/components/project-budget/BudgetModal";
import NotificationModal from "@/components/modals/NotificationModal";
import { useProjectRole } from "../layout";
import api from "@/lib/api";
import { CreateBudgetPayload, ProjectBudget, UpdateBudgetPayload } from "@/types/projectBudget";
import { SendFundsPayload } from "@/types/fund";

const createProjectBudget = async (data: CreateBudgetPayload): Promise<ProjectBudget> => {
    try {
        const response = await api.post('/api/project/budget-record/create', data);
        return response.data;
    } catch (error) {
        console.error('Error creating budget record:', error);
        throw error;
    }
};

const updateProjectBudget = async (
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

const sendFunds = async (projectId: string, data: SendFundsPayload) => {
    try {
      const response = await api.post(`/api/funds/send-funds/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error sending funds:", error);
      throw error;
    }
};
  
const takeFunds = async (projectId: string, data: SendFundsPayload) => {
    try {
      const response = await api.post(`/api/funds/take-funds/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error sending funds:", error);
      throw error;
    }
};

const ProjectBudgetPage = () => {
  const { isManager, isLoading: isLoadingRole } = useProjectRole();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    isSuccess: true,
    message: "",
  });
  const [editingBudget, setEditingBudget] = useState<any>(null);

  useEffect(() => {
    if (!isLoadingRole && isManager === false) {
      router.push("/unauthorized");
    }
  }, [isLoadingRole, isManager, router]);

  if (isLoadingRole) {
    return <div className="p-8">Loading...</div>;
  }

  if (isManager === false) {
    return null;
  }

  const handleAddBudget = async (data: BudgetFormData) => {
    try {
      setIsLoading(true);

      if (editingBudget) {
        await updateProjectBudget(editingBudget.id, {
          amount: data.amount,
          notes: data.notes,
        });

        setNotification({
          isOpen: true,
          isSuccess: true,
          message: "Budget berhasil diperbarui",
        });
        setRefreshTrigger((prev) => prev + 1);
      } else {
        if (!data.is_income && data.member_id) {
          try {
            if (data.transaction_type === "take_fund") {
              await takeFunds(projectId, {
                member_id: data.member_id,
                funds: data.amount,
                notes: data.notes || "-",
              });
              setNotification({
                isOpen: true,
                isSuccess: true,
                message: "Dana berhasil diambil dan dikirim ke anggota",
              });
            } else if (data.transaction_type === "expense") {
              await sendFunds(projectId, {
                member_id: data.member_id,
                funds: data.amount,
                notes: data.notes || "-",
              });
              setNotification({
                isOpen: true,
                isSuccess: true,
                message:
                  "Budget berhasil dikurangi & dana berhasil dikirim ke anggota",
              });
            }
            setRefreshTrigger((prev) => prev + 1);
          } catch (fundsError) {
            setNotification({
              isOpen: true,
              isSuccess: false,
              message:
                data.transaction_type === "take_fund"
                  ? "Gagal mengambil dana. Silakan cek saldo proyek atau coba lagi."
                  : "Gagal mengirim dana ke anggota. Silakan cek saldo proyek atau coba lagi.",
            });
          }
        } else {
          await createProjectBudget({
            project_id: projectId,
            amount: data.amount,
            notes: data.notes,
            is_income: data.is_income,
            member_id: data.member_id,
          });
          setNotification({
            isOpen: true,
            isSuccess: true,
            message:
              data.transaction_type === "take_fund"
                ? "Dana berhasil diambil"
                : "Budget berhasil ditambahkan",
          });
          setRefreshTrigger((prev) => prev + 1);
        }
      }

      setShowAddModal(false);
      setEditingBudget(null);
    } catch (error) {
      console.error("Error saving budget:", error);
      setNotification({
        isOpen: true,
        isSuccess: false,
        message: editingBudget
          ? "Gagal memperbarui budget"
          : "Gagal menambahkan budget",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingBudget(null);
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div>
      <div className="w-full flex flex-col items-start gap-[18px] p-[40px_36px] rounded-[20px] bg-gradient-to-r from-[#166088] to-[#2A7D8C] shadow-[0px_4px_12px_0px_rgba(168,213,226,0.80)]">
        <h1 className="self-stretch text-white text-[48px] font-semibold leading-normal">
          Project Budget
        </h1>
        <p className="text-white text-[18px] font-normal leading-normal max-w-[875px]">
          Kelola anggaran proyek Anda dengan efisien. Catat setiap pemasukan,
          pengeluaran, atau pengambilan dana untuk memastikan proyek berjalan
          sesuai rencana keuangan.
        </p>
      </div>

      <div className="mt-8">
        <BudgetList onEdit={handleEditBudget} refreshTrigger={refreshTrigger} />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            setEditingBudget(null);
            setShowAddModal(true);
          }}
          className="text-white"
          disabled={isLoading}
        >
          <FaPlus size={16} />
          Tambah Budget
        </Button>
      </div>

      <BudgetModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleAddBudget}
        isLoading={isLoading}
        initialData={editingBudget}
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

export default ProjectBudgetPage;
