import { useEffect, useState } from "react";
import type { AddEditView, Task, User } from "../types";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { useTasks } from "@/contexts/TaskContext";
const users: User[] = [
  {
    id: "0",
    firstName: "Jan",
    lastName: "Kowalski",
    role: "admin",
  },
  {
    id: "1",
    firstName: "Mariusz",
    lastName: "Trynalski",
    role: "developer",
  },
  {
    id: "2",
    firstName: "Arkadiusz",
    lastName: "Krawiec",
    role: "devops",
  },
];
export default function TasksForm({
  taskState,
  setTaskState,
  editedTask,
  setEditedTask,
}: {
  editedTask: Task | null;
  setEditedTask: (task: Task | null) => void;
  setTaskState: (value: AddEditView) => void;
  taskState: AddEditView;
}) {
  const { updateTask, createTask } = useTasks();
  const initialTask: Task = {
    id: "",
    nazwa: "",
    opis: "",
    priorytet: "niski",
    storyID: "",
    przewidywanyCzas: 0,
    stan: "todo",
    dataDodania: new Date().toISOString(),
  };
  const [newTask, setNewTask] = useState<Task>(
    editedTask || {
      id: "",
      nazwa: "",
      opis: "",
      priorytet: "niski",
      storyID: "",
      przewidywanyCzas: 0,
      stan: "todo",
      dataDodania: new Date().toISOString(),
    }
  );
  useEffect(() => {
    if (newTask.stan === "done" && !newTask.dataZakonczenia) {
      setNewTask((prev) => ({
        ...prev,
        dataZakonczenia: new Date().toISOString(),
      }));
    }
    if (newTask.stan === "doing" && !newTask.dataStartu) {
      setNewTask((prev) => ({
        ...prev,
        dataStartu: new Date().toISOString(),
      }));
    }
  }, [newTask.stan]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewTask((prev) => ({
      ...prev,
      [name]: name === "przewidywanyCzas" ? parseInt(value) || 0 : value,
    }));
  };
  // filtrowanie userow zeby wyswietlac tylko dev i devops
  let userOptions = users
    .filter((user) => user.role === "developer" || user.role === "devops")
    .map((user) => ({
      value: user.name,
      label: `${user.firstName} ${user.lastName} - ${user.role}`,
    }));

  if (!newTask.odpowiedzialnyUzytkownik) {
    userOptions = [{ value: "", label: "Wybierz..." }, ...userOptions];
  } else {
    userOptions = userOptions.sort((a, b) => {
      if (a.value === newTask.odpowiedzialnyUzytkownik) return -1;
      if (b.value === newTask.odpowiedzialnyUzytkownik) return 1;
      return 0;
    });
  }

  return (
    <div className="flex flex-col gap-4 mb-12 max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        {taskState === "add" ? "Dodaj zadanie" : "Edytuj zadanie"}
      </h2>
      <Input
        label="Nazwa"
        name="nazwa"
        value={newTask.nazwa}
        onChange={handleChange}
        placeholder="Nazwa zadania"
        className="mb-2"
      />
      <Input
        label="Opis"
        name="opis"
        value={newTask.opis}
        onChange={handleChange}
        placeholder="Opis zadania"
        className="mb-2"
      />
      <Input
        label="ID Story"
        name="storyID"
        value={newTask.storyID}
        onChange={handleChange}
        placeholder="ID powiązanej historyjki"
        className="mb-2"
      />
      <Input
        label="Przewidywany czas (h)"
        name="przewidywanyCzas"
        type="number"
        value={newTask.przewidywanyCzas.toString()}
        onChange={handleChange}
        placeholder="np. 3"
        className="mb-2"
      />
      <Select
        label="Priorytet"
        name="priorytet"
        value={newTask.priorytet}
        onChange={handleChange}
        options={[
          { value: "niski", label: "Niski" },
          { value: "średni", label: "Średni" },
          { value: "wysoki", label: "Wysoki" },
        ]}
        className="mb-2"
      />
      <Select
        label="Stan"
        name="stan"
        value={newTask.stan}
        onChange={handleChange}
        options={[
          { value: "todo", label: "Todo" },
          { value: "doing", label: "Doing" },
          { value: "done", label: "Done" },
        ]}
        className="mb-2"
      />
      {(newTask.stan === "doing" || newTask.stan === "done") && (
        <Select
          label="Odpowiedzialny użytkownik"
          name="odpowiedzialnyUzytkownik"
          value={newTask.odpowiedzialnyUzytkownik || ""}
          onChange={(e) => {
            handleChange(e);
            setNewTask((prev) => ({
              ...prev,
              dataStartu: new Date().toISOString(),
            }));
          }}
          options={userOptions}
          className="mb-2"
        />
      )}
      {newTask.stan === "doing" && (
        <Input
          label="Data startu"
          name="dataStartu"
          type="datetime-local"
          value={newTask.dataStartu || ""}
          onChange={handleChange}
          className="mb-2"
        />
      )}
      {newTask.stan === "done" && (
        <Input
          label="Data zakończenia"
          name="dataZakonczenia"
          type="datetime-local"
          value={newTask.dataZakonczenia || ""}
          onChange={handleChange}
          className="mb-2"
        />
      )}
      <div className="flex gap-3 mt-4">
        {taskState === "add" && (
          <Button
            variant="primary"
            onClick={() => {
              if (newTask.nazwa.trim()) {
                createTask(newTask);
                setNewTask(initialTask);
                setTaskState("view");
              }
            }}
            className="flex-1 py-2 text-lg"
          >
            Utwórz
          </Button>
        )}
        {taskState === "edit" && (
          <Button
            variant="success"
            onClick={() => {
              updateTask(editedTask.id, newTask);
              setTaskState("view");
              setNewTask(initialTask);
              setEditedTask(null);
            }}
            className="flex-1 py-2 text-lg"
          >
            Zapisz
          </Button>
        )}
        <Button
          variant="danger"
          onClick={() => {
            setTaskState("view");
            setNewTask(initialTask);
            setEditedTask(null);
          }}
          className="flex-1 py-2 text-lg"
        >
          Anuluj
        </Button>
      </div>
    </div>
  );
}
