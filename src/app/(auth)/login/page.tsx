'use client';

import React, { useState } from 'react';
import Input from '@/components/inputs/Input';
import Button from '@/components/buttons/Button';
import api from '@/lib/api';
import NotificationModal from '@/components/modals/NotificationModal';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import useUser from '@/hooks/useUser';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { setId, setUsername } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      router.push("/home");
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { username?: string; password?: string } = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await api.post("/api/auth/login", form);
        if (response.status === 200) {
          const data = response.data;
          Cookies.set("accessToken", data.access);
          Cookies.set("refreshToken", data.refresh);
          const decoded: any = jwtDecode(data.access);
          setId(decoded.user_id);
          setUsername(decoded.username);
          setModalMessage("Login successful!");
          setIsSuccess(true);
          setIsModalOpen(true);
        }
      } catch (error: any) {
        setModalMessage("Login failed. Please check your credentials.");
        setIsSuccess(false);
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute inset-0 bg-primary-200 bg-opacity-40 z-10" />

      <NotificationModal
        isOpen={isModalOpen}
        isSuccess={isSuccess}
        message={modalMessage}
        buttonMessage={"Close"}
        onClose={handleModalClose}
      />

      <div className="relative z-20 w-full max-w-md my-[150px] bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6">
        <Image
          src="/logo/logo-walet.svg"
          alt="Walet Logo"
          width={120}
          height={120}
          className="mb-2"
        />
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Selamat Datang 👋
        </h1>
        <p className="text-gray-500 text-sm text-center">
          Silakan masuk ke akun Anda
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
          <Input
            label="Username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button
            type="submit"
            className={`text-white ${!isSubmitting ? "bg-accent-dirty-blue" : "bg-gray-400"}`}
            disabled={isSubmitting}
          >
            {!isSubmitting ? "Login" : "Logging in..."}
          </Button>
        </form>

        <p className="text-sm text-gray-700">
              Belum punya akun?{" "}
              <a href="/register" className="text-primary-800 font-semibold hover:underline">
                Register di sini
              </a>
        </p>
      </div>
    </div>
  );
}
