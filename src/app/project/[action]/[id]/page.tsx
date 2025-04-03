"use client";

import ProjectForm from "@/components/project/ProjectForm";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

const ProjectPage: React.FC = () => {
  const params = useParams();
  const action = typeof params?.action === "string" ? params.action : undefined;
  const id = typeof params?.id === "string" ? params.id : undefined;

  const mode: "create" | "edit" = action === "edit" && id ? "edit" : "create";
  const projectId: string | null = id || null;

  const [initialData, setInitialData] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (mode === "edit" && projectId) {
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
      }
    };

    fetchProjectData();
  }, [mode, projectId]);

  if (action !== "edit" || !id) {
    return (
      <div>
        Invalid route. Please use /home/project/create for creating a project.
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="gap-y-14 mt-36 mx-36">
      <ProjectForm
        mode={mode}
        projectId={projectId}
        initialData={initialData || { name: "", description: "" }}
      />
    </div>
  );
};

export default ProjectPage;
