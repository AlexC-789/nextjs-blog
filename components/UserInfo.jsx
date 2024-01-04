"use client"

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserInfo() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return;
  }
  if (!session) {
    redirect('/');
  }

  const { name, surname, email, hasHobby, chosenHobby } = session?.user;
  const reference = {
    "Nume": name, 
    "Prenume": surname, 
    "Email": email, 
    "Are hobby": hasHobby ? "Da" : "Nu", 
    "Hobby-ul ales": (chosenHobby !== "none") ? chosenHobby : "Neales"
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        {Object.keys(reference).map((key) => {
          return (
            <div key={`credential_${key}`}>
              {key}: <span className="font-bold">{reference[key]}</span>
            </div>
          )
        })}
        <button
          onClick={() => {signOut({callbackUrl: '/'})}}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Deconectați-vă
        </button>
      </div>
      
    </div>
  );
}