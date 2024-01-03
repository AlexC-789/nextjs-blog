"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginOrSettings() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
      return;
    }
    
    return (
      <Link className="text-sm inline-block p-4" href={session ? "/settings" : "/"}>
        <span className="underline">{session ? `${session.user.name} ${session.user.surname}` : "Conectați-vă"}</span>
      </Link>
    )
}