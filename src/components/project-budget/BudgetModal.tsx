"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import clsx from "clsx";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { ProjectMember } from "@/types/projectMember";

const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
    try {
      const response = await api.get(`/api/project/${projectId}/members/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project members:', error);
      throw error;
    }
  };

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => void;
  isLoading?: boolean;
  initialData?: BudgetFormData;
}

export interface BudgetFormData {
  amount: number;
  notes?: string;
  is_income: boolean;
  project_id: string;
  member_id?: string;
  transaction_type?: string;
}

interface Member {
  id: string;
  name: string;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  initialData,
}) => {
  const params = useParams();
  const projectId = params.id as string;

  const [formData, setFormData] = useState<BudgetFormData>({
    amount: 0,
    notes: "",
    is_income: false,
    project_id: projectId,
    member_id: "",
    transaction_type: "expense", // Default to expense
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof BudgetFormData, string>>
  >({});
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProjectMembers();
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          amount: initialData.amount || 0,
          notes: initialData.notes || "",
          is_income: initialData.is_income || false,
          project_id: projectId,
          member_id: initialData.member_id || "",
          transaction_type: initialData.transaction_type || "expense",
        });
      } else {
        setFormData({
          amount: 0,
          notes: "",
          is_income: false,
          project_id: projectId,
          member_id: "",
          transaction_type: "expense",
        });
      }
      setErrors({});
    }
  }, [isOpen, projectId, initialData]);

  const fetchProjectMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const projectMembers = await getProjectMembers(projectId);
      const formattedMembers = projectMembers.map((member) => ({
        id: member.member,
        name: member.member_name,
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error fetching project members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleTabChange = (type: "income" | "expense" | "take_fund") => {
    setFormData((prev) => ({
      ...prev,
      is_income: type === "income",
      transaction_type: type,
      member_id: type === "income" ? "" : prev.member_id,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof BudgetFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BudgetFormData, string>> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Jumlah harus lebih dari 0";
    }

    // If it's an expense or take fund, member is required
    if (!formData.is_income && !formData.member_id) {
      newErrors.member_id =
        "Anggota harus dipilih untuk pengeluaran atau take fund";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          {initialData ? "Edit Budget Proyek" : "Tambah Budget Proyek"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => handleTabChange("income")}
                  className={clsx(
                    "px-6 py-2.5 text-sm font-medium border border-r-0 rounded-l-md transition-colors",
                    formData.transaction_type === "income"
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                  disabled={isLoading}
                >
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("expense")}
                  className={clsx(
                    "px-6 py-2.5 text-sm font-medium border transition-colors",
                    formData.transaction_type === "expense"
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                  disabled={isLoading}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("take_fund")}
                  className={clsx(
                    "px-6 py-2.5 text-sm font-medium border rounded-r-md transition-colors",
                    formData.transaction_type === "take_fund"
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  )}
                  disabled={isLoading}
                >
                  Take Fund
                </button>
              </div>
            </div>

            <Input
              label="Jumlah"
              name="amount"
              type="number"
              placeholder="0"
              value={formData.amount || ""}
              onChange={handleChange}
              error={errors.amount}
              disabled={isLoading}
            />

            {formData.transaction_type !== "income" && (
              <div className="flex flex-col">
                <label
                  htmlFor="member_id"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Anggota{" "}
                  {formData.transaction_type !== "income" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {isLoadingMembers ? (
                  <div className="p-4 border rounded-lg text-gray-500">
                    Memuat anggota...
                  </div>
                ) : members.length === 0 ? (
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 text-yellow-700">
                    Tidak ada anggota dalam proyek ini. Tambahkan anggota
                    terlebih dahulu.
                  </div>
                ) : (
                  <>
                    <select
                      id="member_id"
                      name="member_id"
                      value={formData.member_id || ""}
                      onChange={handleChange}
                      className={clsx(
                        "p-4 border rounded-lg focus:outline-none w-full",
                        errors.member_id
                          ? "border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:ring focus:ring-secondary-200"
                      )}
                      disabled={
                        isLoading || formData.transaction_type === "income"
                      }
                    >
                      <option value="">-- Pilih Anggota --</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                    {errors.member_id && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.member_id}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Deskripsi (Opsional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes || ""}
                onChange={handleChange}
                placeholder="Masukkan deskripsi budget..."
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-secondary-200 w-full"
                disabled={isLoading}
                maxLength={50}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.notes?.length || 0}/50 karakter
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              variant="primary"
              size="medium"
              type="submit"
              className="text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <>
                  <FaCheck size={16} />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
