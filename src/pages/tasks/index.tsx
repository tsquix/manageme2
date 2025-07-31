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
    console.log(tasks);
  }, [tasks]);
  return (
    <div>
      <div className="grid grid-cols-2 bg-white text-black">
        <div className="border p-2 mb-2 flex flex-col  ">
          <div>Tasks</div>
          <button
            onClick={() => {
              if (taskState === "view") {
                setTaskState("add");
                setEditedTask(null);
              }
              if (taskState === "add") {
                setTaskState("view");
                setEditedTask(null);
              }
            }}
          >
            add new task
          </button>
          <div>
            {tasks?.length > 0 ? (
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task.id)}>
                    <li
                      className={`border p-2 ${
                        task.id === selectedTask?.id ? "bg-green-200" : ""
                      }`}
                    >
                      <strong>idtasku: {task.id}</strong>
                      <p>nazwa: {task.nazwa}</p>
                    </li>
                  </div>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-gray-500">Brak historii.</p>
              </>
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
        {tasks?.length > 0 ? (
          <TaskCard
            taskState={taskState}
            taskId={selectedTask}
            setEditedTask={setEditedTask}
            setTaskState={setTaskState}
          />
        ) : (
          <>
            <p className="text-gray-500">Brak taskow.</p>
          </>
        )}
      </div>
      <div>
        <h1>kanban view</h1>
        <div className="grid grid-cols-3 bg-white border text-black p-4">
          {["todo", "doing", "done"].map((column) => (
            <div key={column} className="border p-2">
              <h2 className="font-bold capitalize mb-2">{column}</h2>
              {tasks
                .filter((task) => task.stan === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`border p-2 cursor-pointer mb-2 ${
                      task.id === selectedTask ? "bg-green-200" : ""
                    }`}
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <strong>{task.nazwa}</strong>
                    <p>ID: {task.id}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
