"use client"

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function UserInfo() {
  const { data: session, status } = useSession();

  const [emailIsShown, setEmailIsShown] = useState(false);

  if (status === 'loading') {
    return;
  }

  if (!session) {
    redirect('/');
  }

  const { name, surname, email, hasHobby, chosenHobbies } = session?.user;
  
  const hidingChar = '*';
  const hiddenEmail = hidingChar.repeat(7);

  const reference = {
    "Nume": name,
    "Prenume": surname,
    "Are hobby-uri": hasHobby ? "Da" : "Nu",
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
        <div style={{whiteSpace: chosenHobbies ? "pre-line" : "normal"}}>
          Hobby-uri alese: <br />
          <span className="font-bold">{chosenHobbies && chosenHobbies.length > 0 ? chosenHobbies.join('\n') : "Nealese"}</span>
        </div>
        <div>
          Email: <span className="font-bold">{emailIsShown ? email : hiddenEmail}</span>
          <br />
          <label>
            <input className="mr-2" type="checkbox" onClick={(e) => {setEmailIsShown(e.target.checked)}}/>
            Afișează email-ul
          </label>
        </div>
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