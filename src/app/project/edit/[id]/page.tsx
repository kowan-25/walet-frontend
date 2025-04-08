"use client";

import ProjectForm from "@/components/project/ProjectForm";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

const ProjectPage: React.FC = () => {
  const params = useParams();
  const projectId = params.id as string;

  const [initialData, setInitialData] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`api/project/${projectId}`);
        if (response.status === 200) {
          const data = response.data;
          setInitialData({
            name: data.name,
            description: data.description,
          });
        }
      } catch (error) {
        console.error("Gagal fetch data project", error);
        setError("Gagal memuat data proyek");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Terjadi Kesalahan. Silakan coba lagi.</div>;
  }

  return (
    <div className="gap-y-14 mt-36 mx-36">
      <ProjectForm
        mode="edit"
        projectId={projectId}
        initialData={initialData || { name: "", description: "" }}
      />
    </div>
  );
};

export default ProjectPage;
