"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import Button from "@/components/buttons/Button";

interface Budget {
  id: string;
  amount: number;
  description?: string;
  created_at: string;
  is_income: boolean;
  member_name?: string;
  is_editable: boolean;
}

interface BudgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

const BudgetDetailModal: React.FC<BudgetDetailModalProps> = ({
  isOpen,
  onClose,
  budget,
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Detail Budget</h2>

        {/* Budget Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Jenis</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              budget.is_income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {budget.is_income ? 'Pemasukan' : 'Pengeluaran'}
            </span>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 font-medium">Jumlah</h3>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(budget.amount)}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 font-medium">Tanggal</h3>
            <p className="text-lg text-gray-800">{formatDate(budget.created_at)}</p>
          </div>

          {budget.member_name && (
            <div>
              <h3 className="text-sm text-gray-500 font-medium">Anggota</h3>
              <p className="text-lg text-gray-800">{budget.member_name}</p>
            </div>
          )}

          {budget.description && (
            <div>
              <h3 className="text-sm text-gray-500 font-medium">Deskripsi</h3>
              <p className="text-lg text-gray-800">{budget.description}</p>
            </div>
          )}
        </div>

        {budget.is_editable && onEdit && onDelete && (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              size="small"
              onClick={() => onDelete(budget)}
              className="flex items-center gap-2"
            >
              <FaTrash size={16} />
              Hapus
            </Button>

            <Button
              variant="primary"
              size="small"
              onClick={() => onEdit(budget)}
              className="flex text-white items-center gap-2"
            >
              <FaPencilAlt size={16} />
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetDetailModal;
