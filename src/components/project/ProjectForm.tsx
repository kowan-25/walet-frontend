"use client";

import React, { useState } from "react";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { FaArrowLeftLong } from "react-icons/fa6";
import TextArea from "../inputs/TextArea";
import NotificationModal from "../modals/NotificationModal";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

interface ProjectFormProps {
  mode?: "create" | "edit";
  projectId: string | null;
  initialData?: { name: string; description: string };
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  mode = "create",
  projectId = null,
  initialData = { name: "", description: "" },
}) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    general: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { name: "", description: "", general: "" };

    if (!form.name.trim()) {
      newErrors.name = "Project name is required.";
      hasError = true;
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({ name: "", description: "", general: "" });

    try {
      const requestBody = {
        name: form.name,
        description: form.description,
      };

      if (mode === "edit") {
        await api.put(`/api/project/edit/${projectId}`, requestBody);
      } else {
        await api.post("/api/project/create", requestBody);
      }

      setModalMessage(
        mode === "edit"
          ? "Project updated successfully!"
          : "Project created successfully!"
      );
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error(error);
      setModalMessage(
        `Failed to ${mode === "edit" ? "update" : "create"} project.`
      );
      setIsSuccess(false);
      setIsModalOpen(true);
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Something went wrong.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      router.push(
        mode === "edit" && projectId ? `/dashboard/${projectId}/project-overview` : "/home"
      );
    }
  };

  const handleBack = () => {
    if (mode === "create") {
      router.back();
    } else if (mode === "edit" && projectId) {
      router.push(`/dashboard/${projectId}/project-overview`);
    }
  };

  return (
    <div className="flex flex-col">
      <NotificationModal
        isOpen={isModalOpen}
        isSuccess={isSuccess}
        message={modalMessage}
        buttonMessage={"Close"}
        onClose={handleModalClose}
      />
      
      <div className="w-full max-full flex flex-col gap-6 p-12">
        <h1 className="text-4xl font-semibold text-center self-start flex gap-5 items-center">
          <HiOutlineWrenchScrewdriver />
          {mode === "edit" ? "Edit Proyek" : "Buat Proyek Baru"}
        </h1>
        <hr className="border-gray-300" />
        <form onSubmit={handleSubmit}>
          <div className="mt-8 flex flex-col gap-4">
            <Input
              label="Nama Proyek"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isLoading}
            />
            <TextArea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              label="Deskripsi Proyek"
              error={errors.description}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between w-full mt-20">
            <Button
              onClick={handleBack}
              className="border-accent-dirty-blue border-2 bg-transparent text-accent-dirty-blue"
              disabled={isLoading}
            >
              <FaArrowLeftLong /> <span>Kembali</span>
            </Button>
            <Button
              type="submit"
              className="text-white bg-accent-dirty-blue"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : mode === "edit"
                ? "Update Proyek"
                : "Buat Proyek"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
