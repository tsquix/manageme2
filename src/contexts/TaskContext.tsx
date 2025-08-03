import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Story, Task } from "@/types";
import axios from "axios";

interface TaskContextType {
  tasks: Task[];
  createTask: (project: Task) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedData: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const fetchTasks = async () => {
    const response = await axios.get("/api/task");
    if (response.data.success) {
      setTasks(response.data.data);
    }
  };
  useEffect(() => {
    fetchTasks();
    fetchAllStories();
  }, []);

  // const saveTasksToStorage = (tasksData: Task[]) => {
  //   localStorage.setItem("tasks", JSON.stringify(tasksData));
  //   setTasks(tasksData);
  // };

  const createTask = async (task: Task) => {
    console.log(task);
    const response = await axios.post("/api/task", task);

    setTasks((prev) => [...prev, response.data.data]);
  };

  const updateTask = async (id: string, updatedData: Partial<Task>) => {
    const response = await axios.put("/api/task", {
      updatedData,
      id: id,
    });
    if (response.data.success) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, ...updatedData } : task
        )
      );
    }
  };
  const deleteTask = async (id: string) => {
    const response = await axios.delete("/api/task", { data: { id } });
    if (response.data.success) {
      setTasks((prev) => prev.filter((task) => task._id !== id));
    }
  };
  const fetchAllStories = async () => {
    const response = await axios.get("/api/story");
    if (response.data.success) {
      setStories(response.data.data);
    }
  };
  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        stories,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
