import { AddEditView, Task, User } from "@/types";
import Select from "./ui/Select";
import { useEffect, useState } from "react";
import TasksForm from "./TasksForm";
import { useTasks } from "@/contexts/TaskContext";
import { useProjects } from "@/contexts/ProjectContext";

export default function TaskCard({
  selectedTask,
  setEditedTask,
  setTaskState,
  taskState,
}: {
  selectedTask: string;
  setEditedTask: (task: Task | null) => void;
  setTaskState: (value: AddEditView) => void;
  taskState: AddEditView;
}) {
  const { tasks, stories } = useTasks();
  const { users } = useProjects();
  const task = tasks.find((t) => t._id === selectedTask);
  const { deleteTask } = useTasks();

  useEffect(() => {
    console.log("xd");
    console.log(stories);
  }, [stories]);
  if (!task) {
    return (
      <h2 className="p-4 text-gray-500">
        Wybierz zadanie, aby zobaczyć szczegóły
      </h2>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto mb-6 border">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">{task.nazwa}</h2>
      <p className="text-gray-700 mb-2">{task.opis}</p>
      <div className="flex gap-2 mb-2">
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            task.priorytet === "wysoki"
              ? "bg-red-200 text-red-800"
              : task.priorytet === "średni"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {task.priorytet}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            task.stan === "done"
              ? "bg-green-200 text-green-800"
              : task.stan === "doing"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {task.stan}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-2">
        <div>
          <span className="font-semibold text-gray-600">ID:</span>{" "}
          <span className="text-gray-800">{task._id}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Story name:</span>{" "}
          <span className="text-gray-800">
            {stories.find((s) => s._id === task.storyId).nazwa || "Brak"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            Przewidywany czas:
          </span>{" "}
          <span className="text-gray-800">{task.przewidywanyCzas} h</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Odpowiedzialny:</span>{" "}
          <span className="text-gray-800">
            {users.find((u) => u._id === task.odpowiedzialnyUzytkownik)?.name ||
              "Brak"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Data dodania:</span>{" "}
          <span className="text-gray-800">
            {new Date(task.createdAt).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Data startu:</span>{" "}
          <span className="text-gray-800">
            {task.dataStartu
              ? new Date(task.dataStartu).toLocaleString()
              : "Brak"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Data zakończenia:</span>{" "}
          <span className="text-gray-800">
            {task.dataZakonczenia
              ? new Date(task.dataZakonczenia).toLocaleString()
              : "Brak"}
          </span>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => deleteTask(task._id)}
          className="px-4 py-2 rounded bg-red-200 hover:bg-red-400 text-red-900 text-sm font-semibold transition"
        >
          Usuń
        </button>
        <button
          onClick={() => {
            if (taskState === "edit") {
              setEditedTask(null);
              setTaskState("view");
            } else {
              setEditedTask(task);
              setTaskState("edit");
            }
          }}
          className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-400 text-blue-900 text-sm font-semibold transition"
        >
          {taskState === "edit" ? "Anuluj edycję" : "Edytuj"}
        </button>
      </div>
      {taskState === "edit" && (
        <TasksForm
          taskState={taskState}
          setTaskState={setTaskState}
          editedTask={task}
          setEditedTask={setEditedTask}
        />
      )}
    </div>
  );
}
