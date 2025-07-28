// contexts/ProjectContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Project } from "../types";

interface ProjectContextType {
  activeProject: Project | null;
  projects: Project[];
  setActiveProject: (project: Project | null) => void;
  createProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updatedData: Partial<Project>) => void;
  //   addProject: (project: Project) => void;
  //   loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) setProjects(JSON.parse(saved));

    const savedActiveProject = localStorage.getItem("activeProject");
    if (savedActiveProject) {
      try {
        const parsedActiveProject = JSON.parse(savedActiveProject);
        setActiveProjectState(parsedActiveProject);
      } catch (error) {
        console.error("Błąd podczas wczytywania aktywnego projektu:", error);
        localStorage.removeItem("activeProject");
      }
    }
  }, []);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem("activeProject", JSON.stringify(activeProject));
    } else {
      localStorage.removeItem("activeProject");
    }
  }, [activeProject]);

  const saveToStorage = (projects: Project[]) => {
    localStorage.setItem("projects", JSON.stringify(projects));
    setProjects(projects);
  };

  const createProject = (project: Project) => {
    const newProject = { ...project, id: Date.now().toString() };
    const updated = [...projects, newProject];
    saveToStorage(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveToStorage(updated);
    if (activeProject?.id === id) {
      setActiveProjectState(null);
      localStorage.removeItem("activeProject");
    }
  };

  const updateProject = (id: string, updatedData: Partial<Project>) => {
    const updated = projects.map((project) =>
      project.id === id ? { ...project, ...updatedData } : project
    );
    saveToStorage(updated);
    if (activeProject?.id === id) {
      const updatedProject = updated.find((p) => p.id === id) || null;
      setActiveProjectState(updatedProject);
      if (updatedProject) {
        localStorage.setItem("activeProject", JSON.stringify(updatedProject));
      }
    }
  };

  const setActiveProject = (project: Project | null) => {
    setActiveProjectState(project);
    if (project) {
      localStorage.setItem("activeProject", JSON.stringify(project));
    } else {
      localStorage.removeItem("activeProject");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        projects,
        setActiveProject,
        createProject,
        deleteProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
