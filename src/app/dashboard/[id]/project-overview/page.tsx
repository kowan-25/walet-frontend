"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import useUser from "@/hooks/useUser";
import Button from "@/components/buttons/Button";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Link from "next/link";
import CategoryManager from "./CategoryManager";

export default function ProjectDetailPage() {
  const { userId } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [projectData, setProjectData] = useState<{
    id: string;
    name: string;
    description: string;
    total_budget: number;
    status: boolean;
    created_at: string;
  } | null>(null);

  const [isManager, setIsManager] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`api/project/${id}`);
        if (response.status === 200) {
          const data = response.data;
          setProjectData(data);
          setIsManager(data.manager === userId);
        }
      } catch (error) {
        console.error("Gagal fetch data project", error);
        setError("Gagal memuat data proyek");
      } finally {
        setIsLoading(false);
      }
    };

    if (id && userId) {
      fetchProjectData();
    }
  }, [id, userId]);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/project/delete/${id}`);
      setIsDeleteModalOpen(false);
      router.push("/home");
    } catch (error) {
      console.error("Gagal menghapus proyek", error);
      setIsDeleteModalOpen(false);
      setError("Gagal menghapus proyek");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !projectData || isManager === null) {
    return <div>{error || "Data proyek tidak ditemukan"}</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">{projectData.name}</h1>
        {isManager && (
          <div className="flex gap-4">
            <Link
              href={`/project/edit/${projectData.id}`}
              className="bg-primary hover:bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Update Proyek
            </Link>
            <Button
              onClick={handleOpenDeleteModal}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Hapus Proyek
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-700 text-lg">{projectData.description}</p>
        <p className="text-gray-500 text-sm">
          Tanggal Mulai:{" "}
          {new Date(projectData.created_at).toLocaleDateString("id-ID")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col p-6 bg-primary-200 rounded-xl shadow">
          <span className="text-gray-600 text-sm">Total Dana Proyek</span>
          <h2 className="text-2xl font-bold text-primary mt-2">
            Rp{" "}
            {projectData.total_budget.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="flex flex-col p-6 bg-primary-200 rounded-xl shadow">
          <span className="text-gray-600 text-sm">Total Dana Terpakai</span>
          <h2 className="text-2xl font-bold text-primary mt-2">Rp 0,00</h2>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Apakah Anda yakin ingin menghapus proyek ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      
      <CategoryManager isManager={isManager} />
    </div>
  );
}
