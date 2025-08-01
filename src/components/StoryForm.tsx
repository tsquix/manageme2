import { useState } from "react";
import type { Priority, Story, Status, AddEditView, Project } from "../types";
import { useProjects } from "@/contexts/ProjectContext";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

export default function StoryForm({
  storyState,
  setStoryState,
  activeProject,
  initialStory,
}: {
  storyState: AddEditView;
  setStoryState: (state: AddEditView) => void;
  activeProject: Project;
  initialStory: Story | null;
}) {
  const { updateProject } = useProjects();

  const [story, setStory] = useState<Story>(
    initialStory || {
      id: "",
      nazwa: "",
      opis: "",
      priorytet: "niski",
      projekt: activeProject.id,
      dataUtworzenia: new Date().toISOString(),
      stan: "todo",
      wlasciciel: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addStory = (s: Story) => {
    const storyWithId = { ...s, id: Date.now().toString() };
    const newStory = [...(activeProject.stories || []), storyWithId];
    updateProject(activeProject.id, { stories: newStory });
    setStoryState("view");
  };

  const updateStory = (s: Story) => {
    const updatedStory = activeProject.stories.map((st: Story) =>
      st.id === s.id ? s : st
    );
    updateProject(activeProject.id, { stories: updatedStory });
    setStoryState("view");
  };

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

      <Input
        label="ID właściciela"
        name="wlasciciel"
        value={story.wlasciciel}
        onChange={handleChange}
        placeholder="ID właściciela"
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
