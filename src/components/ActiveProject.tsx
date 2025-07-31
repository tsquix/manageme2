import { useProjects } from "@/contexts/ProjectContext";
import type { Project, User, Story, AddEditView } from "../types/index";
import StoryForm from "./StoryForm";
import { useEffect, useState } from "react";

export default function ActiveProject({
  activeProject,
}: {
  activeProject: Project;
}) {
  const { updateProject, setActiveProject } = useProjects();
  const [storyState, setStoryState] = useState<AddEditView>("view");
  const [editedStory, setEditedStory] = useState<Story | null>(null);
  const [filteredStories, setFilteredStories] = useState<Story[]>(
    activeProject.stories || []
  );

  useEffect(() => {
    console.log(storyState);
  }, [storyState]);

  useEffect(() => {
    setFilteredStories(activeProject.stories || []);
  }, [activeProject]);

  const deleteStory = (id: string) => {
    const updated = activeProject.stories.filter((st) => st.id !== id);
    updateProject(activeProject.id, { stories: updated });
  };

  const handleSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilteredStories(activeProject.stories || []);
      return;
    }
    const filtered = (activeProject.stories || []).filter(
      (story) => story.stan === value
    );
    setFilteredStories(filtered);
  };

  return (
    <div>
      <button onClick={() => setActiveProject(null)} className="mb-2">
        {" "}
        go back
      </button>
      <div className="border p-2 mb-2 max-w-lg flex ">
        <div>
          <h3 className="font-bold">id: {activeProject.id}</h3>
          <h3 className="font-bold">name: {activeProject.name}</h3>
          <p>desc: {activeProject.description}</p>
          <div className="mb-6">
            <h4 className="font-semibold text-lg">Stories:</h4>
            <div>
              {" "}
              <p className="text-lightGray mb-1">Opinie</p>
              <select
                className="text-black bg-white rounded-lg p-2 border w-full  border-gray-700"
                onChange={handleSort}
              >
                <option value="">Filtruj</option>

                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>
            </div>
            {activeProject.stories?.length > 0 ? (
              <ul className="space-y-2">
                {filteredStories.map((story) => (
                  <li key={story.id} className="border p-2">
                    <strong>id: {story.id}</strong>
                    <p>{story.nazwa}</p>
                    <p>{story.opis}</p>
                    <p>Stan: {story.stan}</p>
                    <p>Priorytet: {story.priorytet}</p>
                    <div className=" flex gap-4">
                      <button
                        onClick={() => deleteStory(story.id)}
                        className="bg-red-300"
                      >
                        delete
                      </button>

                      <button
                        onClick={() => {
                          if (storyState === "view") {
                            setEditedStory(story);
                            setStoryState("edit");
                          } else if (editedStory === story) {
                            setStoryState("view");
                            setEditedStory(null);
                          }
                        }}
                        className="bg-blue-300"
                      >
                        {storyState === "edit" && editedStory === story
                          ? "Cancel Edit"
                          : "Edit Story"}
                      </button>
                    </div>
                  </li>
                ))}
                <div
                  className="border p-2 w-[150px] h-[150px] bg-amber-100 flex justify-center items-center hover:bg-amber-50 "
                  onClick={() => {
                    if (storyState === "view") {
                      setStoryState("add");
                    } else {
                      setStoryState("view");
                    }
                  }}
                >
                  <div className="justify-center items-center w-[75px] h-[25px] bg-gray-300 px-4"></div>
                  <div className="absolute w-[25px] h-[75px] bg-gray-300 "></div>
                </div>
              </ul>
            ) : (
              <>
                <p className="text-gray-500">Brak historii.</p>
                <div
                  className="border p-2 w-[150px] h-[150px] bg-amber-100 flex justify-center items-center hover:bg-amber-50 "
                  onClick={() =>
                    setStoryState(storyState === "add" ? "view" : "add")
                  }
                >
                  <div className="justify-center items-center w-[75px] h-[25px] bg-gray-300 px-4"></div>
                  <div className="absolute w-[25px] h-[75px] bg-gray-300 "></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {(storyState === "add" || storyState === "edit") && (
          <StoryForm
            activeProject={activeProject}
            storyState={storyState}
            setStoryState={setStoryState}
            initialStory={editedStory}
          />
        )}
      </div>
    </div>
  );
}
