"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasHobby, setHasHobby] = useState(false);
  const [error, setError] = useState("");

  const chosenHobby = "none";
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !surname || !email || !password) {
      setError("Toate câmpurile sunt necesare (cu excepția casetei)");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name, surname: surname, email: email}),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("Acest utilizator deja există.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
          hasHobby,
          chosenHobby
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Înregistrați-vă</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nume"
            css_id="inputAuth"
          />
          <input
            onChange={(e) => setSurname(e.target.value)}
            type="text"
            placeholder="Prenume"
            css_id="inputAuth"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            css_id="inputAuth"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Parolă"
            css_id="inputAuth"
          />
          <label className="flex items-start">
            <input
              type="checkbox"
              onChange={(e) => setHasHobby(e.target.checked)}
              className="ml-2 mr-4 mt-1"
            />
            Persoana are hobby sau nu
          </label>
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Înregistrați-vă
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/"}>
            Aveți un cont deja? <span className="underline">Conectați-vă</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
