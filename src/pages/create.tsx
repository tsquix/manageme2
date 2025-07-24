import { useEffect, useState } from "react";

type Project = {
  id?: string;
  name: string;
  description: string;
};

export default function Create() {
  const [newProject, setNewProject] = useState<Project>({
    name: "",
    description: "",
  });
  const [updatedProject, setUpdatedProject] = useState<Project>({
    name: "",
    description: "",
  });

  const [projects, setProjects] = useState<Array<Project>>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [state, setState] = useState<"view" | "edit">("view");

  function saveInLocalStorage(newProject: Project) {
    const existing: Array<Project> = JSON.parse(
      localStorage.getItem("projects") || "[]"
    );

    const newProjectWithId: Project = {
      id: Date.now().toString(),
      ...newProject,
    };
    existing.push(newProjectWithId);
    localStorage.setItem("projects", JSON.stringify(existing));
    setProjects(existing);

    setNewProject({ name: "", description: "" });
  }

  function getProjectsFromLocalStorage(): Project[] {
    return JSON.parse(localStorage.getItem("projects") || "[]");
  }

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  function deleteProject(id: string) {
    const lsprojects = getProjectsFromLocalStorage();
    const filtered = lsprojects.filter((project) => project.id !== id);
    localStorage.setItem("projects", JSON.stringify(filtered));
    setProjects(filtered);

    if (selectedProject === id) {
      setState("view");
      setSelectedProject("");
    }
  }

  function startEdit(project: Project) {
    setState("edit");
    setSelectedProject(project.id!);

    setUpdatedProject({
      name: project.name,
      description: project.description,
    });
  }

  function cancelEdit() {
    setState("view");
    setSelectedProject("");
    setUpdatedProject({ name: "", description: "" });
  }

  function updateProject(id: string) {
    const lsprojects = getProjectsFromLocalStorage();
    const projectIndex = lsprojects.findIndex((project) => project.id === id);

    if (projectIndex === -1) return;

    lsprojects[projectIndex] = {
      ...lsprojects[projectIndex],
      name:
        updatedProject.name.trim() !== ""
          ? updatedProject.name
          : lsprojects[projectIndex].name,
      description:
        updatedProject.description.trim() !== ""
          ? updatedProject.description
          : lsprojects[projectIndex].description,
    };

    localStorage.setItem("projects", JSON.stringify(lsprojects));
    setProjects(lsprojects);
    setState("view");
    setSelectedProject("");
    setUpdatedProject({ name: "", description: "" });
  }

  return (
    <div className="bg-white text-black px-12 py-2 max-w-7xl mx-auto">
      <div className="flex flex-col">
        <h1 className="mb-2">create new project</h1>
        <label htmlFor="">name</label>
        <input
          type="text"
          className="border-2 w-1/4"
          value={newProject.name}
          onChange={(e) =>
            setNewProject((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="">description</label>
        <input
          type="text"
          className="border-2 w-1/4"
          value={newProject.description}
          onChange={(e) =>
            setNewProject((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <div>
        <button
          className="px-2 py-1 rounded-md bg-gray-300 hover:bg-gray-500"
          onClick={() => saveInLocalStorage(newProject)}
        >
          create
        </button>
      </div>
      <div className="mt-6">
        <div className=" flex justify-between">
          <h2 className="text-lg font-semibold mb-2">Projects:</h2>
          <button
            className="px-2 py-1 rounded-md bg-red-300 hover:bg-red-500"
            onClick={() => {
              localStorage.clear();
              setProjects([]);
              setState("view");
              setSelectedProject("");
            }}
          >
            clear ls
          </button>
        </div>
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="border p-2 mb-2 max-w-xl flex justify-between"
          >
            <div>
              {!(state === "edit" && proj.id === selectedProject) && (
                <>
                  <h3 className="font-bold">id: {proj.id}</h3>
                  <h3 className="font-bold">name: {proj.name}</h3>
                  <p>desc: {proj.description}</p>
                </>
              )}

              {state === "edit" && proj.id === selectedProject && (
                <>
                  <h3 className="font-bold">id: {proj.id}</h3>
                  <div className="flex flex-col">
                    <div className="flex gap-2 ">
                      <label htmlFor="">name</label>
                      <input
                        type="text"
                        className="border "
                        value={updatedProject.name}
                        placeholder={proj.name}
                        onChange={(e) =>
                          setUpdatedProject((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2 ">
                      <label htmlFor="">desc</label>
                      <input
                        type="text"
                        className="border"
                        value={updatedProject.description}
                        placeholder={proj.description}
                        onChange={(e) =>
                          setUpdatedProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end">
              {!(state === "edit" && proj.id === selectedProject) ? (
                <button
                  className="px-4 py-1 rounded-md bg-blue-300 hover:bg-blue-500"
                  onClick={() => startEdit(proj)}
                >
                  edit
                </button>
              ) : (
                <>
                  <button
                    className="px-2 py-1 rounded-md bg-green-300 hover:bg-green-500"
                    onClick={() => updateProject(proj.id!)}
                  >
                    save
                  </button>
                  <button
                    className="px-2 py-1 rounded-md bg-gray-300 hover:bg-gray-500"
                    onClick={cancelEdit}
                  >
                    cancel
                  </button>
                </>
              )}
            </div>

            <div>
              <button
                className="text-xl text-red-500"
                onClick={() => deleteProject(proj.id!)}
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
