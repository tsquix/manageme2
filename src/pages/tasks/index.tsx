import { useEffect, useState } from "react";
import TasksForm from "../../components/TasksForm";
import TaskCard from "@/components/TaskCard";
import { useTasks } from "@/contexts/TaskContext";
import { AddEditView, Task } from "@/types";

export default function Tasks() {
  const { tasks } = useTasks();
  const [taskState, setTaskState] = useState<AddEditView>("view");
  const [editedTask, setEditedTask] = useState<Task | null>();
  const [selectedTask, setSelectedTask] = useState<string>();
  useEffect(() => {
    console.log(selectedTask);
  }, [selectedTask]);
  return (
    <div className=" gap-6 bg-gradient-to-br from-blue-50 to-white min-h-screen text-black p-6">
      {/* Lista zadań */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-white border rounded-xl shadow-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">Zadania</h2>
            <button
              onClick={() => {
                if (taskState === "view") {
                  setTaskState("add");
                  setEditedTask(null);
                } else {
                  setTaskState("view");
                  setEditedTask(null);
                }
              }}
              className="flex items-center gap-2 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Dodaj zadanie
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tasks?.length > 0 ? (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    onClick={() => setSelectedTask(task._id)}
                    className={`border rounded-lg shadow p-3 cursor-pointer hover:bg-blue-50 transition ${
                      task._id === selectedTask
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-700">
                        {task.nazwa}
                      </span>
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
                    </div>
                    <div className="text-xs text-gray-400">ID: {task._id}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Brak zadań.</p>
            )}
          </div>
          {taskState === "add" && (
            <TasksForm
              taskState={taskState}
              setTaskState={setTaskState}
              editedTask={editedTask}
              setEditedTask={setEditedTask}
            />
          )}
        </div>
        {/* Szczegóły zadania */}
        <div>
          {selectedTask?.length > 0 ? (
            <TaskCard
              taskState={taskState}
              selectedTask={selectedTask}
              setEditedTask={setEditedTask}
              setTaskState={setTaskState}
            />
          ) : (
            <h2 className="p-4 text-gray-500">
              Wybierz zadanie, aby zobaczyć szczegóły
            </h2>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Kanban</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["todo", "doing", "done"].map((column) => (
            <div
              key={column}
              className={`rounded-xl p-4 shadow bg-${
                column === "todo"
                  ? "blue"
                  : column === "doing"
                  ? "yellow"
                  : "green"
              }-50 border`}
            >
              <h2 className="font-bold text-lg mb-4 capitalize text-gray-700">
                {column}
              </h2>
              {tasks
                .filter((task) => task.stan === column)
                .map((task) => (
                  <div
                    key={task._id}
                    className={`bg-white rounded-lg shadow p-4 mb-4 hover:shadow-lg transition cursor-pointer border ${
                      task._id === selectedTask
                        ? "border-blue-400 ring-2 ring-blue-200"
                        : ""
                    }`}
                    onClick={() => setSelectedTask(task._id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-700">
                        {task.nazwa}
                      </span>
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
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{task.opis}</p>
                    <div className="text-xs text-gray-400">ID: {task._id}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
