import { useState } from "react";
import type { Project } from "../types/index";
import { useProjects } from "@/contexts/ProjectContext";
import Button from "./ui/Button";
import Input from "./ui/Input";
import ProjectCard from "./ProjectCard";

export default function CreateProject({}) {
  const { projects, createProject } = useProjects();

  const [newProject, setNewProject] = useState<Project>({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='bg-white text-black px-12 py-2 max-w-7xl mx-auto'>
      <h1 className='mb-4 text-2xl font-bold'>Zarządzanie projektami</h1>

      <div className='mb-8 p-4 border rounded-lg'>
        <h2 className='mb-2 text-xl'>Utwórz nowy projekt</h2>

        <Input
          label='Nazwa'
          name='name'
          value={newProject.name}
          onChange={handleChange}
          placeholder='Nazwa projektu'
          className='w-full md:w-1/2'
        />

        <Input
          label='Opis'
          name='description'
          value={newProject.description}
          onChange={handleChange}
          placeholder='Opis projektu'
          className='w-full md:w-1/2'
        />

        <Button
          onClick={() => {
            if (newProject.name.trim()) {
              createProject(newProject);
              setNewProject({ name: "", description: "" });
            }
          }}
        >
          Utwórz
        </Button>
      </div>

      {projects.length > 0 ? (
        <div>
          <h2 className='mb-2 text-xl'>Lista projektów</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {projects.map((project) => (
              <ProjectCard key={project.id} proj={project} showEdit={true} />
            ))}
          </div>
        </div>
      ) : (
        <p>Brak projektów. Utwórz swój pierwszy projekt!</p>
      )}
    </div>
  );
}
