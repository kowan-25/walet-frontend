"use client";

import ProjectForm from "@/components/project/ProjectForm";
import React from "react";
import { useParams } from "next/navigation";

const ProjectPage = () => {
  const params = useParams();
  const { action } = params;

  const mode = action === "create" ? "create" : "create";
  const projectId = null;

  return (
    <div className="gap-y-14 mt-36 mx-36">
      <ProjectForm mode={mode} projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
