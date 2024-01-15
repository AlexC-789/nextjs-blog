"use client"

import LoginOrSettings from "@/components/LoginOrSettings"
import { useSession } from "next-auth/react"
import { Questions, ServerList } from "@/components/ForDashboard"

export default function Dashboard() {
  const {data: session, status} = useSession();
  if (status === "loading") {
    return;
  }
  
  const isInSearchOfHobby = !(session?.user?.hasHobby);
  const chosenHobbies = session?.user?.chosenHobbies;

  return (
    <>
      <LoginOrSettings />
      {(session?.user && chosenHobbies) ? ((isInSearchOfHobby) ? <Questions /> : <ServerList />) : null}
    </>
  )
}