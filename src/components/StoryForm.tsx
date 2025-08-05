import { useEffect, useState } from "react";
import type { Priority, Story, Status, AddEditView, Project } from "../types";
import { useProjects } from "@/contexts/ProjectContext";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import axios from "axios";

export default function StoryForm({
  storyState,
  setStoryState,
  activeProject,
  initialStory,
  setStories,
}: {
  storyState: AddEditView;
  setStoryState: (state: AddEditView) => void;
  activeProject: Project;
  initialStory: Story | null;
}) {
  const { users } = useProjects();

  const [story, setStory] = useState<Story>(
    initialStory || {
      nazwa: "",
      opis: "",
      priorytet: "niski",
      projekt: activeProject._id,
      dataUtworzenia: new Date().toISOString(),
      stan: "todo",
      wlasciciel: null,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addStory = async (newStory: Story) => {
    if (!story.wlasciciel) {
      alert("Wybierz właściciela.");
      return;
    }

    const response = await axios.post("/api/story", newStory);
    const savedStory = response.data.data;

    setStories((prev) => [...prev, savedStory]);

    setStoryState("view");
  };

  const updateStory = async (updatedData: Story) => {
    if (!updatedData.wlasciciel) {
      alert("Wybierz właściciela.");
      return;
    }

    try {
      const response = await axios.put("/api/story", updatedData);

      if (response.data.success) {
        const serverUpdatedStory = response.data.data;

        setStories((prevStories) =>
          prevStories.map((st) =>
            st._id === serverUpdatedStory._id ? serverUpdatedStory : st
          )
        );
      }
    } catch (error) {
      console.error("Error updating story:", error);
      alert("Błąd podczas aktualizacji.");
    }

    setStoryState("view");
  };

  // czyszczenie formularza
  useEffect(() => {
    if (storyState === "add") {
      setStory({
        nazwa: "",
        opis: "",
        priorytet: "niski",
        projekt: activeProject._id,
        dataUtworzenia: new Date().toISOString(),
        stan: "todo",
        wlasciciel: null,
      });
    } else if (storyState === "edit" && initialStory) {
      setStory(initialStory);
    }
  }, [storyState, initialStory, activeProject._id]);

  const userOptions = [
    { value: "", label: "Wybierz..." },
    ...users.map((user) => ({
      value: user._id,
      label: `${user.name} - ${user.role}`,
    })),
  ];

  return (
    <div className="flex flex-col gap-4 mb-12 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        {storyState === "add" ? "Dodaj historię" : "Edytuj historię"}
      </h2>
      <Input
        label="Nazwa"
        name="nazwa"
        value={story.nazwa}
        onChange={handleChange}
        placeholder="Nazwa historii"
        className="mb-2"
      />

      <Input
        label="Opis"
        name="opis"
        value={story.opis}
        onChange={handleChange}
        placeholder="Opis historii"
        className="mb-2"
      />

      <Select
        label="Priorytet"
        name="priorytet"
        value={story.priorytet}
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
        value={story.stan}
        onChange={handleChange}
        options={[
          { value: "todo", label: "Todo" },
          { value: "doing", label: "Doing" },
          { value: "done", label: "Done" },
        ]}
        className="mb-2"
      />

      <Select
        label="Właściciel"
        name="wlasciciel"
        value={story.wlasciciel || ""}
        onChange={handleChange}
        options={userOptions}
        className="mb-2"
      />

      <div className="flex gap-3 mt-4">
        {storyState === "add" && (
          <Button
            variant="primary"
            onClick={() => addStory(story)}
            className="flex-1 py-2 text-lg"
          >
            Utwórz
          </Button>
        )}

        {storyState === "edit" && (
          <Button
            variant="success"
            onClick={() => updateStory(story)}
            className="flex-1 py-2 text-lg"
            dataTestId={"story-save"}
          >
            Zapisz
          </Button>
        )}
        <Button
          variant="danger"
          onClick={() => setStoryState("view")}
          className="flex-1 py-2 text-lg"
        >
          Anuluj
        </Button>
      </div>
    </div>
  );
}
