import Link from "next/link";
import { signOut } from "next-auth/react";
import type { User } from "../types/index";
import { useSession } from "next-auth/react";
import axios from "axios";
const users: User[] = [
  {
    id: "0",
    firstName: "Jan",
    lastName: "Kowalski",
    role: "admin",
  },
  {
    id: "1",
    firstName: "Mariusz",
    lastName: "Trynalski",
    role: "developer",
  },
  {
    id: "2",
    firstName: "Arkadiusz",
    lastName: "Krawiec",
    role: "devops",
  },
];

export default function Header() {
  const { data: session } = useSession();
  // useEffect(() => {
  //   console.log(session);
  // }, [session]);

  const getUserData = async () => {
    try {
      const response = await axios.get("/api/user");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  return (
    <header className="flex flex-wrap items-center justify-between bg-green-200 text-black px-8 py-4 shadow-md">
      <nav className="flex gap-4 items-center">
        <Link
          href={"/"}
          className="px-4 py-1 bg-green-50 rounded-xl hover:bg-green-400 transition font-semibold"
        >
          Home
        </Link>
        <Link
          href={"/projects"}
          className="px-4 py-1 bg-green-50 rounded-xl hover:bg-green-400 transition font-semibold"
        >
          Projekty
        </Link>
        <Link
          href={"/tasks"}
          className="px-4 py-1 bg-green-50 rounded-xl hover:bg-green-400 transition font-semibold"
        >
          Zadania
        </Link>
      </nav>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-medium">
            Witaj,{" "}
            <span className="font-bold">
              {users[0].firstName} {users[0].lastName}
            </span>
          </span>
          <div className="hidden sm:block h-6 border-l border-green-400 mx-2" />
          <span className="font-medium">Użytkownicy:</span>
          <div className="flex gap-2">
            {users.map((user) => (
              <span
                key={user.id}
                className="px-2 py-0.5 rounded bg-green-100 text-xs font-semibold"
                title={user.role}
              >
                {user.role}: {user.firstName} {user.lastName}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => getUserData()}
            className="px-3 py-1 rounded-xl bg-green-50 hover:bg-green-300 transition text-sm"
          >
            Pobierz dane
          </button>
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-1 bg-green-50 rounded-xl hover:bg-red-400 transition font-semibold"
            >
              Wyloguj
            </button>
          ) : (
            <Link
              href={"/sign-up"}
              className="px-4 py-1 bg-green-50 rounded-xl hover:bg-green-400 transition font-semibold"
            >
              Rejestracja
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
