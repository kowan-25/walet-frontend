"use client";

import ProjectForm from "@/components/project/ProjectForm";
import React from "react";

const ProjectPage = () => {
  const projectId = null;

  return (
    <div className="gap-y-14 mt-36 mx-36">
      <ProjectForm projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
