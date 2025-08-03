export type Project = {
  name: string;
  description: string;
  stories?: Story[];
};
export type Role = "developer" | "admin" | "devops";
export type User = {
  name: string;
  role: Role;
};

export type Priority = "niski" | "średni" | "wysoki";
export type Status = "todo" | "doing" | "done";

export type Story = {
  nazwa: string;
  opis: string;
  priorytet: Priority;
  projekt: string;
  dataUtworzenia: string;
  stan: Status;
  wlasciciel: string;
};

export type Task = {
  nazwa: string;
  opis: string;
  priorytet: Priority;
  storyId: string;
  przewidywanyCzas: number;
  stan: Status;
  createdAt: string;
  dataStartu?: string;
  dataZakonczenia?: string;
  odpowiedzialnyUzytkownik?: string;
};
export type AddEditView = "add" | "view" | "edit";
