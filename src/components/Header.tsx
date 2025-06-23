import React from "react";
import { auth } from "@/lib/auth";
import HeaderActions from "./HeaderActions";

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex items-center justify-between p-4">
      {/* Header client component */}
      <HeaderActions session={session!} />
    </header>
  );
}
