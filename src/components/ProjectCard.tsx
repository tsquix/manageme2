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
  showEdit?: boolean;
}) {
  const { deleteProject, updateProject, isGuest } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({
    id: proj._id,
    name: proj.name,
    description: proj.description,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (editedProject.name.trim()) {
      updateProject(proj._id, {
        name: editedProject.name,
        description: editedProject.description,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Czy na pewno chcesz usunąć ten projekt? Zostaną również usunięte story do niego przypisane"
      )
    ) {
      deleteProject(proj._id);
    }
  };

  return (
    <div className="p-4">
      <div
        key={proj._id}
        className="border p-4 mb-4 max-w-lg rounded-xl shadow-md bg-white hover:shadow-xl transition-shadow duration-200"
      >
        {!isEditing ? (
          <div
            onClick={onClick}
            className={
              onClick
                ? "cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                : ""
            }
          >
            <h3 className="font-bold text-lg text-blue-700 mb-1">
              ID: {proj._id}
            </h3>
            <h3 className="font-bold text-xl mb-2">{proj.name}</h3>
            <p
              className="text-gray-600"
              data-testid={`project-desc-${proj.name}`}
            >
              {proj.description}
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-lg text-blue-700 mb-2">
              ID: {proj._id}
            </h3>
            <Input
              label="Nazwa"
              name="name"
              value={editedProject.name}
              onChange={handleChange}
              placeholder="Nazwa projektu"
              dataTestId="edit-project-name"
              className="mb-2"
            />
            <Input
              label="Opis"
              name="description"
              value={editedProject.description}
              onChange={handleChange}
              placeholder="Opis projektu"
              dataTestId="edit-project-desc"
              className="mb-2"
            />
          </div>
        )}
        {showEdit && !isGuest && (
          <div className="flex gap-2 mt-4">
            {!isEditing ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="w-24"
                  dataTestId={`edit-button-${editedProject.name}`}
                >
                  Edytuj
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="w-24"
                  dataTestId={`delete-button-${editedProject.name}`}
                >
                  Usuń
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="success"
                  onClick={handleUpdate}
                  className="w-24"
                  dataTestId={`save-button-${editedProject.name}`}
                >
                  Zapisz
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setIsEditing(false)}
                  className="w-24"
                >
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
