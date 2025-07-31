import { AddEditView, Task, User } from "@/types";
import Select from "./ui/Select";
import { useEffect, useState } from "react";
import TasksForm from "./TasksForm";
import { useTasks } from "@/contexts/TaskContext";

export default function TaskCard({
  taskId,
  setEditedTask,
  setTaskState,
  taskState,
}: {
  taskId: string;
  setEditedTask: (task: Task | null) => void;
  setTaskState: (value: AddEditView) => void;
  taskState: AddEditView;
}) {
  const { tasks } = useTasks();
  const task = tasks.find((t) => t.id === taskId);
  const { deleteTask } = useTasks();

  if (!task) {
    return <h2 className="p-4">select task to see details</h2>;
  }
  if (task) {
    return (
      <>
        <div className="p-4">
          <h2 className="mb-4">task details:</h2>
          <p>nazwa: {task.nazwa}</p>
          <p>opis: {task.opis}</p>
          <p>Priorytet: {task.priorytet}</p>
          <p>id przypis story: {task.storyID}</p>
          <p>przewidywany czas: {task.przewidywanyCzas} h</p>
          <p>Stan: {task.stan}</p>
          <p>
            data dodania:{" "}
            {new Date(task.dataDodania).toLocaleDateString("pl-PL")}
          </p>
          <p>data startu {task.dataStartu}</p>
          <p>data zakonczenia {task.dataZakonczenia}</p>
          <p>uztykownik: {task.odpowiedzialnyUzytkownik}</p>
          <div className=" flex gap-4">
            <button onClick={() => deleteTask(task.id)} className="bg-red-300">
              delete
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
              className="bg-blue-300"
            >
              {taskState === "edit" ? "Cancel Edit" : "Edit Task"}
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
      </>
    );
  }
}
