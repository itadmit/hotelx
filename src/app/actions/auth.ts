"use server";

import { signOut } from "@/app/api/auth/[...nextauth]/route";

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" });
}

