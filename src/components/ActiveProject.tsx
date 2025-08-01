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
      <button
        onClick={() => setActiveProject(null)}
        className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
      >
        {/* Ikona strzałki w lewo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Powrót
      </button>
      <div className="border p-4 mb-4 max-w-2xl rounded-xl shadow bg-white">
        <div>
          <h3 className="font-bold text-blue-700 text-lg mb-1">
            ID: {activeProject.id}
          </h3>
          <h3 className="font-bold text-xl mb-2">{activeProject.name}</h3>
          <p className="text-gray-600 mb-4">{activeProject.description}</p>
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Stories:</h4>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Filtruj po stanie:
              </label>
              <select
                className="text-black bg-white rounded-lg p-2 border w-full border-gray-300 focus:ring-2 focus:ring-blue-200"
                onChange={handleSort}
              >
                <option value="">Wszystkie</option>
                <option value="todo">Todo</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>
            {activeProject.stories?.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredStories.map((story) => (
                  <li
                    key={story.id}
                    className="border rounded-lg shadow p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">
                        ID: {story.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          story.priorytet === "wysoki"
                            ? "bg-red-200 text-red-800"
                            : story.priorytet === "średni"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {story.priorytet}
                      </span>
                    </div>
                    <h5 className="font-bold text-blue-700 mb-1">
                      {story.nazwa}
                    </h5>
                    <p className="text-gray-700 mb-2">{story.opis}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Stan:{" "}
                        <span className="font-semibold">{story.stan}</span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="px-2 py-1 rounded bg-red-200 hover:bg-red-400 text-red-900 text-xs transition"
                          title="Usuń"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
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
                          className="px-2 py-1 rounded bg-blue-200 hover:bg-blue-400 text-blue-900 text-xs transition"
                          title="Edytuj"
                        >
                          {storyState === "edit" && editedStory === story
                            ? "Anuluj"
                            : "Edytuj"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                <li>
                  <button
                    className="w-full h-full min-h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                    onClick={() =>
                      setStoryState(storyState === "add" ? "view" : "add")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500 mb-1"
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
                    <span className="text-blue-700 font-semibold">
                      Dodaj nową historię
                    </span>
                  </button>
                </li>
              </ul>
            ) : (
              <>
                <p className="text-gray-500 mb-2">Brak historii.</p>
                <button
                  className="w-full h-[120px] flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                  onClick={() =>
                    setStoryState(storyState === "add" ? "view" : "add")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500 mb-1"
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
                  <span className="text-blue-700 font-semibold">
                    Dodaj nową historię
                  </span>
                </button>
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
