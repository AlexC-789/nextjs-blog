"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        name: name,
        surname: surname,
        email: email,
        password: password,
        redirect: false
      });

      if (res.error) {
        setError("Credențiale invalide");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Conectați-vă</h1>

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
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Conectați-vă
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <Link className="text-sm mt-3 text-left" href={"/dashboard"}>
              <span className="underline">Treceți peste</span>
            </Link>

            <Link className="text-sm mt-3 text-right" href={"/register"}>
              Nu aveți un cont? <span className="underline">Înregistrați-vă</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
