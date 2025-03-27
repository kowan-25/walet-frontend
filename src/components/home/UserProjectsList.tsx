"use client";

import { Project } from "@/types/project";
import Link from "next/link";
import { useState } from "react";
import { FaRegStar } from "react-icons/fa6";

interface UserProjectsListProps {
  myProjects: Project[];
  joinedProjects: Project[];
}

export default function UserProjectsList({
  myProjects,
  joinedProjects,
}: UserProjectsListProps) {
  const [activeTab, setActiveTab] = useState<"my" | "joined">("my");

  return (
    <div className="max-w-4xl max-h-[500px] min-w-[760px] self-center mb-20 mx-80 px-12 py-8 rounded-2xl bg-accent-white-rock">
      <div className="flex space-x-4 justify-center mb-4 font-semibold text-lg">
        <button
          onClick={() => setActiveTab("my")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            activeTab === "my"
              ? "bg-accent-dirty-blue text-accent-white-rock"
              : "bg-accent-white-rock text-accent-dirty-blue"
          }`}
        >
          <span>
            <FaRegStar className="text-lg" />
          </span>
          <span>My Projects</span>
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            activeTab === "joined"
              ? "bg-accent-dirty-blue text-accent-white-rock"
              : "bg-accent-white-rock text-accent-dirty-blue"
          }`}
        >
          <span>
            <FaRegStar className="text-lg" />
          </span>
          <span>Joined Projects</span>
        </button>
      </div>
      <div className="max-h-[380px] space-y-3 overflow-y-auto">
        {(activeTab === "my" ? myProjects : joinedProjects).map(
          (project, index) => (
            <Link
              key={index}
              href={`/dashboard/${project.id}/project-overview`}
              className="flex justify-between items-center bg-white px-8 py-6 rounded-lg shadow-md"
            >
              <div className="flex flex-col gap-y-4">
                <h3 className="text-2xl font-semibold text-black">
                  {project.name}
                </h3>
              </div>
              {project.status && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    project.status == "finished"
                      ? "bg-success text-accent-white-rock"
                      : "bg-alert text-accent-white-rock"
                  }`}
                >
                  {project.status === "finished" ? "Completed" : "On Going"}
                </span>
              )}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
