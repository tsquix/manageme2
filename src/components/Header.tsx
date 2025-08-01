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
      <Link
        href={"/tasks"}
        className="px-5 py-1 bg-green-50 rounded-2xl hover:bg-green-400"
      >
        <span>tasks</span>
      </Link>
      <p>
        hello {users[0].firstName} {users[0].lastName}
      </p>
      lista uzytkownikow:
      {users.map((user) => (
        <div key={user.id} className="px-2">
          {user.role} {user.firstName} {user.lastName}
        </div>
      ))}
      {session ? (
        <button
          onClick={() => signOut()}
          className="px-5 py-1 bg-green-50 rounded-2xl hover:bg-red-400"
        >
          Wyloguj
        </button>
      ) : (
        <Link
          href={"/sign-up"}
          className="px-5 py-1 bg-green-50 rounded-2xl hover:bg-green-400"
        >
          <span>sign-up</span>
        </Link>
      )}
      <button onClick={() => getUserData()}>get user data</button>
    </div>
  );
}
