// types.ts

export type Project = {
  id?: string;
  name: string;
  description: string;
  stories?: Story[];
};
export type User = {
  id: string;
  firstName: string;
  lastName: string;
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
