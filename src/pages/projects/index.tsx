import ActiveProject from "@/components/ActiveProject";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/contexts/ProjectContext";
import { useEffect } from "react";

export default function ProjectPage() {
  const { projects, activeProject, setActiveProject } = useProjects();

  useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen text-black py-8 px-4">
      {activeProject ? (
        <div className="max-w-4xl mx-auto">
          <ActiveProject activeProject={activeProject} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              proj={proj}
              showEdit
              onClick={() => setActiveProject(proj)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
