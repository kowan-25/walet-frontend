"use client";

import React from "react";
import Button from "@/components/buttons/Button";
import { IoClose } from "react-icons/io5";

interface ConfirmationModalProps {
  isOpen: boolean;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen = true,
  message = "Would you like to continue?",
  confirmLabel = "Yes",
  cancelLabel = "No",
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[400px] rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={29} />
        </button>

        <p className="mb-6 text-center text-base font-medium text-gray-900 my-5">
          {message}
        </p>

        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            outline
            className="flex-1 !border-accent-dirty-blue text-accent-dirty-blue"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-accent-dirty-blue text-white"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
