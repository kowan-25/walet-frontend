'use client';

import React, { useState } from 'react';
import Input from '@/components/inputs/Input';
import Button from '@/components/buttons/Button';
import api from '@/lib/api';
import { useRouter } from "next/navigation";
import SuccessRegisterModal from '@/components/modals/SuccessRegisterModal';
import Image from 'next/image';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();

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

    if (isSuccess){
      router.push("/login")
      setIsSubmitting(false);
    } else{
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmPasswordError('');

    const newErrors: { 
      username?: string; email?: string; password?: string; confirmPassword?: string;
    } = {};

    if (!form.username) {
      newErrors.username = "Username is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else { 
      if (!isSubmitting) {

        setIsSubmitting(true);

        const requestBody = {
          username: form.username,
          email: form.email,
          password: form.password,
        };
        
        try {
          const response = await api.post("/api/auth/register", {
            "username": requestBody.username,
            "email": requestBody.email,
            "password": requestBody.password
          })
    
          if (response.status === 201){
            console.log(response.data);
            
            setForm({
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            })
            setModalMessage("User successfully registered! Check your email to verify your account!")
            setIsSuccess(true)
            setIsModalOpen(true)
          }
        } catch (error: any) {
          console.log(error);
          setModalMessage("An error occurred")
          setIsSuccess(false)
          setIsModalOpen(true)
        }
      }
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-primary-200">
      <SuccessRegisterModal 
        isOpen={isModalOpen} 
        isSuccess={isSuccess} 
        message={modalMessage} 
        buttonMessage={"Close"} 
        onClose={handleModalClose} 
      />
  
      <div className="w-full max-w-4xl my-[200px] px-20 p-8 bg-white rounded-2xl shadow-xl flex flex-col gap-8">
        <div className='flex justify-center'>
          <Image
            src="/logo/logo-walet.svg"
            alt="Walet Logo"
            width={120}
            height={120}
            className="mb-2"
          />
        </div>
        <h1 className="text-3xl font-bold text-center">Register</h1>
  
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <Input
                label="Username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                error={errors.username}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
  
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                error={confirmPasswordError}
              />
              <div className="text-sm text-gray-600 bg-gray-100 rounded-md p-3 border border-gray-300">
                <p className="mb-1 font-medium">Your password must contain:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character (e.g. <code className="text-xs text-gray-700">% & !</code>)</li>
                </ul>
              </div>
            </div>
          </div>
  
          <div className='flex flex-col items-center justify-center gap-4 mt-4'>
            <Button
              type="submit"
              className={`text-white ${!isSubmitting ? "bg-accent-dirty-blue" : "bg-gray-400"} w-full max-w-md`}
              disabled={isSubmitting}
            >
              {!isSubmitting ? "Register" : "Registering..."}
            </Button>
  
            <p className="text-sm text-gray-700">
              Sudah punya akun?{" "}
              <a href="/login" className="text-primary-800 font-semibold hover:underline">
                Login di sini
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
