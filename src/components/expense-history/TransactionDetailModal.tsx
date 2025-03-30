"use client";

import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import Button from "@/components/buttons/Button";
import { TransactionDisplay } from "@/types/transaction";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  transaction: TransactionDisplay;
  showActions?: boolean;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  transaction,
  showActions = true,
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
        <h2 className="text-2xl font-bold text-primary-800 mb-6">Detail Transaksi</h2>

        {/* Transaction Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Jumlah Pengeluaran</h3>
            <p className="text-lg font-semibold text-gray-900">{transaction.amount}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 font-medium">Tanggal Dibuat</h3>
            <p className="text-lg text-gray-800">{transaction.created_at}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 font-medium">Kategori</h3>
            <p className="text-lg text-gray-800">{transaction.categoryName || transaction.category}</p>
          </div>

          {transaction.username && (
            <div>
              <h3 className="text-sm text-gray-500 font-medium">Anggota</h3>
              <p className="text-lg text-gray-800">{transaction.username}</p>
            </div>
          )}

          {transaction.description && (
            <div>
              <h3 className="text-sm text-gray-500 font-medium">Deskripsi</h3>
              <p className="text-lg text-gray-800">{transaction.description}</p>
            </div>
          )}
        </div>

        {showActions ? (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              size="small"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <FaTrash size={16} />
              Hapus
            </Button>

            <Button
              variant="primary"
              size="small"
              onClick={onEdit}
              className="flex text-white items-center gap-2"
            >
              <FaPencilAlt size={16} />
              Edit
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-8">
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              Tutup
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TransactionDetailModal;
