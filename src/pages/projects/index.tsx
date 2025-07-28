import ActiveProject from "@/components/ActiveProject";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/contexts/ProjectContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProjectPage() {
  const { projects, activeProject, setActiveProject } = useProjects();

  useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <div className="bg-white text-black">
      {activeProject ? (
        <ActiveProject activeProject={activeProject} />
      ) : (
        projects.map((proj) => (
          <ProjectCard
            key={proj.id}
            proj={proj}
            onClick={() => setActiveProject(proj)}
          />
        ))
      )}
    </div>
  );
}
