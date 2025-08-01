"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegiter, setShowRegister] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        console.error("Login error:", result?.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  if (!showRegiter)
    return (
      <>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            required
          />
          <button type="submit">Zaloguj się</button>
        </form>
        <button type="submit" onClick={() => setShowRegister(true)}>
          Załóz konto
        </button>
      </>
    );
  if (showRegiter) {
    return <RegisterForm setShowRegister={setShowRegister} />;
  }
}

export function RegisterForm({ setShowRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/");
      }
    } else {
      const error = await response.json();
      console.error("Registration error:", error);
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          required
        />
        <button type="submit">Zarejestruj się</button>
      </form>
      <button type="submit" onClick={() => setShowRegister(false)}>
        Mam już konto
      </button>
    </>
  );
}
