import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Project, User } from "../types";
import axios from "axios";

interface ProjectContextType {
  activeProject: Project | null;
  projects: Project[];
  users: User[];
  setActiveProject: (project: Project | null) => void;
  createProject: (project: Project) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  updateProject: (id: string, updatedData: Partial<Project>) => Promise<any>;
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
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await axios.get("/api/user/all");
    if (response.data.success) {
      setUsers(response.data.data);
    }
  };

  const fetchProjects = async () => {
    const response = await axios.get("/api/project");
    if (response.data.success) {
      setProjects(response.data.data);
    }
    console.log(projects);
  };
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   if (activeProject) {
  //     localStorage.setItem("activeProject", JSON.stringify(activeProject));
  //   } else {
  //     localStorage.removeItem("activeProject");
  //   }
  // }, [activeProject]);

  const createProject = async (project: Project) => {
    try {
      const response = await axios.post("/api/project", {
        name: project.name,
        description: project.description,
      });

      setProjects((prev) => [...prev, response.data.data]);

      return response.data;
    } catch (error) {
      console.error("Błąd tworzenia projektu:", error);
      throw error;
    } finally {
    }
  };
  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p._id !== id);
    setProjects(updated);
    await axios.delete("/api/project", { data: { id } });
    // if (activeProject?.id === id) {
    //   setActiveProjectState(null);
    //   localStorage.removeItem("activeProject");
    // }
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, ...updatedData } : project
        )
      );
      await axios.put("/api/project", { id, updatedData });
    } catch (error) {
      fetchProjects();
      throw error;
    }

    // if (activeProject?.id === id) {
    //   const updatedProject = updated.find((p) => p.id === id) || null;
    //   setActiveProjectState(updatedProject);
    //   if (updatedProject) {
    //     localStorage.setItem("activeProject", JSON.stringify(updatedProject));
    //   }
    // }
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
        users,
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
