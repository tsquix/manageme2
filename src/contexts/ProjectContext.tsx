import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Project, Story, User } from "../types";
import axios from "axios";
import { useSession } from "next-auth/react";

interface ProjectContextType {
  activeProject: Project | null;
  projects: Project[];
  users: User[];
  setActiveProject: (project: Project | null) => void;
  createProject: (project: Project) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  updateProject: (id: string, updatedData: Partial<Project>) => Promise<any>;
  isGuest: boolean;
  setStories: (story: Story | null) => void;
  stories: Story[];
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
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const isGuest = session?.user?.role === "guest";

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
  };
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

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
    await axios.delete("/api/project", { data: { id } });
    await deleteStories(id);

    const updated = projects.filter((p) => p._id !== id);
    setProjects(updated);

    if (activeProject?.id === id) {
      setActiveProjectState(null);
      localStorage.removeItem("activeProject");
    }
  };

  const deleteStories = async (projectId: string) => {
    await axios.delete("/api/story", { data: { projectId } });

    const updated = stories.filter((st) => st.projekt !== projectId);
    setStories(updated);
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
        isGuest,
        stories,
        setStories,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
