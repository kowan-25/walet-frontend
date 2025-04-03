"use client";

import HeroSection from "@/components/home/HeroSection";
import ProjectInfoSection from "@/components/home/ProjectInfoSection";
import UserProjectsList from "@/components/home/UserProjectsList";
import api from "@/lib/api";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);

  const fetchProjects = async (
    endpoint: string,
    setData: (data: Project[]) => void
  ) => {
    try {
      const response = await api.get(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      const transformedData: Project[] = data.map((project: Project) => ({
        id: project.id,
        name: project.name,
        status: project.status ? "finished" : "not finish",
        total_budget: project.total_budget,
      }));

      setData(transformedData);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects("/api/project/managed", setMyProjects);
    fetchProjects("/api/project/joined", setJoinedProjects);
  }, []);

  const fundsManaged = myProjects.reduce(
    (sum, project) => sum + project.total_budget,
    0
  );

  return (
    <div className="flex flex-col min-h-screen gap-y-14 bg-white">
      <HeroSection />
      <ProjectInfoSection
        myProjects={myProjects}
        joinedProjects={joinedProjects}
        fundsManaged={fundsManaged}
      />
      <UserProjectsList
        myProjects={myProjects}
        joinedProjects={joinedProjects}
      />
    </div>
  );
}
