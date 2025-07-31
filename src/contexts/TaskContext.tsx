import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Task } from "@/types";

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


  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks) as Task[];
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Błąd podczas parsowania zadań:", error);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  const saveTasksToStorage = (tasksData: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasksData));
    setTasks(tasksData);
  };

  const createTask = (task: Task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      dataDodania: new Date().toISOString(),
    };
    const updated = [...tasks, newTask];
    saveTasksToStorage(updated);
    return newTask;
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedData } : task
    );
    saveTasksToStorage(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((task) => task.id !== id);
    saveTasksToStorage(updated);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
