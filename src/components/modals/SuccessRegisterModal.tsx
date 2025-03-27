import React, { useEffect, useState } from "react";
import Button from "../buttons/Button";
import { HiMailOpen } from "react-icons/hi";
import { IoAlertCircleSharp, IoClose } from "react-icons/io5";

interface SuccessRegisterModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  buttonMessage: string;
  onClose: () => void;
}

const SuccessRegisterModal: React.FC<SuccessRegisterModalProps> = ({
  isOpen,
  isSuccess,
  message,
  buttonMessage = "Close",
  onClose,
}) => {
  const [canClose, setCanClose] = useState(!isSuccess);
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    if (isOpen && isSuccess) {
      setCanClose(false);
      setTimer(5);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/50 absolute inset-0"></div>

      <div
        className="relative bg-white p-10 rounded-xl shadow-lg md:w-1/2 lg:w-1/3 max-w-full z-50 space-y-8"
        role="dialog"
      >
        <button
          onClick={onClose}
          disabled={!canClose}
          className={`absolute top-4 right-4 transition-colors cursor-pointer ${
            canClose ? "text-gray-400 hover:text-gray-600" : "text-gray-300 cursor-not-allowed"
          }`}
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        <div className="flex items-center justify-center mb-4">
          {isSuccess ? (
            <HiMailOpen className="text-success" size={85} data-testid="email-success-icon" />
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
          <Button
            onClick={onClose}
            className="bg-accent-dirty-blue px-12"
            disabled={!canClose}
          >
            {canClose ? buttonMessage : `Read first! (${timer})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessRegisterModal;
