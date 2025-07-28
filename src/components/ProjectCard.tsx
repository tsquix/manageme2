import { useProjects } from "@/contexts/ProjectContext";
import type { Project } from "../types/index";
import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function ProjectCard({
  proj,
  showEdit,
  onClick,
}: {
  proj: Project;
  showEditOptions?: boolean;
}) {
  const { setActiveProject, deleteProject, updateProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({
    id: proj.id,
    name: proj.name,
    description: proj.description,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (editedProject.name.trim()) {
      updateProject(proj.id!, {
        name: editedProject.name,
        description: editedProject.description,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Czy na pewno chcesz usunąć ten projekt?")) {
      deleteProject(proj.id!);
    }
  };

  return (
    <div className="p-4">
      <div key={proj.id} className="border p-2 mb-2 max-w-lg">
        {!isEditing ? (
          <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
            <h3 className="font-bold">id: {proj.id}</h3>
            <h3 className="font-bold">name: {proj.name}</h3>
            <p>desc: {proj.description}</p>
          </div>
        ) : (
          <div>
            <h3 className="font-bold">id: {proj.id}</h3>
            <Input
              label="Nazwa"
              name="name"
              value={editedProject.name}
              onChange={handleChange}
              placeholder="Nazwa projektu"
            />
            <Input
              label="Opis"
              name="description"
              value={editedProject.description}
              onChange={handleChange}
              placeholder="Opis projektu"
            />
          </div>
        )}
        {showEdit && (
          <div className="flex gap-2 mt-2">
            {!isEditing ? (
              <>
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edytuj
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Usuń
                </Button>
              </>
            ) : (
              <>
                <Button variant="success" onClick={handleUpdate}>
                  Zapisz
                </Button>
                <Button variant="danger" onClick={() => setIsEditing(false)}>
                  Anuluj
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
