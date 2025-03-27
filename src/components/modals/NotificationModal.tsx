import React from "react";
import Button from "../buttons/Button";
import { FaCheckCircle } from "react-icons/fa";
import { IoAlertCircleSharp, IoClose } from "react-icons/io5";

interface NotificationModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  buttonMessage: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  isSuccess,
  message,
  buttonMessage = "Close",
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/50 absolute inset-0"></div>

      <div className="relative bg-white p-10 rounded-xl shadow-lg md:w-1/2 lg:w-1/3 max-w-full z-50 space-y-8" role="dialog">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        <div className="flex items-center justify-center mb-4">
          {isSuccess ? (
            <FaCheckCircle className="text-success" size={85} data-testid="success-icon" />
          ) : (
            <IoAlertCircleSharp className="text-alert" size={85} data-testid="error-icon" />
          )}
        </div>

        <div>
          <h3 className="text-center text-4xl text-gray-900">
            {isSuccess ? "Success" : "Failed"}
          </h3>
          <p className="text-center text-base text-gray-600 mt-2">{message}</p>
        </div>

        <div className="mt-6 flex justify-center text-white">
          <Button onClick={onClose} className="bg-accent-dirty-blue px-12">
            {buttonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
