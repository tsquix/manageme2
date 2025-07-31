export type Project = {
  id?: string;
  name: string;
  description: string;
  stories?: Story[];
};
export type Role = "developer" | "admin" | "devops";
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
};

export type Priority = "niski" | "średni" | "wysoki";
export type Status = "todo" | "doing" | "done";

export type Story = {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  projekt: string;
  dataUtworzenia: string;
  stan: Status;
  wlasciciel: string;
};

export type Task = {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  storyID: string;
  przewidywanyCzas: number;
  stan: Status;
  dataDodania: string;
  dataStartu?: string;
  dataZakonczenia?: string;
  odpowiedzialnyUzytkownik?: string;
};
export type AddEditView = "add" | "view" | "edit";
