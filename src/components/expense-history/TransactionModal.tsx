"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import clsx from "clsx";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { ProjectCategory } from "@/types/category";

export const getProjectCategories = async (projectId: string): Promise<ProjectCategory[]> => {
  try {
    const response = await api.get(`/api/project/categories/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project categories:', error);
    throw error;
  }
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
  isEdit?: boolean;
  isLoading?: boolean;
}

export interface TransactionFormData {
  amount: string;
  category: string;
  description?: string;
}

const fallbackCategories = [
  { id: "default", name: "Kategori Default" }
];

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEdit = false,
  isLoading = false
}) => {
  const params = useParams();
  const projectId = params.id as string;
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        description: initialData.description || ""
      });
    } else {
      setFormData({
        amount: "",
        category: categories.length > 0 ? categories[0].id : "",
        description: "",
      });
    }
  }, [initialData, isOpen, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      
      const fetchedCategories = await getProjectCategories(projectId);
      
      if (fetchedCategories.length === 0) {
        setCategoryError("Manager belum menambahkan kategori untuk proyek ini.");
        setCategories(fallbackCategories);
      } else {
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError("Gagal memuat kategori. Silakan coba lagi nanti.");
      setCategories(fallbackCategories);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof TransactionFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.amount || isNaN(Number(formData.amount.replace(/[Rp.,]/g, "")))) {
      newErrors.amount = "Jumlah pengeluaran harus valid";
    }

    if (!formData.category) {
      newErrors.category = "Kategori harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedAmount = formData.amount.startsWith("Rp")
        ? formData.amount
        : `Rp${Number(formData.amount).toLocaleString("id-ID")}`;

      onSave({
        ...formData,
        amount: formattedAmount,
      });
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
          {isEdit ? "Edit Pengeluaran" : "Catat Pengeluaran"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
       
            <Input
              label="Jumlah Pengeluaran"
              name="amount"
              type="text"
              placeholder="Rp0"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              disabled={isLoading}
            />

            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              {isLoadingCategories ? (
                <div className="p-4 border rounded-lg text-gray-500">
                  Memuat kategori...
                </div>
              ) : categoryError ? (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-600">
                  {categoryError}
                </div>
              ) : (
                <>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={clsx(
                      "p-4 border rounded-lg focus:outline-none w-full",
                      errors.category
                        ? "border-red-500 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:ring focus:ring-secondary-200"
                    )}
                    disabled={isLoading || categories.length === 0}
                  >
                    {categories.length === 0 ? (
                      <option value="">Tidak ada kategori tersedia</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.category && (
                    <span className="text-red-500 text-sm mt-1">{errors.category}</span>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                Deskripsi Pengeluaran
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Masukkan deskripsi pengeluaran..."
                className={clsx(
                  "p-4 border rounded-lg focus:outline-none w-full",
                  errors.description
                    ? "border-red-500 focus:ring focus:ring-red-200"
                    : "border-gray-300 focus:ring focus:ring-secondary-200"
                )}
                disabled={isLoading}
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">{errors.description}</span>
              )}
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
              {isLoading ? 'Menyimpan...' : (
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

export default TransactionModal;
