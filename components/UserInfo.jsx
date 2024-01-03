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
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Nume: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Prenume: <span className="font-bold">{session?.user?.surname}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <div>
          Are hobby: <span className="font-bold">{(session?.user?.hasHobby) ? "Da": "Nu"}</span>
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