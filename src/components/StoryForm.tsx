import { useState } from "react";
import type { Priority, Story, Status } from "../types";
import { useProjects } from "@/contexts/ProjectContext";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";

export default function StoryForm({
  storyState,
  setStoryState,
  activeProject,
  initialStory,
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

  const handleChange = (e) => {
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
    <div className="flex flex-col gap-4 mb-12">
      <Input
        label="Nazwa"
        name="nazwa"
        value={story.nazwa}
        onChange={handleChange}
        placeholder="Nazwa historii"
      />
      
      <Input
        label="Opis"
        name="opis"
        value={story.opis}
        onChange={handleChange}
        placeholder="Opis historii"
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
      />
      
      <Input
        label="ID właściciela"
        name="wlasciciel"
        value={story.wlasciciel}
        onChange={handleChange}
        placeholder="ID właściciela"
      />
      
      {storyState === "add" && (
        <Button 
          variant="primary" 
          onClick={() => addStory(story)}
        >
          Utwórz
        </Button>
      )}
      
      {storyState === "edit" && (
        <Button 
          variant="success" 
          onClick={() => updateStory(story)}
        >
          Zapisz
        </Button>
      )}
    </div>
  );
}
