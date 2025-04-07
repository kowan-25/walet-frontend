'use client';

import React, { useEffect, useState } from 'react';
import Input from '@/components/inputs/Input';
import Button from '@/components/buttons/Button';
import api from '@/lib/api';
import NotificationModal from '@/components/modals/NotificationModal';
import { useParams, useRouter } from "next/navigation";
import useUser from '@/hooks/useUser';

export default function CreateBudgetRequestPage() {
  const router = useRouter()
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    request_reason: '',
    amount: '',
  });

  const [errors, setErrors] = useState<{
    request_reason?: string;
    amount?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { setId, setUsername } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

    if (isSuccess) {
      router.push(`/dashboard/${id}/fund-requests`);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      request_reason?: string;
      amount?: string;
    } = {};

    if (!form.request_reason) {
      newErrors.request_reason = "Alasan is required";
    }

    if (!form.amount) {
      newErrors.amount = "Amount is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isSubmitting) {
      setIsSubmitting(true);

      try {
        const response = await api.post("api/funds/budget-requests/create", {
          project_id: id,
          request_reason: form.request_reason,
          amount: form.amount,
        });

        if (response.status === 201) {
          console.log(response.data);
          const data = response.data

          setModalMessage("Created!");
          setIsSuccess(true);
          setIsModalOpen(true);
        }
      } catch (error: any) {
        setModalMessage("Gagal boss.");
        setIsSuccess(false);
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <NotificationModal
        isOpen={isModalOpen}
        isSuccess={isSuccess}
        message={modalMessage}
        buttonMessage={"Close"}
        onClose={handleModalClose}
      />
      <div className="w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-12">Buat Budget Request</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Alasan Pengajuan"
            name="request_reason"
            type="text"
            value={form.request_reason}
            onChange={handleChange}
            error={errors.request_reason}
          />
          <Input
            label="Jumlah Diajukan"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            error={errors.amount}
          />
          <Button type="submit" className={`text-white ${!isSubmitting ? "bg-accent-dirty-blue" : "bg-gray-400"}`} disabled={isSubmitting}>
            {!isSubmitting ? "Submit" : "Submitting"}
          </Button>
        </form>
      </div>
    </div>
  );
}
