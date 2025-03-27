import { Project } from "@/types/project";

interface ProjectInfoProps {
  myProjects: Project[];
  joinedProjects: Project[];
  fundsManaged: number;
}

export default function ProjectInfoSection({
  myProjects,
  joinedProjects,
  fundsManaged,
}: ProjectInfoProps) {
  const allProjects = [...myProjects, ...joinedProjects];

  const activeProjects = allProjects.filter(
    (project) => project.status === "not finish"
  ).length;

  const participatedProjects = allProjects.length;
  return (
    <div className="flex mx-36 px-7 py-8 font-semibold bg-gradient-to-r from-accent-dirty-blue to-primary rounded-3xl">
      <div className="flex-1 text-center">
        <div className="border-r-3 border-accent-white-rock">
          <h3 className="text-4xl font-semibold pt-1 text-accent-white-rock">
            {activeProjects}
          </h3>
          <p className="text-2xl py-3 text-accent-white-rock">
            Active Projects
          </p>
        </div>
      </div>

      <div className="flex-1 text-center">
        <div className="border-r-3 border-accent-white-rock">
          <h3 className="text-4xl pt-1 font-semibold text-accent-white-rock">
            {participatedProjects}
          </h3>
          <p className="text-2xl py-3 text-accent-white-rock">
            Participated Projects
          </p>
        </div>
      </div>

      <div className="flex-1 text-center">
        <div>
          <h3 className="text-4xl pt-1 font-semibold text-accent-white-rock">
            {fundsManaged.toLocaleString()}
          </h3>
          <p className="text-2xl py-3 text-accent-white-rock">Funds Managed</p>
        </div>
      </div>
    </div>
  );
}
