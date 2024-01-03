"use client"

import LoginOrSettings from "@/components/LoginOrSettings"
import { useSession } from "next-auth/react"
import { Dropdown, Questions } from "@/components/ForDashboard"

export default function Dashboard() {
  const {data: session, status} = useSession();
  if (status === "loading") {
    return;
  }
  const isInSearchOfHobby = !(session?.user?.hasHobby);
  const chosenHobby = session?.user?.chosenHobby;

  return(
    <>
      <LoginOrSettings />
      {(session?.user && chosenHobby == "none") ? ((isInSearchOfHobby) ? <Questions /> : <Dropdown />) : null}
    </>
  )
}