import { useProjects } from "@/contexts/ProjectContext";
import Link from "next/link";
import type { User } from "../types/index";
const mockUser: User = {
  id: "0",
  firstName: "Jan",
  lastName: "Kowalski",
};

// const mockStory: Story = {
//   id: "1",
//   nazwa: "Logowanie użytkownika",
//   opis: "Jako użytkownik chcę móc się zalogować, aby mieć dostęp do konta.",
//   priorytet: "wysoki",
//   projekt: "0", // np. ID projektu
//   dataUtworzenia: new Date().toISOString(),
//   stan: "todo",
//   wlasciciel: mockUser.id,
// };

export default function Header() {
  return (
    <div className=" flex bg-green-200 text-black gap-8 px-8 py-4">
      {" "}
      <Link
        href={"/"}
        className="px-5 py-1 bg-green-50 rounded-2xl hover:bg-green-400"
      >
        <span>home</span>
      </Link>
      <Link
        href={"/projects"}
        className="px-5 py-1 bg-green-50 rounded-2xl hover:bg-green-400"
      >
        <span>projects</span>
      </Link>
      <p>
        hello {mockUser.firstName} {mockUser.lastName}
      </p>
    </div>
  );
}
